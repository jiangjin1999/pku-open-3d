"""Single trusted publisher. Contributor input is JSON, never executable checkout code."""
from pathlib import Path
import base64
import fcntl
import json
import os
import subprocess
import time
from urllib.parse import quote
import httpx
from PIL import Image, ImageStat
from .config import Settings
from .db import connect, initialize, dump, digest, now, audit
from .github import GitHub
from .models import ModelPart
from .service import validate_submission, problem


def heartbeat(s):
    with connect(s, True) as db:
        db.execute("INSERT INTO meta VALUES('worker_heartbeat',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(now()),))


def update(s, sid, state, report=None, **fields):
    allowed = {"pr_number", "pr_head"}
    if set(fields)-allowed:
        raise ValueError("Invalid update")
    clauses, values = ["state=?", "updated_at=?"], [state, now()]
    if report is not None:
        clauses.append("report=?"); values.append(dump(report))
    for key, value in fields.items():
        clauses.append(key+"=?"); values.append(value)
    with connect(s, True) as db:
        # Withdrawal or source edits during a render must win over worker completion.
        current = db.execute("SELECT state FROM submissions WHERE id=?", (sid,)).fetchone()
        if current and current[0] in ("withdrawn", "changes_requested") and state not in ("withdrawn", "changes_requested"):
            return False
        db.execute("UPDATE submissions SET "+",".join(clauses)+" WHERE id=?", values+[sid])
    return True


def check_render(s, submission):
    model = ModelPart.model_validate_json(submission["document"])
    folder = s.data / "jobs" / submission["id"]
    folder.mkdir(parents=True, exist_ok=True, mode=0o700)
    candidate = folder/"model.json"
    candidate.write_text(dump(model.model_dump()))
    command = [os.environ.get("PKU_NODE", "node"), str(s.root/"scripts/check-model.mjs"), str(candidate), str(folder)]
    process = subprocess.Popen(command, cwd=s.root, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
                               env={**os.environ, "NODE_OPTIONS": "--max-old-space-size=4096"})
    started = time.monotonic()
    while True:
        try:
            output, error = process.communicate(timeout=20)
            break
        except subprocess.TimeoutExpired:
            heartbeat(s)
            if time.monotonic()-started > 240:
                process.kill(); process.communicate()
                raise ValueError("模型渲染超时，请减少本次修改范围")
    if process.returncode:
        # Do not expose host paths, environment or arbitrary exception output publicly.
        (folder/"render-error.log").write_text(error[-20000:])
        raise ValueError("模型渲染检查失败；请检查几何及节点层级，维护者可查看构建日志")
    report = json.loads((folder/"render.json").read_text())
    with Image.open(folder/"preview.png") as image:
        variation = sum(ImageStat.Stat(image.convert("RGB")).stddev)
    if variation < 3:
        raise ValueError("预览图未显示有效模型")
    return {**report, "content_hash": submission["content_hash"], "source_check": "passed", "verification": "待实地核对"}


def public_place(db, place_id):
    row = db.execute("SELECT document FROM places WHERE id=?", (place_id,)).fetchone()
    if not row:
        raise ValueError("地点已不可用")
    source = json.loads(row[0])
    return {k: source[k] for k in ("id", "name", "kind", "parent_id", "longitude", "latitude", "centre", "pick_id", "source_id") if k in source}


def publication_files(s, submission, db):
    doc = json.loads(submission["document"])
    files = {"models/parts/"+doc["part_id"]+".json": dump(doc)+"\n"}
    place_id = doc["place_id"]
    while place_id and place_id != "yanyuan":
        p = public_place(db, place_id)
        files["models/places/"+place_id+".json"] = dump(p)+"\n"
        place_id = p.get("parent_id")
    return files


def repo_json(gh, repo, path, ref):
    value = gh.request("GET", f"/repos/{repo}/contents/{path}", params={"ref": ref})
    if value.get("encoding") != "base64":
        value = gh.request("GET", f"/repos/{repo}/git/blobs/{value['sha']}")
    return json.loads(base64.b64decode(value["content"]))


def build_branch(gh, s, submission, files, base, create):
    prefix = "/repos/"+s.repo
    commit = gh.request("GET", prefix+"/git/commits/"+base)
    entries = []
    for path, content in files.items():
        blob = gh.request("POST", prefix+"/git/blobs", json={"content": content, "encoding": "utf-8"})
        entries.append({"path": path, "mode": "100644", "type": "blob", "sha": blob["sha"]})
    tree = gh.request("POST", prefix+"/git/trees", json={"base_tree": commit["tree"]["sha"], "tree": entries})
    new_commit = gh.request("POST", prefix+"/git/commits", json={"message": "model: "+json.loads(submission["document"])["title"], "tree": tree["sha"], "parents": [base]})
    branch = "model/"+submission["id"]
    if create:
        gh.request("POST", prefix+"/git/refs", json={"ref": "refs/heads/"+branch, "sha": new_commit["sha"]})
    else:
        gh.request("PATCH", prefix+"/git/refs/heads/"+branch, json={"sha": new_commit["sha"], "force": True})
    return branch, new_commit["sha"]


def open_pr(s, gh, submission):
    prefix = "/repos/"+s.repo
    branch = "model/"+submission["id"]
    # Recover a PR created just before a process restart without creating duplicates.
    existing = gh.request("GET", prefix+"/pulls", params={"state":"all", "head":s.repo.split('/')[0]+":"+branch, "base":"main"})
    if existing:
        pr = existing[0]
        update(s, submission["id"], "pr_open", pr_number=pr["number"], pr_head=pr["head"]["sha"])
        return pr
    with connect(s) as db:
        validate_submission(db, submission["task_id"], submission["owner"], ModelPart.model_validate_json(submission["document"]), accepted=True)
        files = publication_files(s, submission, db)
    base = gh.request("GET", prefix+"/git/ref/heads/main")["object"]["sha"]
    try:
        gh.request("GET", prefix+"/git/ref/heads/"+branch)
        create = False
    except httpx.HTTPStatusError as e:
        if e.response.status_code != 404:
            raise
        create = True
    branch, head = build_branch(gh, s, submission, files, base, create)
    model = json.loads(submission["document"])
    body = (f"完善 **{model['title']}**，由 @{submission['owner']} 通过任务 {submission['task_id']} 提交。\n\n"
            "该提交仅包含声明式模型和目标地点信息。原始照片不随 PR 发布。\n\n"
            f"模型内容校验：`{submission['content_hash']}`。几何、资源上限和浏览器渲染检查已通过；现实准确性仍待核对。\n\n"
            f"[模型预览]({s.public_url}/preview/?submission={submission['id']}) · "
            f"[任务记录]({s.public_url}/tasks/?id={submission['task_id']})\n\n"
            f"![模型渲染]({s.public_url}/api/v1/submissions/{submission['id']}/image)")
    pr = gh.request("POST", prefix+"/pulls", json={"title":"完善模型："+model["title"], "head":branch, "base":"main", "body":body})
    update(s, submission["id"], "pr_open", pr_number=pr["number"], pr_head=head)
    return pr


def publish_pr(s, gh, submission):
    prefix = "/repos/"+s.repo
    pr = gh.request("GET", prefix+f"/pulls/{submission['pr_number']}")
    if pr["base"]["repo"]["full_name"].lower() != s.repo.lower() or pr["base"]["ref"] != "main":
        raise ValueError("PR 目标仓库或分支不匹配")
    if pr["head"]["ref"] != "model/"+submission["id"] or pr["head"]["repo"]["full_name"].lower()!=s.repo.lower():
        raise ValueError("PR 来源分支不匹配")
    if pr["state"] == "closed" and not pr.get("merged"):
        raise ValueError("PR 已关闭，未发布")
    if pr["head"]["sha"] != submission["pr_head"]:
        raise ValueError("PR 内容在检查后发生变化，需要重新提交")
    with connect(s) as db:
        files = publication_files(s, submission, db)
    changed = gh.request("GET", prefix+f"/pulls/{submission['pr_number']}/files", params={"per_page":100})
    if len(changed) >= 100:
        raise ValueError("自动发布涉及的文件过多，请拆分地点层级；不能省略后续文件检查")
    if {f["filename"] for f in changed}-set(files) or any(f["status"] not in ("added", "modified") for f in changed):
        raise ValueError("自动发布仅接受本次模型与地点的 JSON 文件")
    for path, expected in files.items():
        if dump(repo_json(gh, s.repo, path, pr["head"]["sha"])) != dump(json.loads(expected)):
            raise ValueError("仓库内容与已检查模型不同")
    base = gh.request("GET", prefix+"/git/ref/heads/main")["object"]["sha"]
    if not pr.get("merged") and pr["base"]["sha"] != base:
        # The next pass checks the rebased head again. Only this App-owned branch is changed.
        branch, head = build_branch(gh, s, submission, files, base, False)
        update(s, submission["id"], "pr_open", pr_head=head)
        return False
    model = ModelPart.model_validate_json(submission["document"])
    report = json.loads(submission["report"])
    if report.get("content_hash") != submission["content_hash"] or not report.get("ok"):
        raise ValueError("缺少此版本的渲染检查记录")
    if not pr.get("merged"):
        gh.request("POST", prefix+"/check-runs", json={"name":"community/model-validation", "head_sha":pr["head"]["sha"],
            "status":"completed", "conclusion":"success", "output":{"title":"模型检查通过", "summary":"声明式数据、资料引用、几何、资源和浏览器渲染检查通过。待实地核对。"}})
    with connect(s, True) as db:
        current = db.execute("SELECT * FROM submissions WHERE id=?", (submission["id"],)).fetchone()
        if current["state"] in ("withdrawn", "changes_requested"):
            return False
        if db.execute("SELECT value FROM meta WHERE key='auto_publish'").fetchone()[0] != "true":
            return False
        validate_submission(db, submission["task_id"], submission["owner"], model, accepted=True)
        if not pr.get("merged"):
            # GitHub atomically checks the exact head SHA; local transaction protects source/revision state.
            result = gh.request("PUT", prefix+f"/pulls/{submission['pr_number']}/merge", json={"sha":pr["head"]["sha"], "merge_method":"squash"})
            if not result.get("merged"):
                raise ValueError("GitHub 暂未允许合并")
            commit_sha = result["sha"]
        else:
            commit_sha = pr["merge_commit_sha"]
        # Never publish data merely because an external check claims success.
        saved = repo_json(gh, s.repo, "models/parts/"+model.part_id+".json", commit_sha)
        if digest(dump(saved)) != submission["content_hash"]:
            raise ValueError("合并后的模型内容不匹配，保留上一版本")
        db.execute("UPDATE revisions SET active=0 WHERE part_id=?", (model.part_id,))
        db.execute("INSERT INTO revisions VALUES(?,?,?,?,?,?,1,?) ON CONFLICT(id) DO UPDATE SET active=1",
            (submission["content_hash"], model.part_id, submission["id"], model.place_id, dump(saved), commit_sha, now()))
        db.execute("UPDATE submissions SET state='published',updated_at=? WHERE id=?", (now(), submission["id"]))
        db.execute("UPDATE tasks SET state='published',updated_at=? WHERE id=?", (now(), submission["task_id"]))
        audit(db, "publisher", "model.published", submission["content_hash"], {"commit":commit_sha,"part_id":model.part_id})
    return True


def process_one(s, renderer=check_render, gh=None):
    heartbeat(s)
    # Load credentials created by the setup page without needing to restart the worker.
    s.prepare()
    with connect(s) as db:
        if db.execute("SELECT value FROM meta WHERE key='auto_publish'").fetchone()[0] != "true":
            states = ("preview_queued",)
        else:
            states = ("preview_queued", "queued", "waiting_setup", "pr_open")
        row = db.execute("SELECT * FROM submissions WHERE state IN ("+",".join("?" for _ in states)+") ORDER BY updated_at ASC LIMIT 1", states).fetchone()
    if not row:
        return False
    submission = dict(row)
    preview_only = submission["state"] == "preview_queued"
    try:
        if submission["state"] in ("queued", "preview_queued"):
            with connect(s) as db:
                validate_submission(db, submission["task_id"], submission["owner"], ModelPart.model_validate_json(submission["document"]), accepted=True)
            if not update(s, submission["id"], "preview_checking" if preview_only else "checking"):
                return True
            report = renderer(s, submission)
            if preview_only:
                update(s, submission["id"], "preview_ready", report)
                return True
            if not update(s, submission["id"], "waiting_setup", report):
                return True
            submission["report"] = dump(report)
            submission["state"] = "waiting_setup"
        if not s.publisher_ready and gh is None:
            update(s, submission["id"], "waiting_setup")
            return False
        gh = gh or GitHub(s)
        if submission["state"] == "waiting_setup":
            open_pr(s, gh, submission)
            return True
        if submission["state"] == "pr_open":
            publish_pr(s, gh, submission)
            return True
    except httpx.HTTPError as e:
        # Temporary network errors keep the retryable stage and its validated report.
        report = json.loads(submission["report"])
        report["network_note"] = "GitHub 暂时不可访问，稍后自动重试"
        update(s, submission["id"], "pr_open" if submission["pr_number"] else "waiting_setup", report)
        return False
    except Exception as e:
        message = getattr(e, "detail", None) or str(e)
        if not isinstance(message, str) or len(message) > 500:
            message = "模型检查未完成，请查看本次任务与版本"
        update(s, submission["id"], "failed", {"error": message})
        with connect(s, True) as db:
            db.execute("UPDATE tasks SET state='changes_requested',updated_at=? WHERE id=? AND state NOT IN ('published','needs_context')", (now(), submission["task_id"]))
        return True
    return False


def main():
    s = Settings(); initialize(s)
    lock = (s.data/"worker.lock").open("w")
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    with connect(s, True) as db:
        db.execute("UPDATE submissions SET state='queued' WHERE state='checking'")
        db.execute("UPDATE submissions SET state='preview_queued' WHERE state='preview_checking'")
    while True:
        try:
            active = process_one(s)
        except Exception:
            active = False
        time.sleep(2 if active else 15)


if __name__ == "__main__":
    main()

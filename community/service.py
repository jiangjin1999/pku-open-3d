import hashlib
import io
import json
import math
import os
import sqlite3
from pathlib import Path
from PIL import Image, ImageOps, UnidentifiedImageError
from pillow_heif import register_heif_opener
from fastapi import HTTPException
from .db import audit, connect, digest, dump, now, token, uid
from .models import Annotation, ModelPart

register_heif_opener()
Image.MAX_IMAGE_PIXELS = 40_000_000


def problem(status, message):
    raise HTTPException(status, message)


def require_receipt(db, observation_id, key):
    row = db.execute("SELECT * FROM observations WHERE id=?", (observation_id,)).fetchone()
    if not row or not key or not __import__("hmac").compare_digest(row["receipt_hash"], digest(key)):
        problem(404, "提交凭证无效或不存在")
    return row


def require_claim(db, task_id, login):
    row = db.execute("SELECT * FROM tasks WHERE id=?", (task_id,)).fetchone()
    if not row:
        problem(404, "任务不存在")
    if row["claimant"] != login or (row["claim_until"] or 0) <= now():
        problem(403, "请先认领这个任务，或续期后访问资料")
    return row


def place_ready(db, place_id):
    seen = set()
    while place_id and place_id not in seen:
        seen.add(place_id)
        p = db.execute("SELECT * FROM places WHERE id=?", (place_id,)).fetchone()
        if not p:
            return False
        doc = json.loads(p["document"])
        if doc.get("longitude") is not None and doc.get("latitude") is not None:
            return True
        # A building cannot inherit the centre of an entire region.
        if p["kind"] == "building":
            return False
        place_id = p["parent_id"]
    return False


def create_place(db, item):
    parent = db.execute("SELECT * FROM places WHERE id=?", (item.parent_id,)).fetchone()
    if not parent:
        problem(422, "上级地点不存在")
    if item.kind in ("floor", "room", "detail") and parent["kind"] == "region":
        problem(422, "楼层和室内空间需要关联到具体建筑")
    place_id = uid("pl")
    doc = item.model_dump(exclude={"position"}) | {"id": place_id}
    if item.position:
        doc |= item.position.model_dump()
        doc["centre"] = [(item.position.longitude-116.304)*85403.82148988487,
                         (39.992-item.position.latitude)*111034.47884251377]
    db.execute("INSERT INTO places VALUES(?,?,?,?,?,?)", (place_id, item.parent_id, item.kind, item.name, dump(doc), now()))
    return place_id


def create_observation(settings, annotation):
    observation_id, task_id, receipt = uid("obs"), uid("task"), token()
    with connect(settings, True) as db:
        place_id = annotation.place_id or create_place(db, annotation.new_place)
        p = db.execute("SELECT * FROM places WHERE id=?", (place_id,)).fetchone()
        if not p:
            problem(422, "地点不存在")
        doc = annotation.model_dump() | {"place_id": place_id, "new_place": None}
        state = "awaiting_upload" if annotation.kind == "photo" else ("ready" if place_ready(db, place_id) else "needs_context")
        db.execute("INSERT INTO observations VALUES(?,?,?,?,?,?,?,?)",
            (observation_id, place_id, annotation.kind, dump(doc), digest(receipt), state, now(), now()))
        # Named columns below make the timestamp/claim shape explicit.
        db.execute("INSERT INTO tasks(id,place_id,title,kind,part_hint,state,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)",
            (task_id, place_id, f"{'完善' if annotation.kind=='photo' else '核对'}{p['name']} · {annotation.part}",
             annotation.kind, annotation.part, "open" if state == "ready" else state, now(), now()))
        db.execute("INSERT INTO task_sources VALUES(?,?)", (task_id, observation_id))
        # Existing photographs of the same part help a feedback-only contributor.
        for row in db.execute("SELECT id,document FROM observations WHERE place_id=? AND kind='photo' AND state='ready'", (place_id,)):
            if json.loads(row["document"])["part"] == annotation.part:
                db.execute("INSERT OR IGNORE INTO task_sources VALUES(?,?)", (task_id, row["id"]))
        audit(db, "anonymous", "observation.created", observation_id)
    return {"id": observation_id, "task_id": task_id, "receipt": receipt, "state": state,
            "receipt_url": f"/receipt/#id={observation_id}&key={receipt}"}


def upload_photo(settings, observation_id, receipt, content):
    if len(content) > settings.max_photo_bytes:
        problem(413, "每张照片最多 20 MB")
    try:
        with Image.open(io.BytesIO(content)) as original:
            if original.format not in ("JPEG", "PNG", "WEBP", "HEIF", "AVIF"):
                problem(422, "请选择 JPEG、PNG、WebP 或 HEIC 照片")
            if getattr(original, "is_animated", False):
                problem(422, "请上传静态照片")
            if original.width*original.height > Image.MAX_IMAGE_PIXELS:
                problem(422, "照片超过 4000 万像素，请适当裁剪")
            image = ImageOps.exif_transpose(original).convert("RGB")
            if image.width < 32 or image.height < 32:
                problem(422, "照片尺寸过小")
            out = io.BytesIO()
            image.save(out, format="JPEG", quality=95, subsampling=0)
            clean = out.getvalue()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError, ValueError):
        problem(422, "照片无法解码，请重新导出后上传")
    photo_id, sha = uid("photo"), hashlib.sha256(clean).hexdigest()
    filename = photo_id+".jpg"
    with connect(settings, True) as db:
        observation = require_receipt(db, observation_id, receipt)
        if observation["state"] == "withdrawn":
            problem(409, "此提交不接受照片")
        existing = db.execute("SELECT id FROM photos WHERE observation_id=? AND sha256=?", (observation_id, sha)).fetchone()
        if existing:
            return {"id": existing["id"], "duplicate": True}
        count = db.execute("SELECT COUNT(*) FROM photos WHERE observation_id=?", (observation_id,)).fetchone()[0]
        if count >= 10:
            problem(422, "每次提交最多 10 张照片，可分批继续提交")
        used = db.execute("SELECT COALESCE(SUM(bytes),0) FROM photos").fetchone()[0]
        if used+len(clean) > settings.quota_bytes:
            problem(507, "资料空间暂时已满，请稍后重试")
        path = settings.data / "photos" / filename
        try:
            with path.open("xb") as f:
                os.chmod(path, 0o600)
                f.write(clean)
            db.execute("INSERT INTO photos VALUES(?,?,?,?,?,?,?,?)",
                (photo_id, observation_id, filename, sha, len(clean), image.width, image.height, now()))
        except BaseException:
            path.unlink(missing_ok=True)
            raise
    return {"id": photo_id, "width": image.width, "height": image.height}


def complete_observation(settings, observation_id, receipt):
    with connect(settings, True) as db:
        row = require_receipt(db, observation_id, receipt)
        if row["state"] == "withdrawn":
            problem(409, "资料已撤回")
        if row["kind"] == "photo" and not db.execute("SELECT 1 FROM photos WHERE observation_id=?", (observation_id,)).fetchone():
            problem(422, "请至少上传一张照片")
        state = "ready" if place_ready(db, row["place_id"]) else "needs_context"
        db.execute("UPDATE observations SET state=?,updated_at=? WHERE id=?", (state, now(), observation_id))
        db.execute("UPDATE tasks SET state=?,updated_at=? WHERE id IN (SELECT task_id FROM task_sources WHERE observation_id=?) AND state IN ('awaiting_upload','needs_context')",
            ("open" if state == "ready" else state, now(), observation_id))
    return {"id": observation_id, "state": state}


def validate_submission(db, task_id, login, model, accepted=False):
    if accepted:
        task = db.execute("SELECT * FROM tasks WHERE id=?", (task_id,)).fetchone()
        if not task or task["claimant"] != login:
            problem(409, "任务认领者已变更，请重新领取资料")
    else:
        task = require_claim(db, task_id, login)
    if model.task_id != task_id or model.place_id != task["place_id"]:
        problem(422, "模型必须对应当前任务和地点")
    if task["state"] not in ("claimed", "submitted", "changes_requested"):
        problem(409, "当前任务不接受新模型，请重新查看任务状态")
    sources = {r[0] for r in db.execute("SELECT o.id FROM task_sources s JOIN observations o ON o.id=s.observation_id WHERE s.task_id=? AND o.state='ready'", (task_id,))}
    if any(e.observation_id not in sources for e in model.evidence):
        problem(422, "模型引用了任务之外或已撤回的资料")
    current = db.execute("SELECT * FROM revisions WHERE part_id=? AND active=1", (model.part_id,)).fetchone()
    if (current["id"] if current else None) != model.base_revision:
        problem(409, "这个部位已有新版本，请获取最新模型后重新合并")
    if current and current["place_id"] != model.place_id:
        problem(409, "部位编号已属于另一个地点")
    # A partial floor can inherit the building coordinate, but not an unrelated place.
    place_id = model.place_id
    while place_id:
        place = db.execute("SELECT * FROM places WHERE id=?", (place_id,)).fetchone()
        doc = json.loads(place["document"])
        if doc.get("centre"):
            if math.hypot(model.origin[0]-doc["centre"][0], model.origin[2]-doc["centre"][1]) > 300:
                problem(422, "模型原点离标注地点超过 300 米，请核对坐标")
            break
        place_id = place["parent_id"]
    return task


def submit_model(settings, task_id, login, model, preview_only=False):
    document = dump(model.model_dump())
    if len(document.encode()) > settings.max_model_bytes:
        problem(413, "模型包过大，请拆分部位")
    content_hash = digest(document)
    with connect(settings, True) as db:
        # A retry of an already accepted package must return its original result.
        require_claim(db, task_id, login)
        old = db.execute("SELECT * FROM submissions WHERE task_id=? AND content_hash=? AND owner=?", (task_id, content_hash, login)).fetchone()
        if old:
            if old["state"] in ("failed", "changes_requested") or (not preview_only and old["state"] == "preview_ready"):
                validate_submission(db, task_id, login, model)
                if old["pr_number"]:
                    problem(409, "已有 PR 的失败提交请修改模型后重试，以保留原记录")
                state = "preview_queued" if preview_only else "queued"
                db.execute("UPDATE submissions SET state=?,report='{}',updated_at=? WHERE id=?", (state, now(), old["id"]))
                if not preview_only:
                    db.execute("UPDATE tasks SET state='submitted',updated_at=? WHERE id=?", (now(), task_id))
                return {"id": old["id"], "state": state, "content_hash": content_hash}
            return dict(old) | {"document": None}
        duplicate = db.execute("SELECT 1 FROM submissions WHERE task_id=? AND content_hash=?", (task_id,content_hash)).fetchone()
        if duplicate:
            problem(409, "该任务已有参与者提交过相同内容，请先查看任务记录，再提交自己的修正版本")
        validate_submission(db, task_id, login, model)
        active = db.execute("SELECT id FROM submissions WHERE part_id=? AND state IN ('queued','checking','waiting_setup','pr_open','publishing')", (model.part_id,)).fetchone()
        if active:
            problem(409, "该部位已有处理中版本，请等待或撤销原提交")
        submission_id = uid("sub")
        db.execute("INSERT INTO submissions(id,task_id,part_id,owner,document,content_hash,state,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",
            (submission_id, task_id, model.part_id, login, document, content_hash, "preview_queued" if preview_only else "queued", now(), now()))
        if not preview_only:
            db.execute("UPDATE tasks SET state='submitted',updated_at=? WHERE id=?", (now(), task_id))
        audit(db, login, "model.submitted", submission_id, {"task_id": task_id, "hash": content_hash})
    return {"id": submission_id, "state": "preview_queued" if preview_only else "queued", "content_hash": content_hash, "preview_url": "/preview/?submission="+submission_id}

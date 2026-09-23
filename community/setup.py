"""One-time GitHub App bootstrap. Every mutation requires a local setup secret/session."""
import hmac
import json
import os
from pathlib import Path
from urllib.parse import urlencode
import httpx
from fastapi import Request
from fastapi.responses import JSONResponse, RedirectResponse
from .db import connect, digest, dump, now, token
from .github import GitHub
from .service import problem


def save_credentials(s, values):
    path = s.data / "secrets/github-app.json"
    old = json.loads(path.read_text()) if path.exists() else {}
    old.update(values)
    temporary = path.with_suffix(".tmp")
    fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f:
        f.write(dump(old))
    temporary.replace(path)
    for key, value in values.items():
        if hasattr(s, key):
            setattr(s, key, str(value))


def register_setup(app, s):
    def setup_session(request):
        raw = request.cookies.get("pku_setup", "")
        with connect(s) as db:
            valid = db.execute("SELECT 1 FROM oauth_states WHERE hash=? AND next_path='setup-session' AND expires>?", (digest(raw), now())).fetchone()
        if not valid:
            problem(403, "配置会话已过期，请使用服务器生成的配置凭证重新开始")

    @app.post("/api/v1/setup/github/start")
    def start(request: Request):
        provided = request.headers.get("authorization", "").removeprefix("Bearer ")
        if not s.setup_key or not hmac.compare_digest(provided, s.setup_key):
            problem(403, "配置凭证无效")
        if s.auth_ready:
            problem(409, "GitHub App 已配置，请在应用设置中修改回调地址")
        state, cookie = token(), token()
        with connect(s, True) as db:
            db.execute("INSERT INTO oauth_states VALUES(?,?,?)", (digest(state), "setup:"+digest(cookie), now()+3600))
            db.execute("INSERT INTO oauth_states VALUES(?,?,?)", (digest(cookie), "setup-session", now()+3600))
        manifest = {"name": "pku-open3d-"+s.admin_login, "url": s.public_url,
            "description": "共建北大：身份登录和本仓库模型贡献自动发布。",
            "public": True, "hook_attributes": {"url": s.public_url+"/api/v1/github/webhook", "active": False},
            "redirect_url": s.public_url+"/api/v1/setup/github/callback",
            "callback_urls": [s.public_url+"/api/v1/auth/callback"],
            "setup_url": s.public_url+"/api/v1/setup/github/installed",
            "default_permissions": {"contents": "write", "pull_requests": "write", "checks": "write", "metadata": "read"},
            "default_events": []}
        response = JSONResponse({"manifest": manifest, "action": "https://github.com/settings/apps/new?"+urlencode({"state": state})})
        response.set_cookie("pku_setup", cookie, httponly=True, secure=s.public_url.startswith("https:"), samesite="lax", max_age=3600)
        return response

    @app.get("/api/v1/setup/github/callback")
    async def callback(request: Request, code: str = "", state: str = ""):
        setup_session(request)
        if s.auth_ready:
            problem(409, "应用已配置")
        with connect(s, True) as db:
            row = db.execute("SELECT * FROM oauth_states WHERE hash=? AND expires>?", (digest(state), now())).fetchone()
            if not row or row["next_path"] != "setup:"+digest(request.cookies.get("pku_setup", "")):
                problem(400, "配置状态不匹配")
            db.execute("DELETE FROM oauth_states WHERE hash=?", (digest(state),))
        if not code or not code.isalnum():
            problem(400, "GitHub 返回的配置码无效")
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post("https://api.github.com/app-manifests/"+code+"/conversions", headers={"Accept": "application/vnd.github+json"})
        if r.status_code != 201:
            problem(502, "GitHub 应用创建尚未完成，请重新打开配置页")
        result = r.json()
        key = s.data/"secrets/github-app.pem"
        fd = os.open(key, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(fd, "w") as f:
            f.write(result["pem"])
        save_credentials(s, {"github_app_id": result["id"], "github_client_id": result["client_id"],
            "github_client_secret": result["client_secret"], "github_key_file": str(key), "slug": result["slug"]})
        return RedirectResponse("https://github.com/apps/"+result["slug"]+"/installations/new")

    @app.get("/api/v1/setup/github/installed")
    def installed(request: Request, installation_id: int):
        setup_session(request)
        s.github_installation_id = str(installation_id)
        try:
            gh = GitHub(s)
            repo = gh.request("GET", "/repos/"+s.repo)
            if repo["full_name"].lower() != s.repo.lower():
                raise ValueError("Wrong repository")
        except Exception:
            s.github_installation_id = ""
            problem(400, "请仅为目标仓库安装应用，再重试")
        save_credentials(s, {"github_installation_id": installation_id})
        response = RedirectResponse("/setup/?complete=1")
        response.delete_cookie("pku_setup")
        return response

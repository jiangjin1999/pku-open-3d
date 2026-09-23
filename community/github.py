"""GitHub identity and repository-scoped App credentials; never handles AI credentials."""
from pathlib import Path
import time
import httpx
import jwt


class GitHub:
    def __init__(self, settings):
        self.settings = settings
        self._installation_token = None
        self._token_deadline = 0

    def installation_token(self):
        s = self.settings
        if not s.publisher_ready:
            raise RuntimeError("GitHub App 尚未安装到本项目仓库")
        if self._token_deadline > time.time():
            return self._installation_token
        claim = jwt.encode({"iat": int(time.time())-60, "exp": int(time.time())+540,
                            "iss": s.github_app_id}, Path(s.github_key_file).read_text(), algorithm="RS256")
        r = httpx.post(f"https://api.github.com/app/installations/{s.github_installation_id}/access_tokens",
                       headers={"Authorization": "Bearer " + claim, "Accept": "application/vnd.github+json"},
                       json={"repositories": [s.repo.split("/")[1]]}, timeout=30)
        r.raise_for_status()
        self._installation_token = r.json()["token"]
        self._token_deadline = time.time()+3000
        return self._installation_token

    def request(self, method, path, **kwargs):
        r = httpx.request(method, "https://api.github.com"+path,
                          headers={"Authorization": "Bearer "+self.installation_token(),
                                   "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"},
                          timeout=40, **kwargs)
        r.raise_for_status()
        return r.json() if r.content else None

    async def login(self, code):
        s = self.settings
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post("https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"}, data={"client_id": s.github_client_id,
                "client_secret": s.github_client_secret, "code": code,
                "redirect_uri": s.public_url+"/api/v1/auth/callback"})
            response.raise_for_status()
            value = response.json()
            if not value.get("access_token"):
                raise ValueError("GitHub 授权未完成")
            identity = await client.get("https://api.github.com/user",
                headers={"Authorization": "Bearer "+value["access_token"], "Accept": "application/vnd.github+json"})
            identity.raise_for_status()
            # Keep only the login. The identity token is neither stored nor returned.
            return identity.json()["login"]

from dataclasses import dataclass, field
from pathlib import Path
import os
import json

ROOT = Path(__file__).resolve().parents[1]


@dataclass
class Settings:
    root: Path = ROOT
    data: Path = field(default_factory=lambda: Path(os.environ.get("PKU_DATA_DIR", ROOT / ".local/data")))
    public_url: str = field(default_factory=lambda: os.environ.get("PKU_PUBLIC_URL", "http://127.0.0.1:18430").rstrip("/"))
    repo: str = "jiangjin1999/pku-open-3d"
    admin_login: str = field(default_factory=lambda: os.environ.get("PKU_ADMIN_LOGIN", "jiangjin1999"))
    github_client_id: str = field(default_factory=lambda: os.environ.get("PKU_GITHUB_CLIENT_ID", ""))
    github_client_secret: str = field(default_factory=lambda: os.environ.get("PKU_GITHUB_CLIENT_SECRET", ""))
    github_app_id: str = field(default_factory=lambda: os.environ.get("PKU_GITHUB_APP_ID", ""))
    github_installation_id: str = field(default_factory=lambda: os.environ.get("PKU_GITHUB_INSTALLATION_ID", ""))
    github_key_file: str = field(default_factory=lambda: os.environ.get("PKU_GITHUB_KEY_FILE", ""))
    setup_key: str = field(default_factory=lambda: os.environ.get("PKU_SETUP_KEY", ""))
    quota_bytes: int = field(default_factory=lambda: int(os.environ.get("PKU_PHOTO_QUOTA_GB", "50")) * 1024**3)
    max_photo_bytes: int = 20 * 1024**2
    max_body_bytes: int = 24 * 1024**2
    max_model_bytes: int = 12 * 1024**2
    claim_seconds: int = 86400
    test_mode: bool = False

    @property
    def database(self):
        return self.data / "community.sqlite3"

    @property
    def auth_ready(self):
        return bool(self.github_client_id and self.github_client_secret)

    @property
    def publisher_ready(self):
        return bool(self.github_app_id and self.github_installation_id and self.github_key_file)

    def prepare(self):
        self.data.mkdir(parents=True, exist_ok=True, mode=0o700)
        for name in ("photos", "previews", "published", "jobs", "secrets", "backups"):
            (self.data / name).mkdir(exist_ok=True, mode=0o700)
        saved = self.data / "secrets/github-app.json"
        if saved.is_file():
            value = json.loads(saved.read_text())
            for key in ("github_client_id", "github_client_secret", "github_app_id", "github_installation_id", "github_key_file"):
                if not getattr(self, key) and value.get(key):
                    setattr(self, key, str(value[key]))

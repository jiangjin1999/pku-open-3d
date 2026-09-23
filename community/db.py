import contextlib
import hashlib
import json
import secrets
import sqlite3
import time
import uuid


def now():
    return int(time.time())


def uid(prefix):
    return prefix + "_" + uuid.uuid4().hex


def token():
    return secrets.token_urlsafe(32)


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


def dump(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


SCHEMA = """
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS places (
 id TEXT PRIMARY KEY, parent_id TEXT REFERENCES places(id), kind TEXT NOT NULL,
 name TEXT NOT NULL, document TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS observations (
 id TEXT PRIMARY KEY, place_id TEXT REFERENCES places(id), kind TEXT NOT NULL,
 document TEXT NOT NULL, receipt_hash TEXT NOT NULL, state TEXT NOT NULL,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS photos (
 id TEXT PRIMARY KEY, observation_id TEXT NOT NULL REFERENCES observations(id),
 filename TEXT NOT NULL, sha256 TEXT NOT NULL, bytes INTEGER NOT NULL,
 width INTEGER NOT NULL, height INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tasks (
 id TEXT PRIMARY KEY, place_id TEXT REFERENCES places(id), title TEXT NOT NULL,
 kind TEXT NOT NULL, part_hint TEXT NOT NULL, state TEXT NOT NULL,
 claimant TEXT, claim_until INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS task_sources (
 task_id TEXT REFERENCES tasks(id), observation_id TEXT REFERENCES observations(id),
 PRIMARY KEY(task_id, observation_id)
);
CREATE TABLE IF NOT EXISTS sessions (
 hash TEXT PRIMARY KEY, login TEXT NOT NULL, expires INTEGER NOT NULL, kind TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS oauth_states (
 hash TEXT PRIMARY KEY, next_path TEXT NOT NULL, expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS pairings (
 hash TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, login TEXT, expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS submissions (
 id TEXT PRIMARY KEY, task_id TEXT REFERENCES tasks(id), part_id TEXT NOT NULL,
 owner TEXT NOT NULL, document TEXT NOT NULL, content_hash TEXT NOT NULL,
 state TEXT NOT NULL, report TEXT NOT NULL DEFAULT '{}', pr_number INTEGER,
 pr_head TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
 UNIQUE(task_id, content_hash)
);
CREATE TABLE IF NOT EXISTS revisions (
 id TEXT PRIMARY KEY, part_id TEXT NOT NULL, submission_id TEXT REFERENCES submissions(id),
 place_id TEXT REFERENCES places(id), document TEXT NOT NULL, commit_sha TEXT,
 active INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS one_active_part ON revisions(part_id) WHERE active = 1;
CREATE TABLE IF NOT EXISTS audit (
 id INTEGER PRIMARY KEY, actor TEXT NOT NULL, action TEXT NOT NULL,
 target TEXT NOT NULL, details TEXT NOT NULL DEFAULT '{}', created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (
 key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS task_state_idx ON tasks(state, created_at);
CREATE INDEX IF NOT EXISTS source_obs_idx ON task_sources(observation_id);
CREATE INDEX IF NOT EXISTS photo_observation_idx ON photos(observation_id);
CREATE TABLE IF NOT EXISTS verifications (
 id TEXT PRIMARY KEY, revision TEXT NOT NULL REFERENCES revisions(id),
 actor TEXT NOT NULL, note TEXT NOT NULL, created_at INTEGER NOT NULL
);
"""


@contextlib.contextmanager
def connect(settings, write=False):
    db = sqlite3.connect(settings.database, timeout=20)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys=ON")
    db.execute("PRAGMA busy_timeout=20000")
    try:
        if write:
            db.execute("BEGIN IMMEDIATE")
        yield db
        db.commit()
    except BaseException:
        db.rollback()
        raise
    finally:
        db.close()


def audit(db, actor, action, target, details=None):
    db.execute("INSERT INTO audit(actor,action,target,details,created_at) VALUES(?,?,?,?,?)",
               (actor, action, target, dump(details or {}), now()))


def initialize(settings):
    settings.prepare()
    with connect(settings) as db:
        db.execute("PRAGMA journal_mode=WAL")
        db.executescript(SCHEMA)
        db.execute("INSERT OR IGNORE INTO meta VALUES ('schema_version','1')")
        db.execute("INSERT OR IGNORE INTO meta VALUES ('auto_publish','true')")
    campus = settings.root / "app/data/campus.json"
    if not campus.exists():
        return
    with connect(settings, True) as db:
        db.execute("INSERT OR IGNORE INTO places VALUES (?,?,?,?,?,?)", (
            "yanyuan", None, "region", "燕园及周边", dump({"id": "yanyuan", "name": "燕园及周边", "kind": "region"}), now()))
        source = json.loads(campus.read_text())
        frame = source["frame"]
        for feature in source["features"]:
            p = feature["properties"]
            if p["kind"] not in ("building", "gate", "heritage"):
                continue
            place_id = "base_" + digest(p["id"])[:20]
            centre = p.get("centre", [0, 0])
            doc = {"id": place_id, "parent_id": "yanyuan", "kind": "building", "name": p.get("label") or p.get("name") or p["id"],
                   "source_id": p["id"], "pick_id": p["pickId"], "centre": centre, "geometry": feature["geometry"],
                   "longitude": frame["origin"][0] + centre[0] / frame["metresPerLongitudeDegree"],
                   "latitude": frame["origin"][1] - centre[1] / frame["metresPerLatitudeDegree"],
                   "aliases": p.get("aliases", []), "source": "upstream-1.2.0", "certainty": "inherited-approximation"}
            db.execute("INSERT OR IGNORE INTO places VALUES(?,?,?,?,?,?)", (place_id, "yanyuan", "building", doc["name"], dump(doc), now()))
        # A fresh clone can view public contributions without the private production DB.
        # Existing active versions (including operator rollbacks) are never overwritten.
        pending = [json.loads(p.read_text()) for p in sorted((settings.root/"models/places").glob("*.json"))]
        while pending:
            ready = [p for p in pending if not p.get("parent_id") or db.execute("SELECT 1 FROM places WHERE id=?", (p["parent_id"],)).fetchone()]
            if not ready:
                raise ValueError("Published place hierarchy has missing parents")
            for p in ready:
                db.execute("INSERT OR IGNORE INTO places VALUES(?,?,?,?,?,?)", (p["id"],p.get("parent_id"),p["kind"],p["name"],dump(p),now()))
                pending.remove(p)
        from .models import ModelPart
        for path in sorted((settings.root/"models/parts").glob("*.json")):
            model = ModelPart.model_validate_json(path.read_text())
            if db.execute("SELECT 1 FROM revisions WHERE part_id=?", (model.part_id,)).fetchone():
                continue
            document = dump(model.model_dump())
            db.execute("INSERT INTO revisions VALUES(?,?,NULL,?,?,NULL,1,?)", (digest(document),model.part_id,model.place_id,document,now()))

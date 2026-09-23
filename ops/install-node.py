"""Install a checksum-verified Node 24 build in a project-owned runtime directory."""
from pathlib import Path
from urllib.request import urlopen
import hashlib
import json
import shutil
import sys
import tarfile

runtime = Path(sys.argv[1]).resolve()
runtime.mkdir(parents=True, exist_ok=True)
with urlopen("https://nodejs.org/dist/index.json", timeout=30) as r:
    releases = json.load(r)
version = next(x["version"] for x in releases if x["version"].startswith("v24.") and x["lts"])
name = f"node-{version}-linux-x64.tar.xz"
base = f"https://nodejs.org/dist/{version}/"
with urlopen(base+"SHASUMS256.txt", timeout=30) as r:
    sums = r.read().decode()
expected = next(line.split()[0] for line in sums.splitlines() if line.split()[-1] == name)
archive = runtime/name
if not archive.exists():
    with urlopen(base+name, timeout=120) as r, archive.open("wb") as f:
        shutil.copyfileobj(r, f)
assert hashlib.sha256(archive.read_bytes()).hexdigest() == expected, "Node archive checksum mismatch"
with tarfile.open(archive) as t:
    t.extractall(runtime, filter="data")
link = runtime/"node"
if link.is_symlink():
    link.unlink()
link.symlink_to(runtime/f"node-{version}-linux-x64", target_is_directory=True)
archive.unlink()
print("Installed", version, "at", link)

#!/usr/bin/env python3
"""Build campus into a new directory, then atomically switch the local release."""
from pathlib import Path
import json
import os
import subprocess
import sys
import time

ROOT=Path(__file__).resolve().parents[1]

def publish():
    releases=ROOT/'.local/campus-releases';releases.mkdir(parents=True,exist_ok=True)
    target=releases/time.strftime('%Y%m%d-%H%M%S',time.gmtime())
    subprocess.run([sys.executable,str(ROOT/'app/build.py'),'--cached'],check=True,env={**os.environ,'PKU_BUILD_DIR':str(target)})
    manifest=json.loads((target/'assets/build-manifest.json').read_text())
    if not manifest.get('sceneCompressedBytes') or not (target/'index.html').is_file():raise RuntimeError('Incomplete campus build')
    current=ROOT/'dist'
    if current.exists() and not current.is_symlink():
        # One-time conversion, while no production requests are using a filesystem mount.
        raise RuntimeError('dist is a directory. Before initial service start, move it into .local/campus-releases and create a dist symlink. Existing release left untouched.')
    link=ROOT/'.local/campus-next';link.unlink(missing_ok=True);link.symlink_to(target,target_is_directory=True);link.replace(current)
    print('Campus release switched locally. GitHub model publication is handled by the community worker.')

if __name__=='__main__':publish()

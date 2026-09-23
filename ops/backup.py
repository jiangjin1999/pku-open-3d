#!/usr/bin/env python3
"""Consistent private backup with checksums and a restore drill. Never overwrites live data."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import sqlite3
import tempfile
import time


def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda:f.read(1024*1024),b''):h.update(block)
    return h.hexdigest()


def verify(folder):
    folder=Path(folder).resolve();manifest=json.loads((folder/'backup-manifest.json').read_text())
    for name,checksum in manifest['files'].items():
        p=(folder/name).resolve()
        if not p.is_relative_to(folder) or sha(p)!=checksum:raise ValueError('Backup checksum mismatch: '+name)
    db=sqlite3.connect(folder/'community.sqlite3')
    if db.execute('PRAGMA integrity_check').fetchone()[0]!='ok':raise ValueError('Database integrity check failed')
    for (filename,) in db.execute('SELECT filename FROM photos'):
        if not (folder/'photos'/filename).is_file():raise ValueError('Missing backed-up photo')
    db.close();return manifest


def backup(data,destination,keep=14):
    data=Path(data).resolve();destination=Path(destination).resolve();destination.mkdir(parents=True,exist_ok=True,mode=0o700)
    # Hardlinks preserve immutable photos when a withdrawal happens during the later copy.
    with tempfile.TemporaryDirectory(prefix='.snapshot-',dir=data) as scratch:
        scratch=Path(scratch);(scratch/'photos').mkdir()
        lock=sqlite3.connect(data/'community.sqlite3',timeout=30);lock.execute('BEGIN IMMEDIATE')
        try:
            source=sqlite3.connect(data/'community.sqlite3');target=sqlite3.connect(scratch/'community.sqlite3')
            source.backup(target);target.close();source.close()
            for (filename,) in lock.execute('SELECT filename FROM photos'):
                os.link(data/'photos'/filename,scratch/'photos'/filename)
        finally:lock.rollback();lock.close()
        for name in ('secrets','jobs'):
            if (data/name).exists():shutil.copytree(data/name,scratch/name)
        name=time.strftime('snapshot-%Y%m%d-%H%M%S',time.gmtime());staging=destination/(name+'.partial')
        shutil.copytree(scratch,staging);os.chmod(staging,0o700)
        manifest={'schema':1,'created_at':int(time.time()),'files':{str(p.relative_to(staging)):sha(p) for p in staging.rglob('*') if p.is_file()}}
        (staging/'backup-manifest.json').write_text(json.dumps(manifest,indent=2))
        verify(staging);final=destination/name;staging.rename(final)
    # Retain 14 completed snapshots; partial copies are never considered restorable.
    for old in sorted(destination.glob('snapshot-*'),reverse=True)[keep:]:
        if old.is_dir() and not old.name.endswith('.partial'):shutil.rmtree(old)
    return final


def restore(snapshot,destination):
    snapshot=Path(snapshot);destination=Path(destination)
    verify(snapshot)
    if destination.exists():raise ValueError('Restore destination must not exist; stop services and choose a NEW directory')
    shutil.copytree(snapshot,destination);os.chmod(destination,0o700)
    with sqlite3.connect(destination/'community.sqlite3') as db:
        for table in ('sessions','oauth_states','pairings'):db.execute('DELETE FROM '+table)
        db.execute("UPDATE meta SET value='false' WHERE key='auto_publish'")
        db.execute("UPDATE submissions SET state='queued' WHERE state='checking'")
        db.execute("UPDATE submissions SET state='preview_queued' WHERE state='preview_checking'")
    secret=destination/'secrets/github-app.json'
    if secret.exists():
        doc=json.loads(secret.read_text());doc['github_key_file']=str(destination.resolve()/'secrets/github-app.pem');secret.write_text(json.dumps(doc))
    (destination/'backup-manifest.json').unlink()
    return destination


if __name__=='__main__':
    os.umask(0o077)
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('action',choices=['create','verify','restore','drill'])
    parser.add_argument('--data',default=os.environ.get('PKU_DATA_DIR'));parser.add_argument('--backup-root',default=os.environ.get('PKU_BACKUP_DIR'))
    parser.add_argument('--snapshot');parser.add_argument('--destination');args=parser.parse_args()
    if args.action=='create':print(backup(args.data,args.backup_root))
    elif args.action=='verify':print(json.dumps({'ok':True,'files':len(verify(args.snapshot)['files'])}))
    elif args.action=='restore':print(restore(args.snapshot,args.destination))
    else:
        snapshot=Path(args.snapshot) if args.snapshot else sorted(Path(args.backup_root).glob('snapshot-*'))[-1]
        with tempfile.TemporaryDirectory(prefix='pku-restore-drill-') as folder:
            restored=restore(snapshot,Path(folder)/'restored')
            with sqlite3.connect(restored/'community.sqlite3') as db:
                print(json.dumps({'ok':True,'database_integrity':db.execute('PRAGMA integrity_check').fetchone()[0],'photos':db.execute('SELECT COUNT(*) FROM photos').fetchone()[0],'auto_publish':'paused'}))

#!/usr/bin/env python3
"""Install this project's user services. Other user services and global runtimes are untouched."""
import argparse
from pathlib import Path
import os
import secrets
import subprocess

parser=argparse.ArgumentParser(description=__doc__)
for name in ('source','runtime','data','backup'):parser.add_argument('--'+name,required=True,type=Path)
parser.add_argument('--public-url',default='http://127.0.0.1:18430');args=parser.parse_args()
source,runtime,data,backup=[getattr(args,k).resolve() for k in ('source','runtime','data','backup')]
for p in (source,runtime,data,backup):
    if any(c in str(p) for c in '\n\r"%'):raise SystemExit('Unsupported service path')
os.umask(0o077);data.mkdir(parents=True,exist_ok=True);backup.mkdir(parents=True,exist_ok=True)
conf=data/'service.env'
if not conf.exists():
    conf.write_text('\n'.join([f'PKU_DATA_DIR={data}',f'PKU_BACKUP_DIR={backup}',f'PKU_PUBLIC_URL={args.public_url}',f'PKU_NODE={runtime}/node/bin/node',f'PKU_SETUP_KEY={secrets.token_urlsafe(32)}','PKU_PHOTO_QUOTA_GB=50'])+'\n');conf.chmod(0o600)
units=Path.home()/'.config/systemd/user';units.mkdir(parents=True,exist_ok=True)
common=f'''WorkingDirectory={source}
EnvironmentFile={conf}
Environment=PATH={runtime}/node/bin:{runtime}/venv/bin:/usr/local/bin:/usr/bin:/bin
UMask=0077
NoNewPrivileges=yes
PrivateTmp=yes
CPUQuota=400%
CPUAffinity={' '.join(map(str,sorted(os.sched_getaffinity(0))[:4]))}
MemoryMax=16G
TasksMax=256
'''
for name,command in [('web',f'{runtime}/venv/bin/python -m uvicorn community.app:app --host 127.0.0.1 --port 18430 --no-access-log'),('worker',f'{runtime}/venv/bin/python -m community.worker')]:
    (units/f'pku-open3d-{name}.service').write_text(f'''[Unit]
Description=PKU Open 3D {name}
After=network-online.target

[Service]
{common}ExecStart={command}
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
''')
(units/'pku-open3d-backup.service').write_text(f'''[Unit]
Description=PKU Open 3D private backup and restore drill
[Service]
Type=oneshot
{common}ExecStart={runtime}/venv/bin/python ops/backup.py create
ExecStart={runtime}/venv/bin/python ops/backup.py drill
''')
(units/'pku-open3d-backup.timer').write_text('''[Unit]
Description=Daily PKU Open 3D backup
[Timer]
OnCalendar=*-*-* 04:10:00
RandomizedDelaySec=600
Persistent=true
[Install]
WantedBy=timers.target
''')
subprocess.run(['systemctl','--user','daemon-reload'],check=True)
subprocess.run(['systemctl','--user','enable','--now','pku-open3d-web.service','pku-open3d-worker.service','pku-open3d-backup.timer'],check=True)
print('Project services installed. Setup credential stays in the private service.env file.')

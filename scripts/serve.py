#!/usr/bin/env python3
"""Serve the website, or opt into local-only development references."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

ROOT = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--port', type=int, default=8781)
ap.add_argument('--references', action='store_true')
args = ap.parse_args()
folder = ROOT / ('app' if args.references else 'dist')
if not (folder / 'index.html').is_file():
    ap.error('Run npm run build first.')
if args.references and not (folder / 'private/reference-gallery.js').is_file():
    ap.error('Local reference material is not configured on this computer.')
print(f"燕园 → http://127.0.0.1:{args.port}/" + ('?dev=1' if args.references else ''), flush=True)
ThreadingHTTPServer(('127.0.0.1', args.port), partial(SimpleHTTPRequestHandler, directory=str(folder))).serve_forever()

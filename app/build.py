"""Build the release website and its original-quality local assets."""
from pathlib import Path
import base64, hashlib, html, json, os, re, shutil, subprocess, sys

R = Path(__file__).resolve().parent
OUTPUT = Path(os.environ.get('PKU_BUILD_DIR', R.parent / 'dist'))
MAP_LINKS = {
    'satellite': ('卫星地图 ↗', 'https://www.arcgis.com/apps/mapviewer/index.html?basemapUrl=https%3A%2F%2Fservices.arcgisonline.com%2FArcGIS%2Frest%2Fservices%2FWorld_Imagery%2FMapServer&center=116.304%2C39.992&level=17'),
    'standard': ('标准地图 ↗', 'https://www.openstreetmap.org/#map=17/39.992/116.304'),
}

subprocess.run([sys.executable, str(R / 'tools/build-water-detail.py')], check=True)

if '--cached' not in sys.argv:
    subprocess.run(['node', str(R / 'tools/bake-scene46.cjs')], check=True)
if '--cached' in sys.argv:
    index = (R / 'index.html').read_text()
    scripts = [p for p in re.findall(r'<script src="([^"]+)"></script>', index)
               if not re.search(r'(?:assets|reference-gallery|engine|app-v29|materials|material-detail|water-detail|pedestrians-v46|scene-cache46|scene-package46)\.js$', p)]
    digest = hashlib.sha256()
    for file in scripts + ['tools/scene-collector46.js', 'tools/bake-scene46.cjs']:
        digest.update(file.encode()); digest.update((R / file).read_bytes())
    baseline = R / 'data/scene-atlas-baseline46.json'
    digest.update(baseline.read_bytes()); digest.update((R / json.loads(baseline.read_text())['path']).read_bytes())
    cached = json.loads((R / 'assets/runtime-v46/scene/manifest.json').read_text())
    if cached['sourceHash'] != digest.hexdigest():
        raise SystemExit('Scene inputs changed. Run a complete build before publishing.')

# File URLs cannot upload file-origin images to WebGL. Load only these two
# byte-identical texture data URLs through a classic script when opened offline.
manifest = json.loads((R / 'assets/runtime-v46/scene/manifest.json').read_text())
texture_data = {'materials': 'data:image/jpeg;base64,' + base64.b64encode((R / 'assets/materials-display.jpg').read_bytes()).decode(), 'atlas': 'data:image/png;base64,' + base64.b64encode((R / 'assets/runtime-v46/scene' / manifest['atlas']).read_bytes()).decode()}
texture_code = 'YY.LOCAL_TEXTURES46=' + json.dumps(texture_data, separators=(',', ':')) + ';'
texture_file = 'assets/runtime-v46/scene/textures-' + hashlib.sha256(texture_code.encode()).hexdigest()[:24] + '.js'
(R / texture_file).write_text(texture_code)
(R / 'src/materials.js').write_text('YY.MATERIAL_ATLAS="assets/materials-display.jpg";YY.TEXTURE_FALLBACK46=' + json.dumps(texture_file) + ';')

destination = OUTPUT / 'assets'
if destination.parent.exists():
    shutil.rmtree(destination.parent)
destination.mkdir(parents=True, exist_ok=True)
page = (R / 'index.html').read_text()
scripts = re.findall(r'<script src="([^"]+)"></script>', page)
code = []
asset_scripts = {'src/assets.js', 'src/materials.js', 'src/reference-gallery.js', 'src/scene-package46.js'}
for file in scripts:
    source = (R / file).read_text()
    if file == 'src/assets.js':
        source = 'YY.ASSETS=' + json.dumps({'externalMaps': True, 'periphery': {}, 'mapLinks': {mode: link[1] for mode, link in MAP_LINKS.items()}}, separators=(',', ':')) + ';'
    if file == 'src/reference-gallery.js':
        source = 'YY.REFERENCE_GALLERY={images:{},places:{}};'
    if file in asset_scripts:
        source = source.replace('assets/runtime-v46/', 'assets/runtime/')
    code.append('/* ' + file + ' */\n' + source)
bundle = '\n;\n'.join(code)
bundle_name = 'app-' + hashlib.sha256(bundle.encode()).hexdigest()[:16] + '.js'
(destination / bundle_name).write_text(bundle)
style = (R / 'src/styles.css').read_bytes()
style_name = 'style-' + hashlib.sha256(style).hexdigest()[:16] + '.css'
(destination / style_name).write_bytes(style)

gallery = {'images': {}, 'places': {}}
# Provider map mosaics and development photos are not release assets.
paths = {'assets/materials-display.jpg', texture_file}
manifest = json.loads((R / 'assets/runtime-v46/scene/manifest.json').read_text())
scene_paths = [manifest['atlas'], 'manifest.json', 'bucket-hashes.json']
for chunk in manifest['chunks']:
    scene_paths.extend([chunk['file'], chunk['fallback']])
paths.update('assets/runtime-v46/scene/' + file for file in scene_paths)
for file in sorted(paths):
    assert file.startswith('assets/'), file
    target = destination / file.removeprefix('assets/').replace('runtime-v46/', 'runtime/', 1)
    target.parent.mkdir(parents=True, exist_ok=True)
    source = R / file
    if not target.exists() or target.stat().st_size != source.stat().st_size or target.stat().st_mtime_ns < source.stat().st_mtime_ns:
        shutil.copy2(source, target)
page = re.sub(r'<script src="([^"]+)"></script>', '', page)
for mode, (label, href) in MAP_LINKS.items():
    page = re.sub(r'<button data-mode="' + mode + r'"[^>]*>.*?</button>', '<a href="' + html.escape(href, quote=True) + '" target="_blank" rel="noopener" title="在地图官网打开">' + label + '</a>', page)
page = page.replace('<link rel="stylesheet" href="src/styles.css">', '<link rel="stylesheet" href="assets/' + style_name + '">')
page = page.replace('</body>', '<script defer src="assets/' + bundle_name + '"></script><script defer src="/static/campus-bridge.js"></script></body>')
page = page.replace('src/assets/', 'assets/')
(OUTPUT / 'index.html').write_text(page)
(OUTPUT / '.nojekyll').touch()
for notice in ('LICENSE', 'DATA_LICENSE.md'):
    shutil.copy2(R.parent / notice, destination.parent / notice)
summary = {'version': (R.parent / 'VERSION').read_text().strip(), 'htmlBytes': len(page.encode()), 'scriptBytes': len(bundle.encode()), 'sceneCompressedBytes': manifest['packedStats']['compressedBytes'], 'sceneSourceHash': manifest['sourceHash'], 'images': len(gallery['images']), 'copiedAssets': len(paths), 'bundle': bundle_name}
(destination / 'build-manifest.json').write_text(json.dumps(summary, indent=2))
print('Built fast page:', json.dumps(summary))

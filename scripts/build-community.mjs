import {build} from 'esbuild';
import {copyFile, mkdir, writeFile} from 'node:fs/promises';
await mkdir('community/web', {recursive:true});
await build({entryPoints:['community/frontend/app.js','community/frontend/preview.js'], outdir:'community/web',bundle:true,minify:true,format:'esm',target:['es2022'],external:['/static/*'],legalComments:'linked'});
await copyFile('docs/media/campus.jpg','community/web/campus.jpg');
await copyFile('docs/media/evening.jpg','community/web/campus-evening.jpg');
await writeFile('community/web/THIRD_PARTY.txt','Campus images: sldyns/PKU-3D (MIT).\nThree.js: MIT. exifr: MIT.\n');
console.log('Built lightweight contribution pages and the separate model preview.');

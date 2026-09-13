# Development

[中文](DEVELOPMENT.zh-CN.md)

## Run locally

Requires Python 3.10+, Node.js 20+ and a browser with WebGL 2. Google Chrome is needed to regenerate the scene cache.

```sh
git clone https://github.com/sldyns/PKU-3D.git
cd PKU-3D
npm install
npm run setup
npm run build
npm run dev
```

`setup` downloads the versioned scene and texture package from GitHub Releases and checks its hashes. `build` creates `dist/` from the matching scene cache. Open the local URL printed by `dev`.

## Layout

| Directory | Contents |
| --- | --- |
| `app/src/` | Rendering, building models and interaction |
| `app/data/` | Editable campus data and scene metadata |
| `app/tools/` | Scene baking |
| `app/tests/` | Runtime regression checks |
| `scripts/` | Asset setup, local server and packaging |
| `docs/` | Documentation and rendered screenshots |
| `dist/` | Generated website; excluded from Git |

The renderer retains some numbered internal module names to preserve cache compatibility. These are implementation identifiers; the release version is defined in `VERSION`.

## Edit and verify

For interface and documentation changes, use `npm run build`. After changing buildings, vegetation or other scene inputs, use `npm run build:scene` to regenerate the cache. Check affected buildings and interactions in the browser.

`npm test` checks decoding, instance transfer, visibility and draw reuse. Visual review and performance comparisons remain separate checks. See [Performance](development/performance.md).

## Release

Keep `VERSION`, package metadata and displayed version information in sync. Build the scene when needed, then run `npm run assets:pack`. Attach the resulting archive to the matching GitHub release before deploying. The Pages workflow restores these pinned assets, builds `dist/` and publishes it.

## Local reference material

Development photographs, videos and research records are excluded from Git and release packages. In a maintainer workspace that already has these files, `npm run dev:references` serves the local source; add `?dev=1` to display building references. This mode is restricted to local hosts and is unavailable on GitHub Pages.

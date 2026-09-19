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

## Rendering

Surface lighting, reflected color, fog, glass and particles share a linear HDR target when half-float color rendering supports the existing MSAA sample count. The final composite applies contact shading and tone mapping once. Other devices retain the 8-bit target and antialiasing; reflection sampling reverses the display map before mixing light.

Water surfaces are horizontal meshes. Their transformed bounds supply the reflection plane; the selected or nearest visible surface determines the single planar reflection target. Simultaneously visible water at different heights still shares that target. Tree rendering specializes the same material equations without removing leaves or changing their order.

`material-detail.js` and the pedestrian runtime do not contribute static scene geometry and are excluded from the scene-input digest. Building, vegetation and landscape edits still require a scene rebuild.

## Release

Keep `VERSION`, package metadata and displayed version information in sync. Build the scene when needed, then run `npm run assets:pack` and attach the archive to the matching GitHub release.

Run `npm run deploy` to build and push the generated website to `gh-pages`. GitHub Pages publishes that branch at `https://sldyns.github.io/PKU-3D/`. The `main` branch contains the editable source; `gh-pages` contains only the generated website. Publishing requires Git push access to this repository.

## Local reference material

Development photographs, videos and research records are excluded from Git and release packages. In a maintainer workspace that already has these files, `npm run dev:references` serves the local source; add `?dev=1` to display building references. This mode is restricted to local hosts and is unavailable on GitHub Pages.

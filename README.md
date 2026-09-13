<div align="center">

# PKU-3D

**Peking University in 3D**

Built with **GPT-6 Astra**. All source data and modeling references are publicly available.

**[Demo](https://sldyns.github.io/PKU-3D/)** · [中文](README.zh-CN.md) · [Releases](https://github.com/sldyns/PKU-3D/releases) · [Contributing](CONTRIBUTING.md)

[![Version](https://img.shields.io/badge/version-1.0.0-8b302c)](https://github.com/sldyns/PKU-3D/releases/tag/v1.0.0)
[![WebGL 2](https://img.shields.io/badge/rendering-WebGL%202-2f6555)](https://sldyns.github.io/PKU-3D/)

</div>

An unofficial campus visualization.

[![PKU campus overlooking Weiming Lake and Boya Pagoda](docs/media/campus.jpg)](https://sldyns.github.io/PKU-3D/)

PKU-3D is an interactive model of Peking University's Yanyuan campus, with individual buildings, courtyards, roads and lakes. It runs in the browser and includes building search, map overlays, changing light and weather, and pedestrians following campus paths.

<table>
<tr>
<td width="50%"><img src="docs/media/west-gate.jpg" alt="West Gate"><br><b>West Gate</b></td>
<td width="50%"><img src="docs/media/courtyards.jpg" alt="Quan Zhai and surrounding courtyards"><br><b>Courtyards</b></td>
</tr>
<tr>
<td colspan="2"><img src="docs/media/evening.jpg" alt="Weiming Lake at dusk"><br><b>Weiming Lake at dusk</b></td>
</tr>
</table>

## Features

- Building search and selection, with front, side and roof views.
- 3D and plan views in the same coordinate system, with links to satellite and standard maps.
- Time of day, seasons and weather, with vegetation, water reflections and walking pedestrians.
- Route planning along the campus road network.

## Controls

| Action | Input |
| --- | --- |
| Orbit | Drag |
| Pan | Right-drag |
| Zoom | Scroll |
| Inspect a building | Click a building or search by name |

A desktop browser with WebGL 2 support is recommended. The interface currently uses Chinese.

## Data

**All source data and modeling references come from public sources:** OpenStreetMap, Esri World Imagery, and publicly accessible university, department and architectural materials. Source attribution is documented in [Data sources](docs/SOURCES.md).

The model is being refined; some dimensions and architectural details are approximate. Reference photographs and videos are kept outside the repository and release assets. Screenshots on this page are rendered from the project itself.

## Development

```sh
git clone https://github.com/sldyns/PKU-3D.git
cd PKU-3D
npm install
npm run setup
npm run build
npm run dev
```

See [Development](docs/DEVELOPMENT.md) for requirements, scene builds and the repository layout.

## Contributing

Building corrections, modeling improvements and interface fixes are welcome. For a spatial correction, include the building name, a marked scene screenshot and a public source link when available. See [Contributing](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) for software and original documentation; [ODbL 1.0](DATA_LICENSE.md) for the OSM-derived geographic database. Third-party rights remain with their holders. See [Licensing notes](docs/LICENSING.md).

# Changelog

## 1.2.0

- Directional sky and ground ambient light for clearer sheltered surfaces; rain and mist attenuate direct sunlight consistently.
- Material-specific rain response for masonry, timber, foliage, glass and metal.
- Calmer bank transitions derived from the mapped outer outline of Weiming Lake, without changing water geometry or inferring depth.
- View-space contact shading and skipped irrelevant backlit shadow lookups retain sample counts, reflection resolution and MSAA.
- Conservatively classified visibility groups and consecutive record copies avoid redundant per-instance work, preserving selection, byte order and compact upload streams.
- Parallel texture/scene loading, shared shader-stage compilation and overlapped visibility preparation shorten serial startup work while keeping two-worker decoding and bounded uploads.

## 1.1.0

- Linear HDR compositing with a single final tone map on supported hardware, preserving the existing MSAA sample count and an 8-bit fallback.
- Stable, filtered tree shadows; denser inner crowns, joined roots and tapered branches.
- Filtered brick, clay, stone and wood surface detail, with restrained dielectric highlights.
- Calmer lake reflections and reflection heights derived from visible water surfaces, including the sunken garden pool.
- Photographic-reference refinements to the 19–21 courtyard windows and steps, Linhuxuan basin and existing lake bridge stonework.

## 1.0.0

- Interactive campus buildings, courtyards, roads and lakes.
- Building search, selection and architectural viewpoints.
- Coordinated 3D and plan views.
- Lighting, seasons, weather, water reflections and pedestrians.
- English and Chinese documentation, contribution guides and separate code/data licenses.

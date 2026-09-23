# Changelog

## 共建北大 0.1.0（社区服务首次部署）

- 从原作 Fork，固定上游版本与资源，新增中文参与入口、匿名标注和反馈、凭证及任务私有资料。
- 增加 GitHub 身份与 CLI 配对、局部声明式模型、渲染预览和仅模型数据的自动 PR 发布程序。
- 增加版本冲突处理、人工核对记录、回退、L40s 用户服务、独立磁盘备份与恢复演练。
- 固定域名、GitHub App 和校外真实验收待首次授权，见 docs/ACCEPTANCE.md。

以下保留原作发布记录；VERSION 的 1.2.0 指上游校园底模。

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

# 空间、坐标与声明式模型

`Place` 使用稳定 ID：校区/区域 → 建筑 → 楼层/空间 → 部位。上游对象映射为 `base_…`，新增地点为 `pl_…`。父层级可以只有档案，没有几何；无需先把整栋建完。楼层、房间可通过 API 新建 Place；手机第一版以建筑加楼层、部位字段完成同样的局部贡献。

`Observation` 保存确认过的时间精度、拍摄者位置、拍摄目标、部位、方向、楼层、授权版本；上传时间另存。`Task` 连接一个地点和一组资料，保存认领者、期限、状态。`ModelPart` 是一个独立发布单元，`Revision` 是规范化 JSON 的 SHA-256。旧版本与来源一直保留。

## 坐标

沿用原作坐标，单位为米，X 向东、Y 向上、Z 向南。WGS84 原点为 `[116.304,39.992]`；

```text
x = (longitude - 116.304) × 85403.82148988487
z = (39.992 - latitude) × 111034.47884251377
```

模型 `origin` 是校园世界坐标 `[x,y,z]`，节点 `position` 为相对父节点的位置，`rotation` 为绕 Y 轴旋转的弧度。不要混用地图服务的偏移坐标或把照片 GPS 当作目标位置。

## 模型包

完整 JSON Schema 从 `/api/v1/model-schema` 或 CLI `schema` 获取；[测试样例](../models/examples/partial-floor.json) 可用于本地渲染。

| 字段 | 作用 |
| --- | --- |
| `schema_version` | 第一版为 1 |
| `part_id` | 可读、稳定的部位编号，修改时保持相同 |
| `place_id / task_id` | 必须与所认领任务一致 |
| `base_revision` | 新部位为 null；修改时为目前生效的 64 位内容哈希 |
| `space / floor` | exterior / floor / room / detail；室内必须标楼层 |
| `origin` | 世界坐标，不能远离资料地点 |
| `evidence` | 任务内 observation_id、支持哪些内容、observed 或 estimated |
| `uncertainties` | 估计尺寸、未知细节与未建部分；有估计资料时必填 |
| `nodes` | group、box、cylinder、mesh；父节点在前 |
| `replaces_baseline` | 默认 false；仅 exterior 可整体替换该建筑的底模，局部改动应保持 false |

长方体 `size` 为三轴尺寸，圆柱 `radius/height/segments`，网格为 `vertices` 和三角形 `indices`。几何以节点中心为原点，材质为十六进制 `color`。每个节点均可有 `position/rotation/parent_id`。网格不支持脚本、纹理链接或任意着色器。

每包最多 12 MB、4000 节点、10 万三角形、8 层节点；退化三角形、非法索引、非有限数字及异常世界边界会被拒绝。模型描述应只包含可公开摘要，不携带原照路径、私人标注或凭证。

外观由适配器加入原校园，室内部位按楼层在独立轻量视图中加载。同部位提交需与当前生效版本一致。自动检查不能判断真实性，发布默认“待核实”；事实争议以新观察和后续修正任务保留来源。

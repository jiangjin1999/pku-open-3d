<div align="center">

# PKU-3D

**北京大学三维校园**

由 **GPT-6 Astra** 构建，全部基础数据与建模参考均来自公开来源。

**[在线演示](https://sldyns.github.io/yanyuan/)** · [English](README.md) · [版本发布](https://github.com/sldyns/PKU-3D/releases) · [贡献指南](CONTRIBUTING.zh-CN.md)

[![Version](https://img.shields.io/badge/version-1.0.0-8b302c)](https://github.com/sldyns/PKU-3D/releases/tag/v1.0.0)
[![WebGL 2](https://img.shields.io/badge/rendering-WebGL%202-2f6555)](https://sldyns.github.io/yanyuan/)

</div>

本项目为非官方校园可视化作品。

[![未名湖与博雅塔周边的校园全景](docs/media/campus.jpg)](https://sldyns.github.io/yanyuan/)

PKU-3D 是北京大学燕园校区的交互式三维模型，包含楼宇、院落、道路与水系。项目在浏览器中运行，支持建筑搜索、地图对照、光照和天气调节，以及沿校园道路行走的行人。

<table>
<tr>
<td width="50%"><img src="docs/media/west-gate.jpg" alt="北大西门"><br><b>西校门</b></td>
<td width="50%"><img src="docs/media/courtyards.jpg" alt="全斋及周边院落"><br><b>校园院落</b></td>
</tr>
<tr>
<td colspan="2"><img src="docs/media/evening.jpg" alt="傍晚的未名湖"><br><b>未名湖夜景</b></td>
</tr>
</table>

## 功能

- 搜索、点选建筑，切换正面、侧面和屋顶视角。
- 三维与平面视图使用统一坐标；卫星图与标准地图可跳转官网查看。
- 调整时刻、季节和天气，观察植被、水面反射与行人。
- 沿校园道路规划路线。

## 操作

| 操作 | 方式 |
| --- | --- |
| 旋转 | 鼠标拖动 |
| 平移 | 右键拖动 |
| 缩放 | 滚轮 |
| 查看建筑 | 点击建筑或搜索名称 |

建议使用支持 WebGL 2 的电脑浏览器。

## 数据来源

**全部基础数据与建模参考均来自公开来源**，包括 OpenStreetMap、Esri World Imagery，以及公开的学校、院系和建筑资料。具体署名见[数据来源](docs/SOURCES.zh-CN.md)。

模型仍在校对，部分尺寸与建筑细节为近似。参考照片和视频不放入仓库或发布包；本页图片均为项目自身的渲染截图。

## 本地运行

```sh
git clone https://github.com/sldyns/PKU-3D.git
cd PKU-3D
npm install
npm run setup
npm run build
npm run dev
```

环境要求、场景构建与目录说明见[开发文档](docs/DEVELOPMENT.zh-CN.md)。

## 贡献

欢迎提交建筑纠错、模型改进和交互修复。反馈空间问题时，请附上建筑名称、圈注的场景截图，以及可用的公开来源链接。具体说明见[贡献指南](CONTRIBUTING.zh-CN.md)。

## 许可

软件与原创文档采用 [MIT](LICENSE)；OSM 衍生地理数据库采用 [ODbL 1.0](DATA_LICENSE.md)。第三方内容的权利归各自权利人所有，详见[许可说明](docs/LICENSING.md)。

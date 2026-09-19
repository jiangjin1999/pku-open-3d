# 开发文档

[English](DEVELOPMENT.md)

## 本地运行

需要 Python 3.10+、Node.js 20+ 和支持 WebGL 2 的浏览器。重新生成场景缓存时还需要 Google Chrome。

```sh
git clone https://github.com/sldyns/PKU-3D.git
cd PKU-3D
npm install
npm run setup
npm run build
npm run dev
```

`setup` 从 GitHub Releases 下载对应版本的场景和纹理，并核对哈希。`build` 使用匹配的场景缓存生成 `dist/`。在浏览器中打开 `dev` 输出的本地地址。

## 目录

| 目录 | 内容 |
| --- | --- |
| `app/src/` | 渲染、建筑模型与交互 |
| `app/data/` | 可编辑的校园数据与场景元数据 |
| `app/tools/` | 场景构建工具 |
| `app/tests/` | 运行时回归检查 |
| `scripts/` | 资源准备、本地服务与打包 |
| `docs/` | 文档与场景展示图 |
| `dist/` | 构建产物，不提交到 Git |

部分内部模块保留数字后缀，以维持缓存兼容；发布版本统一由 `VERSION` 定义。

## 修改与验证

修改界面或文档后运行 `npm run build`。修改建筑、植被等场景输入后，运行 `npm run build:scene` 重建缓存，并在浏览器中检查受影响的建筑和交互。

`npm test` 检查解码、实例传输、可见性与绘制复用；画面验收和性能对照需单独完成。详见[性能说明](development/performance.md)。

## 渲染

硬件支持半浮点颜色缓冲且能保留现有多重采样数量时，表面光照、倒影、雾、玻璃和粒子使用统一的线性 HDR 流程，在最终合成阶段应用接触阴影和一次色调映射。其他设备保留 8 位颜色缓冲与抗锯齿，并在混合反射光前还原显示映射。

水面是水平网格，以变换后的包围盒中心高度确定反射平面。选中或距离镜头目标最近的可见水面决定当前单一平面反射；同时出现多个高度的水面时仍共享这张反射图。树叶使用专用材质路径，保留叶片、顺序和光照方程。

`material-detail.js` 和行人运行时代码不生成静态场景几何，因此不计入场景输入摘要。建筑、植被和地面模型修改仍需重建场景。

## 发布

同步更新 `VERSION`、包版本和页面版本。按需重建场景后，运行 `npm run assets:pack`，将资源包上传到对应 GitHub Release。

运行 `npm run deploy` 构建网页并推送到 `gh-pages`，GitHub Pages 会从该分支发布到 `https://sldyns.github.io/PKU-3D/`。`main` 保存可编辑源码，`gh-pages` 只保存生成的网站。发布需要该仓库的 Git 推送权限。

## 本地外观参考

开发照片、视频和研究记录不进入 Git 或发布包。已有这些文件的维护工作区可运行 `npm run dev:references`，在本地地址加上 `?dev=1` 显示建筑外观参考。GitHub Pages 不会开启此模式。

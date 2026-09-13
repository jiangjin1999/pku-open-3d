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

## 发布

同步更新 `VERSION`、包版本和页面版本。按需重建场景后，运行 `npm run assets:pack`，将资源包上传到对应 GitHub Release，再部署网页。Pages 工作流会恢复锁定的资源、构建 `dist/` 并发布。

## 本地外观参考

开发照片、视频和研究记录不进入 Git 或发布包。已有这些文件的维护工作区可运行 `npm run dev:references`，在本地地址加上 `?dev=1` 显示建筑外观参考。GitHub Pages 不会开启此模式。

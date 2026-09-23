# 系统结构

原校园 `app/` 保留上游 WebGL、坐标与压缩资产。`community/web/` 是不依赖完整场景的中文贡献页，原生 JS 表单只在预览页加载 Three.js。手机上传、首页、反馈、二维定位不请求 72 MB 场景。

后端使用 FastAPI、SQLite WAL、服务器文件存储。`/api/v1` 为版本化接口；交互文档位于 `/api/docs`。每个匿名提交拥有随机凭证，服务只存哈希。照片重编码、去掉 EXIF，存到仓库外目录。提交照片需显式用途授权；不以 EXIF 自动确认事实。

## 权限

GitHub App OAuth 只取登录名，身份令牌不保存；浏览器 session 使用 HttpOnly、SameSite cookie 和同源写请求检查。CLI 用一次性浏览器配对换取 7 天项目令牌，原文只存在参与者本机。认领期限为 24 小时。

每次照片请求同时核对登录身份、任务认领、期限、资料与任务关联、撤回状态。所有 API 响应设为 no-store。资料正文及原照不进入公开模型 PR；公开接口只返回任务摘要和可公开模型。上传有请求大小、解码尺寸、数量、全局配额和 IP 频率限制。

## 可信发布程序

后台只有一个 worker，以文件锁保证单实例。worker 使用维护的 Python/Node/浏览器程序解释通过 Schema 的 JSON，**不会 checkout 或运行贡献者 PR 的程序**。渲染器只允许访问自己的本机资源，无外部贴图。建模者也不能上传工作流或脚本。

队列：queued → checking → waiting_setup → pr_open → published。预览队列单独走 preview_queued → preview_checking → preview_ready，不创建 PR。

GitHub App 仅安装到本 Fork，具备 contents、pull_requests、checks 权限。它根据候选内容创建 `model/sub_…` 分支和 PR，核对仓库、分支、完整文件列表、最终 head SHA、模型内容哈希、资料和基础版本，使用 exact head SHA 合并。发布前读回合并内容；SQLite 事务切换该部位的 active revision。未通过则保留上一版本。

生成 PR 的文件白名单限于本次部位 JSON 及其必要地点祖先 JSON。没有通用 PR 自动合并器。普通代码 PR 留给维护者。GitHub 短暂不可达保留队列阶段，重启恢复正在检查的任务；重复内容保持幂等。

## 数据与恢复

公开 JSON 在 GitHub 可追踪；在线服务的模型版本、任务及私有观察在 SQLite。新克隆可导入已公开 JSON 浏览，不能恢复私有资料。生产恢复必须使用数据库与照片一致的备份，不能仅依赖 Git。

按部位回退只切换在线生效版本并暂停发布，Git 保留原始历史。恢复自动发布前先核对后续任务基础版本；下一次修正须基于回退后的版本，会在新 PR 中恢复 Git 与线上一致。不能重启时用仓库最新 JSON 覆盖运行数据库里的回退决定。

照片备份到独立磁盘，校验每个文件和 SQLite 完整性，定期实做恢复到新目录。服务恢复不复用登录 session，并默认暂停自动发布。维护接口、配置入口均需维护者身份或一次性配置秘密。

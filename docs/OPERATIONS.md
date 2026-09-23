# L40s 部署与恢复

本项目使用独立目录、Python 3.12、Node.js 24 和 Chromium；不修改机器默认运行环境，不依赖 Docker。路径通过参数和环境设置，真实主机信息不写入仓库。

## 初始运行

先安装用户目录的 uv / Python 3.12，使用 `ops/install-node.py <runtime-directory>` 安装校验过的 Node 24。克隆本 Fork 后执行 `uv sync --frozen`、`npm ci`、`npm run build:community`、`python scripts/assets.py setup`、`npm run build` 和 `npx playwright install chromium`。服务器首次已配置的独立环境可直接复用。

`ops/install-services.py --help` 给出参数。`--source` 指向代码、`--runtime` 指向含 `venv/bin/python` 和 `node/bin/node` 的运行环境、`--data` 和 `--backup` 指向私有存储和另一块磁盘。默认监听 `127.0.0.1:18430`。

安装器创建 pku-open3d-web、pku-open3d-worker、pku-open3d-backup 用户服务与每日备份计时器。worker 只运行一个构建，CPUQuota=400%、4 核 CPUAffinity、MemoryMax=16G。部分机器不向用户服务委派 CPU 控制器，CPU 亲和性会继续限制可使用的核心数；验收时检查实际 cgroup memory.max 和进程亲和性。检查用户 linger，以便退出 SSH 后服务继续运行。数据目录权限 700，环境文件 600；不要公开输出 service.env。

## 固定域名与 Cloudflare

用户注册 `pku-open3d.org` 并将域名加入 Cloudflare。服务器安装 cloudflared 后，用项目专用配置路径执行 `tunnel login`；浏览器授权该域名，再 `tunnel create pku-open3d` 和 `tunnel route dns <UUID> pku-open3d.org`。命名隧道不是临时随机地址。

参照 `ops/cloudflared.example.yml`，将域名转发至 `http://127.0.0.1:18430`，最后一条返回 404；网络限制 UDP 时使用 http2。隧道凭证保存在代码目录外，用示例用户服务启动。

将私有 service.env 的 `PKU_PUBLIC_URL` 改为 `https://pku-open3d.org` 并重启 web/worker。云端 HTTPS 终止于 Cloudflare；服务器不新增公网监听端口。对 `/api/*`、`/receipt/*`、`/setup/*` 禁止 Cloudflare 缓存，保留 origin 的 no-store。

官方说明：[Cloudflare 命名隧道](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/)。域名续费由用户负责；首期使用已有机器与磁盘，不购买额外固定服务。

## GitHub 首次授权

固定 HTTPS 就绪后打开 `/setup/`。维护者在自己终端私下读取 service.env 的 `PKU_SETUP_KEY`，填入页面（不放进 URL、不发公开 Issue）。页面通过 [GitHub App Manifest](https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest) 预填权限与回调；创建后仅安装到 `jiangjin1999/pku-open-3d`。

应用客户端秘密、私钥和 installation ID 只保存在私有 data/secrets。用途为身份登录、该仓库模型 PR 与检查；不收集参与者 GitHub PAT。首次使用 GitHub 账号完成登录，运行 CLI login 并确认配对，验证整个流程。需要维护者配置仓库 ruleset 时，保留此 App 对模型发布的权限，同时审阅代码修改；不要给贡献者共享 App 私钥。

## 更新与检查

- 服务状态：`systemctl --user status pku-open3d-web pku-open3d-worker`。
- 就绪状态：`/api/v1/health`；worker_online、campus_ready、github_login_ready、publisher_ready 应均为 true。
- `python -m pytest` 检查资料权限、队列、模拟 GitHub 发布、备份及回退；`npm test` 检查原渲染器。
- `node scripts/smoke-community.mjs` 对本机隔离测试实例验证移动表单和渲染。测试照片、身份只用于临时数据库，不进入生产。
- 程序更新由维护者审核后构建贡献页、测试、重启服务。`npm run deploy` 原子切换校园静态构建，失败保留现有 dist。模型数据更新无需重建整个校园。

## 备份与恢复

每天创建数据库快照和照片硬链接快照，再复制到另一块磁盘。校验 SHA-256 与数据库完整性后才算备份完成；默认保留 14 份。备份服务还执行恢复演练。

```sh
python ops/backup.py create --data <data> --backup-root <other-disk>
python ops/backup.py verify --snapshot <snapshot>
python ops/backup.py drill --snapshot <snapshot>
python ops/backup.py restore --snapshot <snapshot> --destination <NEW-empty-path>
```

恢复不会覆盖现有数据。真实事故时停止 web/worker，恢复到新目录，核对恢复点之后的撤回请求，修改服务 data 路径再启动。恢复会清空旧登录状态、暂停发布并修复私钥路径。旧数据目录先保留，待验收后处理。

维护者在 `/admin/` 暂停/恢复自动发布，并按 revision 回退单个部位。回退立即生效并暂停发布；多部位建筑逐部位回退。Git 历史保留，修正发布前必须基于当前生效版本。

## 公网验收

域名及应用完成授权后，使用校外网络和手机检查首页、匿名照片及反馈、凭证补充、GitHub 登录、CLI 认领和图片权限、真实模型 PR 自动合并、发布查询。单独检查未认领账号无法读照片。模拟失败和重启，确认旧模型仍可访问。没有完成这些真实公网检查前，不应宣称“公网验收完成”。

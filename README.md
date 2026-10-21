# Rhine Lab

[中文](#中文) · [English](#english) · [在线体验](https://halleylab.github.io/Rhine_Lab/) · [下载最新版](https://github.com/HalleyLab/Rhine_Lab/releases/latest)

<a id="中文"></a>

## 中文

Rhine Lab 是一款面向生命科学研究的个人实验管理工具，以莱茵生命技术设计风格整合日常实验、样本与库存信息。

### 主要功能

- 按日期管理实验记录，并在记录下保存结果、照片和附件。
- 创建 Protocol，关联文献、实验步骤、试剂用量与日程。
- 使用日历或每日视图安排可重叠日程，并从日程开始实验。
- 通过笼架、笼位和动物条目管理不同实验动物。
- 管理试剂与实验耗材，记录实验消耗并提供低库存提醒。
- 记录细胞培养、传代、培养条件与冻存样本位置。
- 查看动物、细胞、样本、实验和结果之间的简明谱系。
- 提供科学计算器、配液计算、Master Mix 及多孔板标注工具。
- 在 Windows / macOS 应用中通过可视化运行中心执行本地或 SSH 服务器生信流程；浏览器可连接自有运行网关。
- 支持本地加密存储、跨设备同步和只读 LAB 共用界面。
- 支持网页、Windows、macOS 与 Android，并提供中英文和日夜主题。

云同步后端采用 Cloudflare Workers、D1 与 R2；工作区、LAB 投影和附件在客户端加密后上传。部署说明见 [cloudflare/README.md](cloudflare/README.md)。

当前版本：**0.4.2**

### macOS 桌面版

- 使用现有 Electron 桌面应用，个人工作区保存在本机；新安装默认空工作区，支持加密同步文件导入。
- 通用安装包同时包含 Apple Silicon 与 Intel 架构：DMG 用于安装，ZIP 和 `latest-mac.yml` 用于已签名版本的自动更新。
- 支持 macOS 菜单、Dock 重新打开窗口、`rhinelab://` 回调、本地运行与 SSH；从 Finder 启动时也会查找 Homebrew 的运行程序。

在 Mac 上安装 Node.js 24 和 pnpm 11 后运行：

```sh
pnpm install --frozen-lockfile
pnpm verify:desktop
pnpm desktop:build:mac
```

产物位于 `dist/release-0.4.2/`，包括 `Rhine-Lab-0.4.2-macOS-universal.dmg` 与 ZIP。打开 DMG 后，将 Rhine Lab 拖入“应用程序”再运行。开发包为临时签名，未经 Apple 公证，不启用自动更新；这不等同于可免安全提示的正式发行包。电脑上需另外安装运行生信流程所需的 Python、R、Docker 等工具。

`Build desktop distributions` 工作流使用 macOS runner 生成开发测试产物。正式发布复用 `Publish Rhine Lab release` 工作流的 macOS 任务：公证沿用现有 iOS 的 App Store Connect API 密钥，另需增加 Mac 专用证书及密码。

| Secret | 内容 |
| --- | --- |
| `MAC_CSC_LINK` | Developer ID Application 证书和私钥导出的 `.p12` 文件的 Base64；不是 iOS Distribution 证书 |
| `MAC_CSC_KEY_PASSWORD` | `.p12` 密码 |
| `APPLE_TEAM_ID` | Apple 开发者团队 ID |
| `APP_STORE_CONNECT_ISSUER_ID` | 已有 App Store Connect 团队 API 的 Issuer ID |
| `APP_STORE_CONNECT_KEY_ID` | 已有 API 的 Key ID |
| `APP_STORE_CONNECT_PRIVATE_KEY` | 已有 API 的 `.p8` 内容；API 密钥需具有公证权限 |

正式任务执行 `pnpm desktop:build:mac:release`，验证双架构、签名和公证票据后上传 DMG、ZIP、校验文件和 `latest-mac.yml`。缺少凭据会明确失败，不会静默发布未经公证的正式 Mac 包。不要提交证书或密钥文件。macOS 侧跨设备传输使用已建立的本地网络连接或加密同步文件；蓝牙 PAN 能否建立由系统和手机支持情况决定。

### 手机 / 电脑蓝牙同步

使用系统蓝牙网络共享（PAN），不是网页 Web Bluetooth，也不会将工作区上传服务器。需要安装更新后的 Windows、Android 或 iOS 应用，并保持两端应用打开。

1. 在系统设置中配对手机和电脑。Android 开启“蓝牙网络共享”；iPhone 开启“个人热点”，允许其他人加入。
2. Windows 在“蓝牙和设备”中选择手机，加入其“个人区域网络（PAN）”，以接入点方式连接。仅配对还没有建立数据连接。
3. 两端打开“数据同步”，输入相同的、至少 10 位的传输密码。在电脑端点击“刷新电脑地址”，找到蓝牙网络连接的 IPv4 地址，填入手机的“电脑地址”。不要选择 Wi-Fi 的地址。
4. 两端点击“启用蓝牙同步”。iPhone 首次连接需允许本地网络访问。电脑防火墙需允许该应用的本地 TCP 32123 / UDP 32124；不要开放到公网。

首次连接时，空的个人工作区会接收另一端数据；两端原本都有记录或同时修改时，保留个人工作区，合并到本机 LAB，避免静默覆盖。照片较多时蓝牙较慢，可使用原有同步文件。浏览器版使用加密同步文件，不提供原生蓝牙入口。系统热点可能受运营商限制；同步数据走本地设备连接，但电脑其他应用可能使用手机流量。

<a id="english"></a>

## English

Rhine Lab is a personal research workspace for life-science laboratories, combining experiment, sample, culture, and inventory management in a Rhine Lab-inspired technical interface.

### Key features

- Organize experiment records by date and attach results, images, and files.
- Create literature-linked protocols with steps, reagent usage, and schedules.
- Plan overlapping events in calendar or daily views and start experiments from the schedule.
- Manage multiple animal species through racks, cage positions, and animal records.
- Track reagents and laboratory consumables, recorded usage, and low-stock alerts.
- Record cell culture conditions, passages, and frozen-sample locations.
- View concise lineage links between animals, cells, samples, experiments, and results.
- Use a scientific calculator, solution calculators, Master Mix tools, and customizable plate annotations.
- Run local or SSH-hosted bioinformatics pipelines from the Windows / macOS desktop runner; browsers can use a private runner gateway.
- Keep data encrypted locally, synchronize between devices, and use read-only shared LAB workspaces.
- Supports web, Windows, macOS, and Android with Chinese/English and light/dark themes.

Cloud sync uses Cloudflare Workers, D1, and R2. Workspace snapshots, LAB projections, and attachments are encrypted on the client before upload. See [cloudflare/README.md](cloudflare/README.md) for deployment notes.

Current version: **0.4.2**

### macOS desktop

On a Mac with Node.js 24 and pnpm 11, run `pnpm install --frozen-lockfile`, `pnpm verify:desktop`, then `pnpm desktop:build:mac`. The universal DMG / ZIP in `dist/release-0.4.2/` supports both Apple Silicon and Intel. Workspaces stay local and new installations start empty. Install your own Python / R / Docker tools for local analysis.

Development packages use ad-hoc signing, are not notarized, and do not auto-update. The desktop-distributions workflow builds test artifacts on a macOS runner. Public releases reuse the existing iOS App Store Connect API secrets and Team ID for notarization; add a **Developer ID Application** `.p12` certificate and its password as `MAC_CSC_LINK` and `MAC_CSC_KEY_PASSWORD`. The API key must allow notarization. The release workflow runs `pnpm desktop:build:mac:release`, verifies architecture, signing and notarization, then uploads the DMG, update ZIP and `latest-mac.yml`. Missing credentials fail the macOS release job instead of silently publishing an unsigned package. Never commit certificates or private keys. Local-network transfer and encrypted sync files are available; Bluetooth PAN support depends on the operating system and phone.

### Phone / computer Bluetooth sync

Uses system Bluetooth tethering (PAN), not Web Bluetooth; workspace data stays on the local device connection. Install the updated Windows and Android/iOS apps and keep both open.

1. Pair the devices in system settings. Enable Bluetooth tethering on Android, or Personal Hotspot / Allow Others to Join on iPhone.
2. In Windows Bluetooth device settings, join the phone’s Personal Area Network (PAN) as an access point. Pairing alone is not a network connection.
3. Open Data sync in both apps and enter the same transfer password (at least 10 characters). Refresh the computer addresses; enter the Bluetooth network’s IPv4 address on the phone, not its Wi-Fi address.
4. Enable Bluetooth sync on both devices. Allow local network access on iPhone. Allow the app’s local TCP 32123 / UDP 32124 in the computer firewall; do not expose these ports publicly.

An empty personal workspace receives the other device’s data. If both devices already have records, or both have changes, personal workspaces are preserved and records are merged into local LAB instead of being silently overwritten. Large photo collections may transfer slowly; encrypted sync files remain available. Browser editions use encrypted sync files, not native Bluetooth. Hotspot availability depends on the carrier; other computer apps may use the phone’s mobile data even though workspace sync is local.

Third-party notices are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Rhine Lab is an unofficial, non-commercial fan-style prototype and is not affiliated with or endorsed by *Arknights* or its rights holders.

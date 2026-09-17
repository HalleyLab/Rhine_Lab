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
- 支持本地加密存储、跨设备同步和只读 LAB 共用界面。
- 提供网页、Windows 与 Android 版本，并支持中英文和日夜主题。

云同步后端采用 Cloudflare Workers、D1 与 R2；工作区、LAB 投影和附件在客户端加密后上传。部署说明见 [cloudflare/README.md](cloudflare/README.md)。

当前版本：**0.3.3**

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
- Keep data encrypted locally, synchronize between devices, and use read-only shared LAB workspaces.
- Available for web, Windows, and Android with Chinese/English and light/dark themes.

Cloud sync uses Cloudflare Workers, D1, and R2. Workspace snapshots, LAB projections, and attachments are encrypted on the client before upload. See [cloudflare/README.md](cloudflare/README.md) for deployment notes.

Current version: **0.3.3**

### Phone / computer Bluetooth sync

Uses system Bluetooth tethering (PAN), not Web Bluetooth; workspace data stays on the local device connection. Install the updated Windows and Android/iOS apps and keep both open.

1. Pair the devices in system settings. Enable Bluetooth tethering on Android, or Personal Hotspot / Allow Others to Join on iPhone.
2. In Windows Bluetooth device settings, join the phone’s Personal Area Network (PAN) as an access point. Pairing alone is not a network connection.
3. Open Data sync in both apps and enter the same transfer password (at least 10 characters). Refresh the computer addresses; enter the Bluetooth network’s IPv4 address on the phone, not its Wi-Fi address.
4. Enable Bluetooth sync on both devices. Allow local network access on iPhone. Allow the app’s local TCP 32123 / UDP 32124 in the computer firewall; do not expose these ports publicly.

An empty personal workspace receives the other device’s data. If both devices already have records, or both have changes, personal workspaces are preserved and records are merged into local LAB instead of being silently overwritten. Large photo collections may transfer slowly; encrypted sync files remain available. Browser editions use encrypted sync files, not native Bluetooth. Hotspot availability depends on the carrier; other computer apps may use the phone’s mobile data even though workspace sync is local.

Third-party notices are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Rhine Lab is an unofficial, non-commercial fan-style prototype and is not affiliated with or endorsed by *Arknights* or its rights holders.

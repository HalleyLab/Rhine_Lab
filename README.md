# Rhine Lab

[中文](#中文) · [English](#english)

Rhine Lab 是一款面向生命科学研究的个人与实验室协作工作台，支持网页、Android、Windows 和浏览器扩展。

[在线体验](https://halleylab.github.io/Rhine_Lab/) · [下载应用](https://github.com/HalleyLab/Rhine_Lab/releases/tag/v0.1.7)

---

<a id="中文"></a>

## 中文

### 基本功能

- 实验记录与结果：按日期记录实验、实际试剂用量、照片、文件和结果。
- Protocol：编辑实验流程、试剂用量、计时步骤、孔板标注，并关联 DOI、PMID 或文献链接。
- 日程排班：日历与每日视图、拖动创建日程、重叠事件，以及从日程开始实验。
- 动物管理：使用“笼架—笼位—动物”结构管理多种实验动物。
- 试剂库存：记录库存、位置、批次和有效期，并在余量不足时提醒。
- 细胞维持：记录细胞、培养基、培养条件、容器及传代历史。
- 冻存样本：使用 9×9 冻存盒管理位置、样本信息和照片。
- 多端同步：登录后可在手机、电脑和网页之间同步个人数据；LAB 管理者可管理共用工作区。
- 中英双语、日间/夜间模式，以及拍照辅助录入。

### 使用方式

- **网页展示版：** [GitHub Pages](https://halleylab.github.io/Rhine_Lab/)；未登录时为只读，登录后可编辑和同步。
- **Android：** 下载 `Rhine-Lab-0.1.7-internal.apk` 后直接安装。
- **Windows：** 下载 `Rhine-Lab-0.1.7-Windows.exe` 后直接运行，无需解压。
- **浏览器扩展：** 下载 ZIP，解压后通过 Chrome/Edge 的“加载已解压的扩展程序”安装。

新安装的应用默认使用空工作区。数据优先保存在当前设备；登录并启用云同步后，可在不同设备之间同步。

---

<a id="english"></a>

## English

Rhine Lab is a personal and collaborative laboratory workspace for life-science research. It is available for the web, Android, Windows, and Chromium-based browsers.

### Core features

- Experiment records and results, organized by date with reagent usage, photos, files, and conclusions.
- Protocol workflows with reagent quantities, timers, plate annotations, and DOI, PMID, or literature links.
- Daily and calendar scheduling with drag-to-create, overlapping events, and experiment launch from scheduled tasks.
- Multi-species animal management using a rack–cage–animal structure.
- Reagent inventory with storage locations, lot numbers, expiry dates, and low-stock alerts.
- Cell-culture maintenance with media, culture conditions, vessels, and passage history.
- Frozen-sample storage using configurable 9×9 cryoboxes.
- Account-based synchronization across mobile, desktop, and web, plus managed LAB shared workspaces.
- Chinese/English interface, automatic light/dark themes, and photo-assisted data entry.

### Get started

- **Web demo:** [GitHub Pages](https://halleylab.github.io/Rhine_Lab/). The public site is read-only until you sign in.
- **Android:** Download and install `Rhine-Lab-0.1.7-internal.apk`.
- **Windows:** Download and run `Rhine-Lab-0.1.7-Windows.exe`; no extraction is required.
- **Browser extension:** Download the ZIP, extract it, then load the folder as an unpacked extension in Chrome or Edge.

New installations start with an empty workspace. Data is stored locally first and can be synchronized across devices after sign-in.

## Development

```bash
pnpm install
python -m http.server 4173
```

Open `http://127.0.0.1:4173/` in a browser.

## Open-source acknowledgements / 开源致谢

Dashboard pattern attribution and license details are recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Disclaimer

Rhine Lab is an unofficial, non-commercial fan-style research-tool prototype. It is not affiliated with or endorsed by *Arknights* or its rights holders. Related names and visual identities belong to their respective owners.

# Rhine Lab

[中文](#中文) · [English](#english) · [在线体验](https://halleylab.github.io/Rhine_Lab/) · [下载最新版](https://github.com/HalleyLab/Rhine_Lab/releases/latest)

<a id="中文"></a>

## 中文

Rhine Lab 是面向生命科学研究的个人工作台，提供实验记录与结果、Protocol 与文献关联、日程、动物笼架、试剂/耗材、细胞维持和冻存样本管理。
科研工具工作区可建立“动物/细胞来源 → 样本 → 实验 → 结果”谱系，并提供稀释、摩尔溶液、细胞铺板、Master Mix 计算和 6–384 孔实验布局。

- 支持网页、Android、Windows 与 Chrome/Edge 扩展。
- 新安装默认是空工作区；GitHub Pages 未登录时只读展示。
- 本机数据使用设备级 AES‑256‑GCM 加密；账户密码同时派生个人数据加密密钥，云端仅保存密文。
- 不登录也可导出 `.rhinelab` 加密同步文件，通过数据线、隔空投送、附近分享或网盘传到另一台设备后导入。
- 一个账户可创建或加入多个 LAB；通过 LAB 名称和密码加入。LAB 共用页始终只读。
- 每条日程可选择“在 LAB 显示”或“仅个人可见”。

下载：Android 使用 `Rhine-Lab-0.2.1-Android.apk`；Windows 使用 `Rhine-Lab-0.2.1-Windows-Setup.exe`。应用启动后会联网检查 GitHub 最新正式版本，并在更新前征求确认。

无账号同步：在“设备同步”中设置至少 10 位传输密码并导出文件；把文件传到另一台设备，选择同一文件、输入相同密码并确认导入。导入会替换目标设备的个人工作区。

云端配置需依次执行 `supabase/migrations/001` 至 `007_fix_lab_password_join_ambiguity.sql`。账户密码不会发送给 Rhine Lab 数据库；忘记后无法恢复既有密文。

<a id="english"></a>

## English

Rhine Lab is a personal life-science workspace for experiment records and results, literature-linked protocols, schedules, animal housing, reagent and consumable inventory, cell maintenance, and frozen samples.
The Research Tools workspace connects animal/cell sources to samples, experiments, and results, and includes dilution, molar-solution, cell-seeding, master-mix, and 6–384-well layout tools.

- Available on the web, Android, Windows, and Chrome/Edge.
- New installations start empty; the unsigned GitHub Pages site is read-only.
- Local data is protected with device-bound AES‑256‑GCM. The account password also derives the personal-data encryption key, so the cloud stores ciphertext only.
- Without signing in, export an encrypted `.rhinelab` file and move it to another device by USB cable, AirDrop, Nearby Share, or cloud drive.
- One account may create or join multiple LABs by LAB name and password. The shared LAB workspace is always read-only.
- Each schedule item can be shared with the LAB or kept private.

Downloads: `Rhine-Lab-0.2.1-Android.apk` for Android or `Rhine-Lab-0.2.1-Windows-Setup.exe` for Windows. On launch, the apps check the latest stable GitHub release and ask before updating.

Account-free transfer: open “Device sync,” choose a transfer password of at least 10 characters, and export the file. Move it to the other device, choose the same file, enter the same password, and confirm import. Importing replaces that device’s personal workspace.

For cloud setup, apply migrations `001` through `007_fix_lab_password_join_ambiguity.sql` in order. The account password is not sent to the Rhine Lab database and cannot be recovered if lost.

## Development

```bash
pnpm install
python -m http.server 4173
```

Third-party notices are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Rhine Lab is an unofficial, non-commercial fan-style prototype and is not affiliated with or endorsed by *Arknights* or its rights holders.

# Rhine Lab

[中文](#中文) · [English](#english) · [在线体验](https://halleylab.github.io/Rhine_Lab/) · [下载 v0.1.9](https://github.com/HalleyLab/Rhine_Lab/releases/tag/v0.1.9)

<a id="中文"></a>

## 中文

Rhine Lab 是面向生命科学研究的个人工作台，提供实验记录与结果、Protocol 与文献关联、日程、动物笼架、试剂/耗材、细胞维持和冻存样本管理。

- 支持网页、Android、Windows 与 Chrome/Edge 扩展。
- 新安装默认是空工作区；GitHub Pages 未登录时只读展示。
- 本机数据使用设备级 AES‑256‑GCM 加密；账户密码同时派生个人数据加密密钥，云端仅保存密文。
- 一个账户可创建或加入多个 LAB；可通过 LAB 名称和密码加入，也可使用指定邮箱的邀请链接加入。LAB 共用页始终只读。
- 每条日程可选择“在 LAB 显示”或“仅个人可见”。

下载：Android 使用 `Rhine-Lab-0.1.9-internal.apk`；Windows 使用 `Rhine-Lab-0.1.9-Windows.exe`；浏览器扩展解压 ZIP 后在扩展管理页选择“加载已解压的扩展程序”。

云端配置需依次执行 `supabase/migrations/001` 至 `006_multi_lab_password_join.sql`。账户密码不会发送给 Rhine Lab 数据库；忘记后无法恢复既有密文。

<a id="english"></a>

## English

Rhine Lab is a personal life-science workspace for experiment records and results, literature-linked protocols, schedules, animal housing, reagent and consumable inventory, cell maintenance, and frozen samples.

- Available on the web, Android, Windows, and Chrome/Edge.
- New installations start empty; the unsigned GitHub Pages site is read-only.
- Local data is protected with device-bound AES‑256‑GCM. The account password also derives the personal-data encryption key, so the cloud stores ciphertext only.
- One account may create or join multiple LABs by LAB name/password or an email-bound invitation link. The shared LAB workspace is always read-only.
- Each schedule item can be shared with the LAB or kept private.

Downloads: `Rhine-Lab-0.1.9-internal.apk` for Android, `Rhine-Lab-0.1.9-Windows.exe` for Windows, or the unpacked browser-extension ZIP for Chrome/Edge.

For cloud setup, apply migrations `001` through `006_multi_lab_password_join.sql` in order. The account password is not sent to the Rhine Lab database and cannot be recovered if lost.

## Development

```bash
pnpm install
python -m http.server 4173
```

Third-party notices are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Rhine Lab is an unofficial, non-commercial fan-style prototype and is not affiliated with or endorsed by *Arknights* or its rights holders.

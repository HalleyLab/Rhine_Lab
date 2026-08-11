# Rhine Lab

Rhine Lab 是一个面向生命科学研究的个人与实验室协作工作台，采用响应式 PWA 设计，并提供 Android、Windows 和 Chrome/Edge 入口。

## 功能

- 按日期归档实验记录，并在每条记录下直接填写、编辑或删除实验结果与附件
- 实验记录中的实际试剂用量与可保存照片的同步实验步骤
- 步骤计时、科学计算器与 96 孔板等装置标注
- 从日程事件开始或继续实验，并同步关联 Protocol 的执行步骤
- 多物种动物管理：先建立笼架与笼位，再向笼位添加动物条目；旧动物记录会自动迁移
- 细胞维持、培养容器、汇合度与传代/换液历史
- 试剂库存、低余量提醒与试剂详情
- 9×9 冻存盒、冻存样本与拍照辅助录入
- Protocol 流程图、试剂用量、原始照片与文献（题目、引文、DOI/PMID、链接）关联
- 日程管理与实验执行
- 输入 `CLEAR` 后清空当前个人工作区的全部信息
- 顶栏中英文切换，语言选择会在刷新和跨页面导航后保留
- 未手动选择主题时，按设备本地时间在 06:00–18:00 使用日间模式，其余时间使用夜间模式
- 夜间模式为表单、下拉选项与功能标签提供完整的高对比度反色
- 个人工作区与 LAB 共用只读/管理权限
- Supabase 登录、跨设备同步、Realtime 和私有照片存储
- LAB 所有者与管理员可在设备同步面板查看当前 LAB 绑定邮箱

## 2026-08-10 更新

- GitHub Pages 未登录时为只读展示；登录后才可新增、编辑、删除、拖动日程或清空工作区
- 新安装的 Android、Windows 或 PWA 首次打开为空工作区，不预置实验条目

## 2026-08-11 更新

- GitHub Pages 改为公开只读展示模式，登录状态会即时控制完整写入权限
- 动物管理升级为“笼架 → 笼位 → 多物种动物条目”，支持小鼠、大鼠、兔、斑马鱼及自定义物种
- 新增 Chrome / Microsoft Edge 快捷插件和 Windows 便携应用构建
- 已安装应用首次启动默认空数据；公开展示页继续保留示例数据
- 更新静态缓存版本，确保 GitHub Pages 及时加载本次改动
- 加入 Capacitor 8 Android 内部测试版、莱茵生命风格图标与日间/夜间启动页
- 配置 Supabase 邮箱登录、个人/LAB 权限、跨设备同步及原生回调
- 工作区标题只保留英文技术标签，统一引用正文与署名字号
- 统一指标栏、筛选栏和搜索提示字体，并适当缩小数据条目行文字
- 彻底统一 Unicode 字体映射：中文使用黑体，拉丁字符使用 Helvetica，覆盖动态卡片、输入值、占位符和下拉选项
- 将“实验结果”合并进“实验记录”，每条记录下直接维护一一对应的结果、结论、附件与下一步计划
- Protocol 新增关联文献字段，并支持通过 DOI 或 PMID 自动生成原文入口

## 本地预览

直接打开 `file://` 会限制 PWA 与部分浏览器能力，请使用静态服务器：

```bash
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## 示例数据

初始演示记录位于 `data/seed.json`。它只用于普通浏览器中的展示页；Android、Windows、浏览器安装的 PWA 等已安装版本首次启动时会创建空工作区。已经存在的本地数据不会被示例数据覆盖。

GitHub Pages 地址未登录时只能浏览示例和已有数据。点击顶栏“登录 / 同步”并完成邮箱验证后，个人工作区才会解锁编辑；退出登录后立即恢复只读。

## 启用云同步

1. 创建 Supabase 项目。
2. 在 SQL Editor 按编号顺序执行 `supabase/migrations/` 中的迁移文件。
3. 注册管理账户，并创建第一条 `labs` 记录。
4. 将 Project URL、publishable key 和 LAB ID 填入 `js/rhine-lab-config.js`。
5. 在 Supabase Authentication 中将 GitHub Pages 地址加入 Redirect URLs。

`publishable`/`anon` key 可以用于浏览器，但必须配合 RLS。绝对不要把 `service_role` key、数据库密码或个人访问令牌提交到仓库。

## GitHub Pages

`.github/workflows/pages.yml` 会在 `main` 更新后部署静态站点。仓库需要在 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。

## 内部测试应用

项目使用 Capacitor 8 封装 Android 内部测试版。GitHub Actions 会自动构建可直接分享的 APK，并将构建产物保留 30 天。

安装方法、Supabase 移动端回调配置以及 iOS/TestFlight 准备说明请查看 [MOBILE_TESTING.md](MOBILE_TESTING.md)。

## 声明

这是非官方、非商业的同人风格研究工具原型，与《明日方舟》及其权利方无隶属或授权关系。相关名称与视觉标识归各自权利方所有。

## Windows 独立应用

`.github/workflows/desktop-distributions.yml` 会生成 `Rhine-Lab-0.1.5-Windows.exe` 便携版。用户下载后可直接运行，不需要安装或解压；首次打开为空工作区。未签名的内部测试包可能触发 Windows SmartScreen 提示。

本地开发运行：

```bash
pnpm install
pnpm desktop:start
```

## Chrome / Microsoft Edge 插件

同一工作流会生成 `Rhine-Lab-Browser-Extension-0.1.5.zip`。该插件在浏览器工具栏提供 Rhine Lab 快捷入口，并沿用 GitHub Pages 的登录和同步状态。

解压后在浏览器扩展管理页开启“开发者模式”，选择“加载已解压的扩展程序”，指向 `browser-extension` 目录。正式商店发布仍需分别提交 Chrome Web Store 和 Microsoft Edge Add-ons 审核。

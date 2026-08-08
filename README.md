# Rhine Lab

Rhine Lab 是一个面向生命科学研究的个人与实验室协作工作台，采用响应式 PWA 设计，可在电脑浏览器和手机上使用。

## 功能

- 实验记录与实际试剂用量
- 动物管理与单只动物详情
- 试剂库存、低余量提醒与试剂详情
- 9×9 冻存盒、样本库与拍照辅助录入
- Protocol 流程图和日程管理
- 顶栏中英文切换，语言选择会在刷新和跨页面导航后保留
- 个人工作区与 LAB 共用只读/管理权限
- Supabase 登录、跨设备同步、Realtime 和私有照片存储

## 本地预览

直接打开 `file://` 会限制 PWA 与部分浏览器能力，请使用静态服务器：

```bash
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## 示例数据

初始演示记录位于 `data/seed.json`。应用首次加载时读取该文件；浏览器中已经存在的个人数据不会被示例数据覆盖。修改示例数据后，可清除该站点的本地存储以重新查看初始化效果。

## 启用云同步

1. 创建 Supabase 项目。
2. 在 SQL Editor 执行 `supabase/migrations/001_rhine_lab_sync.sql`。
3. 注册管理账户，并创建第一条 `labs` 记录。
4. 将 Project URL、publishable key 和 LAB ID 填入 `js/rhine-lab-config.js`。
5. 在 Supabase Authentication 中将 GitHub Pages 地址加入 Redirect URLs。

`publishable`/`anon` key 可以用于浏览器，但必须配合 RLS。绝对不要把 `service_role` key、数据库密码或个人访问令牌提交到仓库。

## GitHub Pages

`.github/workflows/pages.yml` 会在 `main` 更新后部署静态站点。仓库需要在 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。

## 声明

这是非官方、非商业的同人风格研究工具原型，与《明日方舟》及其权利方无隶属或授权关系。相关名称与视觉标识归各自权利方所有。

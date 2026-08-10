# Rhine Lab 内部测试应用

这一版本保留现有莱茵生命风格，用于受控的内部测试分享，不是商店正式发行包。

## Android 安装方法

1. 打开仓库的 Actions 页面。
2. 选择最新成功的 Build Android internal APK 任务。
3. 下载 Rhine-Lab-Android-Internal 构建产物。
4. 解压 ZIP，得到 Rhine-Lab-0.1.0-internal.apk。
5. 将 APK 发送到 Android 手机并安装。
6. 如果系统阻止安装，请只对当前文件管理器临时允许“安装未知应用”。

同目录的 .sha256 文件可用于确认下载后的 APK 没有损坏。

## Supabase 移动端回调

在 Supabase Dashboard 的 Authentication → URL Configuration → Redirect URLs 中加入：

    rhinelab://auth/callback

缺少该回调时，原生应用中的邮箱登录链接无法返回 Rhine Lab。GitHub Pages 现有的回调地址也要继续保留。

## 数据与权限

- 应用继续使用本机缓存，因此离线时仍可查看和编辑。
- 登录 Supabase 后，允许同步的数据会在手机、电脑和网页端合并。
- LAB 共用数据仍按 owner、manager、member 权限控制。
- Android 已禁用明文 HTTP 和系统备份；应用仅允许 HTTPS 网络请求。
- 清除 App 数据或卸载前，请先确认待同步记录已经上传。

## 应用标识与本地构建

应用标识：

    com.halleylab.rhinelab

本机构建 Android 需要：

- Node.js 22+
- Android Studio 2025.2.1+
- Android SDK 36

准备项目：

    pnpm install
    pnpm mobile:assets
    pnpm exec capacitor-assets generate --android
    pnpm mobile:sync

Windows 构建：

    cd android
    .\gradlew.bat assembleDebug

## iOS / TestFlight

iOS 包必须在 Mac、Xcode 26+ 和 Apple Developer 账户环境下签名。Mac 上可先执行：

    pnpm install
    pnpm mobile:prepare
    pnpm exec cap add ios

随后在 Xcode 中设置团队、Bundle ID 和 rhinelab 回调 scheme，再通过 TestFlight 分发。

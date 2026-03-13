## 目标
把当前项目（Vue3 + Vite + Vant）打包为可安装的安卓 App（APK/AAB），并支持：
- 本地离线资源加载（打包进 App）
- 正常访问后端 API
- 正常使用路由（createWebHistory 不改动）
- 具备发布签名与上架产物（AAB）

---

## 现状分析（与安卓打包相关）
- 构建工具：Vite，`vite.config.js` 中 `base: './'`，适合静态资源相对路径部署，也适合 WebView/Capacitor 本地资源。
- 路由：`createWebHistory`（见 `src/router/index.js`），对“直接 file:// 打开静态页”的 WebView 方案不友好，但对 Capacitor 的本地 http(s) 容器友好。
- API BaseURL：运行时通过 `src/stores/config.js` 动态维护 `baseUrl`，并在 `src/utils/http.js` 请求拦截器中拼接。
- 远程 config：`configStore.loadConfig()` 默认生产环境会走远程配置（URL/COS），这在原生 App WebView 中很容易被 CORS/Origin 限制影响。
- 生产环境自动跳转域名：`App.vue` 中 `checkAndRedirectWebDomain()` 仅在 PROD 执行；在 App 容器里如果触发，会把 WebView 跳到外部站点，通常不希望发生。

因此：推荐采用 **Capacitor**，并为“安卓 App 模式”提供一个单独的 Vite mode（如 `android`），强制使用本地配置（`VITE_USE_LOCAL_CONFIG=true`）并指定 API 绝对地址（`VITE_API_BASE_URL=https://...`），避免远程 config/CORS/域名跳转等问题。

---

## 方案对比
### 方案 A：Capacitor（推荐）
优点：
- 不需要把路由改成 hash
- 支持热更新调试、Android Studio 原生打包流程完整
- 后续可逐步接入推送、相机、定位等原生能力
缺点：
- 需要新增 Capacitor 配置与 android 工程目录

### 方案 B：原生 WebView 壳 + assets（不推荐本项目现状）
缺点：
- 你当前是 `createWebHistory`，路由刷新/深链接需要额外拦截与映射，成本更高
- 文件上传、相机等需要自己写 WebChromeClient 适配

---

## 推荐落地：Capacitor 打包安卓 App

### 1) 环境准备
- Node.js 18+（与当前 Vite5 兼容）
- Android Studio（含 SDK / platform-tools）
- JDK 17（Android Gradle Plugin 8+ 默认要求）
- 电脑开启 Android SDK 的环境变量（Android Studio 安装时一般自动处理）

### 2) 增加 Capacitor 依赖
在项目根目录执行：
```bash
npm i @capacitor/core @capacitor/android
npm i -D @capacitor/cli
```

### 3) 初始化 Capacitor
```bash
npx cap init "民生资产" "com.minsheng.assets" --web-dir dist
```
- AppName 可改成你们真实展示名
- AppId 需要唯一且以后不要随便改（影响升级）

### 4) 增加安卓专用环境配置（关键）
新增 `.env.android`（或 `.env.capacitor`，任选其一，但建议叫 android 便于理解）：
```env
VITE_USE_LOCAL_CONFIG=true
VITE_API_BASE_URL=https://你的API域名
```
说明：
- `VITE_USE_LOCAL_CONFIG=true`：强制走本地配置分支，避免远程 config 在 App 内被 CORS 阻断。
- `VITE_API_BASE_URL`：必须是 **绝对地址**（`/api` 这种开发代理在 App 内不可用）。

如果你的 API 仍是 http 明文：
- 最好改 https
- 否则需要 Android 网络策略允许明文（见后续第 8 节）

### 5) 构建 Web 产物并同步到安卓工程
```bash
vite build --mode android
npx cap add android
npx cap sync android
```
以后每次改前端：
```bash
vite build --mode android
npx cap sync android
```

### 6) 运行调试
```bash
npx cap open android
```
在 Android Studio：
- 选择真实手机/模拟器
- Run 运行

### 7) 重要运行时注意点（与你们代码强相关）
#### 7.1 生产环境域名跳转逻辑
`App.vue` 会在 PROD 环境里调用 `checkAndRedirectWebDomain()`。
在安卓 App 模式下通常不希望跳出 WebView。
你有两种做法：
- 推荐：安卓 build mode 下不设置 `webBaseUrl`，且 `VITE_USE_LOCAL_CONFIG=true`，通常不会触发跳转目标。
- 更稳妥：在 `checkAndRedirectWebDomain()` 内增加协议判断（非 http/https 则直接 return），避免在 `capacitor://` 或 `http://localhost` 容器里跳转。

#### 7.2 远程配置与 CORS
如果必须使用远程 config（不建议），需要确保 config 文件服务端允许 `Origin: null / capacitor://localhost / http://localhost` 等来源，否则 axios 会被 CORS 拦截。
因此推荐走 `.env.android` 本地配置。

#### 7.3 文件上传（你们 DreamMutualAid/上传场景）
你们通过 `FormData` 上传文件到 `/common/upload`，Capacitor WebView 通常可正常工作。
如果要调用相机/相册，需要 Android 运行时权限；Capacitor 一般会弹系统选择器。
如遇到“选择文件无反应”，再考虑引入 Capacitor Camera 插件或做原生侧 WebChromeClient 适配。

### 8) 网络/权限/HTTPS 配置（安卓侧）
一般至少需要：
- `android.permission.INTERNET`（Capacitor 默认会有）

如果你的 API 是 http 明文（不走 https）：
- 在 `android/app/src/main/AndroidManifest.xml` 的 `application` 节点增加：
  - `android:usesCleartextTraffic="true"`
- 或配置 `network_security_config` 只放开特定域名（更安全）

### 9) 版本号与包名
在 Android Studio 中：
- `android/app/build.gradle`：
  - `versionCode`：每次发版必须递增
  - `versionName`：展示给用户的版本号（例如 1.0.3）
- 包名（applicationId）与 `cap init` 的 AppId 需要一致

### 10) 生成发布包（APK/AAB）
#### 10.1 生成 keystore
```bash
keytool -genkeypair -v -keystore minsheng-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias minsheng
```
把 keystore 放到安全位置（不要提交到仓库）。

#### 10.2 Gradle 配置签名
在 `android/app/build.gradle` 里配置 `signingConfigs.release`（建议读取环境变量/本地 properties）。

#### 10.3 打包
- AAB（上架 Google Play 推荐）：
  - Android Studio：Build > Generate Signed Bundle / APK > Android App Bundle
- APK（内测/分发常用）：
  - Android Studio：Build > Generate Signed Bundle / APK > APK

命令行方式（在 android 目录）：
```bash
./gradlew assembleRelease
./gradlew bundleRelease
```

### 11) 常见坑位清单（本项目高概率会遇到）
- API baseUrl 仍是 `/api`：App 内没有 dev 代理，必须改为绝对地址（用 `.env.android` 解决）。
- 远程 config CORS：App 内 origin 不同，axios 可能直接被 CORS 拦截（建议禁用远程 config）。
- 自动跳转域名逻辑导致“跳出 App”：建议在 App 环境禁用跳转（见 7.1）。
- 视频层级/圆角/弹窗遮挡（你们首页视频已遇到）：Android WebView 对 video 合成层有特殊处理，尽量避免弹窗内播放；必要时用遮罩兜底（你们目前就是这种思路）。

---

## 最小可执行命令（建议固化成脚本）
一次性初始化：
```bash
npm i @capacitor/core @capacitor/android
npm i -D @capacitor/cli
npx cap init "民生资产" "com.minsheng.assets" --web-dir dist
npx cap add android
```

每次打包调试：
```bash
vite build --mode android
npx cap sync android
npx cap open android
```


# Android APK 打包完整流程

## 前置条件

- Node.js 已安装
- Android Studio 已安装（路径：`C:\Program Files\Android\Android Studio`）
- 所有命令在项目根目录执行：`C:\Users\zhangsan\Desktop\项目\minsheng`

---

## 一、环境准备（仅首次需要）

### 1.1 安装项目依赖

```powershell
npm install
```

### 1.2 初始化 Capacitor Android 项目

如果 `android/` 目录不存在，执行：

```powershell
npx cap add android
```

> 当前项目已有 `android/` 目录，跳过此步。

### 1.3 配置 Gradle JDK 路径

编辑 `android/gradle.properties`，确保以下配置正确：

```properties
org.gradle.java.home=C:/Program Files/Android/Android Studio/jbr
```

---

## 二、生成签名密钥（仅首次需要）

```powershell
"C:\Program Files\Android\Android Studio\jbr\bin\keytool" -genkeypair -v -storetype PKCS12 -keystore "C:\Users\zhangsan\Desktop\项目\minsheng\android\app\minsheng.keystore" -alias minsheng -keyalg RSA -keysize 2048 -validity 10000 -storepass minsheng123 -keypass minsheng123 -dname "CN=zhangsan, OU=minsheng, O=minsheng, L=hongkang, ST=hongkang, C=cn"
```

参数说明：

- `-storetype PKCS12`：密钥库格式
- `-keystore`：密钥文件保存路径
- `-alias minsheng`：密钥别名
- `-keyalg RSA -keysize 2048`：加密算法和长度
- `-validity 10000`：有效期约 27 年
- `-storepass / -keypass`：密码均为 `minsheng123`
- `-dname`：证书持有者信息

生成文件：`android/app/minsheng.keystore`

> ⚠️ 此文件和密码务必妥善保管，丢失后无法用相同签名更新 App。

---

## 三、配置签名信息（仅首次需要）

编辑 `android/app/build.gradle`，在 `android {}` 块中添加：

```groovy
signingConfigs {
    release {
        storeFile file('minsheng.keystore')
        storePassword 'minsheng123'
        keyAlias 'minsheng'
        keyPassword 'minsheng123'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

---

## 四、打包流程（每次发版都需要执行）

### 4.1 构建前端项目

```powershell
npm run build
```

将 Vue 项目编译为生产版本，输出到 `dist/` 目录。

### 4.2 删除不需要打包到 App 的文件

```powershell
Remove-Item -Recurse -Force dist/ms
```

删除下载页相关文件（`download.html`、APK 安装包等），减小 App 体积。

### 4.3 同步 Web 资源到 Android 项目

```powershell
npx cap sync android
```

将 `dist/` 内容复制到 `android/app/src/main/assets/public/`，并更新插件配置。

### 4.4 打包 Debug 版（用于开发测试）

```powershell
cd android
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"; .\gradlew.bat assembleDebug
cd ..
```

输出文件：`android/app/build/outputs/apk/debug/app-debug.apk`

Debug 版特点：使用系统默认调试签名，支持 Chrome DevTools 远程调试，适合开发阶段测试。

### 4.5 打包 Release 版（用于正式分发）

```powershell
cd android
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"; .\gradlew.bat assembleRelease
cd ..
```

输出文件：`android/app/build/outputs/apk/release/民生资产-1.0.apk`

Release 版特点：使用自定义密钥签名，关闭调试功能，体积更小，可直接分发安装。

---

## 五、日常更新一键命令

### Debug 版一键打包

```powershell
npm run build; Remove-Item -Recurse -Force dist/ms; npx cap sync android; cd android; $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"; .\gradlew.bat assembleDebug; cd ..
```

### Release 版一键打包

```powershell
npm run build; Remove-Item -Recurse -Force dist/ms; npx cap sync android; cd android; $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"; .\gradlew.bat assembleRelease; cd ..
```

---

## 六、版本管理（自动）

版本号已配置为自动管理：

- **versionCode**（内部版本号）：每次打 Release 包时自动 +1，记录在 `android/app/version.properties`
- **versionName**（显示版本号）：自动读取 `package.json` 中的 `version` 字段

所以更新版本只需修改 `package.json`：

```json
{
  "version": "1.1.0"
}
```

打包后 APK 文件名会自动变为 `民生资产-1.1.0.apk`，`versionCode` 自动递增。

---

## 七、Debug 与 Release 对比

| 项目 | Debug 版         | Release 版         |
| ---- | ---------------- | ------------------ |
| 签名 | 系统默认调试签名 | 自定义密钥签名     |
| 调试 | 支持远程调试     | 关闭调试           |
| 用途 | 开发测试         | 正式分发           |
| 命令 | `assembleDebug`  | `assembleRelease`  |
| 输出 | `app-debug.apk`  | `民生资产-1.0.apk` |

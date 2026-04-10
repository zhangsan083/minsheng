# iOS 免签 Web Clip (.mobileconfig) 生成流程

## 什么是 .mobileconfig

`.mobileconfig` 是 Apple 的配置描述文件格式，可以在 iOS 设备上安装 Web Clip（网页快捷方式），效果类似原生 App 图标，点击后全屏打开指定网址，无需上架 App Store。

## 前置条件

- 项目已部署到可访问的 HTTPS 域名
- 项目根目录有 logo 图片：`public/logo主图形.png`
- PowerShell 环境（Windows 自带）

## 完整流程

### 第一步：创建 mobileconfig 模板文件

在 `public/ms/` 目录下创建 `minsheng.mobileconfig`，内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>Icon</key>
            <data></data>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>民生资产</string>
            <key>PayloadDescription</key>
            <string>在主屏幕添加民生资产快捷方式</string>
            <key>PayloadDisplayName</key>
            <string>民生资产</string>
            <key>PayloadIdentifier</key>
            <string>com.minsheng.app.webclip</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>A1B2C3D4-E5F6-7890-ABCD-EF1234567890</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>https://你的域名.com</string>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>安装民生资产到您的主屏幕</string>
    <key>PayloadDisplayName</key>
    <string>民生资产</string>
    <key>PayloadIdentifier</key>
    <string>com.minsheng.app.profile</string>
    <key>PayloadOrganization</key>
    <string>民生资产</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>B2C3D4E5-F6A7-8901-BCDE-F12345678901</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>ConsentText</key>
    <dict>
        <key>default</key>
        <string>此描述文件将在您的主屏幕上添加民生资产快捷方式图标，点击即可直接访问。</string>
    </dict>
</dict>
</plist>
```

关键字段说明：

- `URL`：点击图标后打开的网址，**必须改成你的实际生产域名**
- `Label`：桌面图标下方显示的名称
- `Icon` > `<data></data>`：图标的 Base64 编码，下一步填入
- `FullScreen`：`true` 表示全屏打开，隐藏 Safari 地址栏
- `Precomposed`：`true` 表示不让 iOS 自动添加圆角高光效果
- `IsRemovable`：`true` 表示用户可以删除
- `PayloadUUID`：唯一标识符，每个 payload 需要不同的值

---

### 第二步：修改 URL 为实际域名

打开 `public/ms/minsheng.mobileconfig`，找到：

```xml
<key>URL</key>
<string>https://你的域名.com</string>
```

替换为你的实际生产域名，例如：

```xml
<key>URL</key>
<string>https://www.minsheng-example.com</string>
```

---

### 第三步：将 logo 图标嵌入 mobileconfig

在项目根目录执行以下 PowerShell 命令：

```powershell
$iconBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("public/logo主图形.png"))
$template = Get-Content "public/ms/minsheng.mobileconfig" -Raw
$template = $template -replace '<data></data>', "<data>`n$iconBase64`n</data>"
[System.IO.File]::WriteAllText("public/ms/minsheng.mobileconfig", $template, [System.Text.Encoding]::UTF8)
Write-Host "Done. File size: $((Get-Item 'public/ms/minsheng.mobileconfig').Length) bytes"
```

命令逐行说明：

1. 读取 `public/logo主图形.png` 文件，转换为 Base64 字符串
2. 读取 mobileconfig 模板文件的完整内容
3. 将模板中空的 `<data></data>` 替换为包含 Base64 图标数据的 `<data>...</data>`
4. 将替换后的内容写回文件（UTF-8 编码）

---

### 第四步：验证文件

执行完成后，打开 `public/ms/minsheng.mobileconfig`，确认：

- `<data>` 标签内有大量 Base64 编码内容（不再是空的）
- `<string>` 标签内的 URL 是你的实际域名

---

## 更换域名时的操作

如果域名变更，只需要修改 mobileconfig 中的 URL 字段，不需要重新生成图标。

直接编辑 `public/ms/minsheng.mobileconfig`，搜索替换旧域名为新域名即可。

---

## 更换图标时的操作

如果需要更换桌面图标：

1. 替换 `public/logo主图形.png` 为新图标（建议 180x180 像素的 PNG）
2. 先将 mobileconfig 中的图标数据清空，恢复为 `<data></data>`
3. 重新执行第三步的 PowerShell 命令

---

## iOS 用户安装流程

1. 用 **Safari** 浏览器打开下载页（其他浏览器不支持安装描述文件）
2. 点击"安全下载"按钮
3. 系统弹出提示"此网站正尝试下载一个配置描述文件" → 点击"允许"
4. 打开 **设置** → 顶部出现"已下载的描述文件" → 点击进入
5. 点击右上角"安装" → 输入锁屏密码 → 确认安装
6. 返回桌面，出现"民生资产"图标，点击即可全屏访问网站

> 注意：必须使用 Safari 浏览器打开下载页，微信/QQ 内置浏览器无法安装描述文件。

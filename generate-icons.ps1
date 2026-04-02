# 定义变量
$logoPath = "C:\Users\zhangsan\Desktop\项目\minsheng\public\logo主图形.png"
$outputDir = "C:\Users\zhangsan\Desktop\项目\minsheng\android\app\src\main\res"

# 确保输出目录存在
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# 定义图标密度和尺寸
$iconDensities = @(
    @{ Name = "mdpi"; Size = 48 }
    @{ Name = "hdpi"; Size = 72 }
    @{ Name = "xhdpi"; Size = 96 }
    @{ Name = "xxhdpi"; Size = 144 }
    @{ Name = "xxxhdpi"; Size = 192 }
)

# 定义启动图密度
$splashDensities = @(
    "mdpi"
    "hdpi"
    "xhdpi"
    "xxhdpi"
    "xxxhdpi"
)

# 加载System.Drawing命名空间
Add-Type -AssemblyName System.Drawing

# 处理图标
foreach ($density in $iconDensities) {
    $densityName = $density.Name
    $size = $density.Size
    
    # 创建输出目录
    $mipmapDir = "$outputDir\mipmap-$densityName"
    if (-not (Test-Path $mipmapDir)) {
        New-Item -ItemType Directory -Path $mipmapDir -Force
    }
    
    # 读取原始logo
    $originalImage = [System.Drawing.Image]::FromFile($logoPath)
    
    # 创建新的图标
    $newImage = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    
    # 设置高质量渲染
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # 计算缩放比例和位置
    $scale = [Math]::Min($size / $originalImage.Width, $size / $originalImage.Height)
    $newWidth = [int]($originalImage.Width * $scale)
    $newHeight = [int]($originalImage.Height * $scale)
    $x = ($size - $newWidth) / 2
    $y = ($size - $newHeight) / 2
    
    # 绘制图标
    $graphics.DrawImage($originalImage, $x, $y, $newWidth, $newHeight)
    
    # 保存图标
    $iconPath = "$mipmapDir\ic_launcher.png"
    $newImage.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # 保存圆形图标
    $roundIconPath = "$mipmapDir\ic_launcher_round.png"
    $newImage.Save($roundIconPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # 保存前景图标
    $foregroundIconPath = "$mipmapDir\ic_launcher_foreground.png"
    $newImage.Save($foregroundIconPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # 释放资源
    $graphics.Dispose()
    $newImage.Dispose()
    $originalImage.Dispose()
    
    Write-Host "Generated icons for $densityName density"
}

# 处理启动图
foreach ($density in $splashDensities) {
    # 创建竖屏启动图目录
    $portraitDir = "$outputDir\drawable-port-$density"
    if (-not (Test-Path $portraitDir)) {
        New-Item -ItemType Directory -Path $portraitDir -Force
    }
    
    # 创建横屏启动图目录
    $landscapeDir = "$outputDir\drawable-land-$density"
    if (-not (Test-Path $landscapeDir)) {
        New-Item -ItemType Directory -Path $landscapeDir -Force
    }
    
    # 读取原始logo
    $originalImage = [System.Drawing.Image]::FromFile($logoPath)
    
    # 为竖屏创建启动图 (1080x1920 比例)
    $portraitWidth = 720
    $portraitHeight = 1280
    
    if ($density -eq "mdpi") {
        $portraitWidth = 360
        $portraitHeight = 640
    } elseif ($density -eq "hdpi") {
        $portraitWidth = 540
        $portraitHeight = 960
    } elseif ($density -eq "xhdpi") {
        $portraitWidth = 720
        $portraitHeight = 1280
    } elseif ($density -eq "xxhdpi") {
        $portraitWidth = 1080
        $portraitHeight = 1920
    } elseif ($density -eq "xxxhdpi") {
        $portraitWidth = 1440
        $portraitHeight = 2560
    }
    
    $portraitImage = New-Object System.Drawing.Bitmap($portraitWidth, $portraitHeight)
    $portraitGraphics = [System.Drawing.Graphics]::FromImage($portraitImage)
    
    # 设置背景为白色
    $portraitGraphics.Clear([System.Drawing.Color]::White)
    
    # 设置高质量渲染
    $portraitGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $portraitGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $portraitGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # 计算缩放比例和位置
    $portraitScale = [Math]::Min($portraitWidth * 0.7 / $originalImage.Width, $portraitHeight * 0.7 / $originalImage.Height)
    $portraitNewWidth = [int]($originalImage.Width * $portraitScale)
    $portraitNewHeight = [int]($originalImage.Height * $portraitScale)
    $portraitX = ($portraitWidth - $portraitNewWidth) / 2
    $portraitY = ($portraitHeight - $portraitNewHeight) / 2
    
    # 绘制启动图
    $portraitGraphics.DrawImage($originalImage, $portraitX, $portraitY, $portraitNewWidth, $portraitNewHeight)
    
    # 保存竖屏启动图
    $portraitPath = "$portraitDir\splash.png"
    $portraitImage.Save($portraitPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # 为横屏创建启动图 (1920x1080 比例)
    $landscapeWidth = 1280
    $landscapeHeight = 720
    
    if ($density -eq "mdpi") {
        $landscapeWidth = 640
        $landscapeHeight = 360
    } elseif ($density -eq "hdpi") {
        $landscapeWidth = 960
        $landscapeHeight = 540
    } elseif ($density -eq "xhdpi") {
        $landscapeWidth = 1280
        $landscapeHeight = 720
    } elseif ($density -eq "xxhdpi") {
        $landscapeWidth = 1920
        $landscapeHeight = 1080
    } elseif ($density -eq "xxxhdpi") {
        $landscapeWidth = 2560
        $landscapeHeight = 1440
    }
    
    $landscapeImage = New-Object System.Drawing.Bitmap($landscapeWidth, $landscapeHeight)
    $landscapeGraphics = [System.Drawing.Graphics]::FromImage($landscapeImage)
    
    # 设置背景为白色
    $landscapeGraphics.Clear([System.Drawing.Color]::White)
    
    # 设置高质量渲染
    $landscapeGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $landscapeGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $landscapeGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # 计算缩放比例和位置
    $landscapeScale = [Math]::Min($landscapeWidth * 0.7 / $originalImage.Width, $landscapeHeight * 0.7 / $originalImage.Height)
    $landscapeNewWidth = [int]($originalImage.Width * $landscapeScale)
    $landscapeNewHeight = [int]($originalImage.Height * $landscapeScale)
    $landscapeX = ($landscapeWidth - $landscapeNewWidth) / 2
    $landscapeY = ($landscapeHeight - $landscapeNewHeight) / 2
    
    # 绘制启动图
    $landscapeGraphics.DrawImage($originalImage, $landscapeX, $landscapeY, $landscapeNewWidth, $landscapeNewHeight)
    
    # 保存横屏启动图
    $landscapePath = "$landscapeDir\splash.png"
    $landscapeImage.Save($landscapePath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # 释放资源
    $portraitGraphics.Dispose()
    $portraitImage.Dispose()
    $landscapeGraphics.Dispose()
    $landscapeImage.Dispose()
    $originalImage.Dispose()
    
    Write-Host "Generated splash screens for $density density"
}

# 生成默认drawable目录下的splash.png
$defaultSplashDir = "$outputDir\drawable"
if (-not (Test-Path $defaultSplashDir)) {
    New-Item -ItemType Directory -Path $defaultSplashDir -Force
}

# 读取原始logo
$originalImage = [System.Drawing.Image]::FromFile($logoPath)

# 创建默认启动图
$defaultWidth = 720
$defaultHeight = 1280
$defaultImage = New-Object System.Drawing.Bitmap($defaultWidth, $defaultHeight)
$defaultGraphics = [System.Drawing.Graphics]::FromImage($defaultImage)

# 设置背景为白色
$defaultGraphics.Clear([System.Drawing.Color]::White)

# 设置高质量渲染
$defaultGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$defaultGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$defaultGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# 计算缩放比例和位置
$defaultScale = [Math]::Min($defaultWidth * 0.7 / $originalImage.Width, $defaultHeight * 0.7 / $originalImage.Height)
$defaultNewWidth = [int]($originalImage.Width * $defaultScale)
$defaultNewHeight = [int]($originalImage.Height * $defaultScale)
$defaultX = ($defaultWidth - $defaultNewWidth) / 2
$defaultY = ($defaultHeight - $defaultNewHeight) / 2

# 绘制启动图
$defaultGraphics.DrawImage($originalImage, $defaultX, $defaultY, $defaultNewWidth, $defaultNewHeight)

# 保存默认启动图
$defaultPath = "$defaultSplashDir\splash.png"
$defaultImage.Save($defaultPath, [System.Drawing.Imaging.ImageFormat]::Png)

# 释放资源
$defaultGraphics.Dispose()
$defaultImage.Dispose()
$originalImage.Dispose()

Write-Host "Generated default splash screen"
Write-Host "All icons and splash screens have been generated successfully!"
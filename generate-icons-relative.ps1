# 定义变量（使用相对路径）
$logoPath = ".\public\logo主图形.png"
$outputDir = ".\android\app\src\main\res"

# 确保输出目录存在
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# 创建mipmap-hdpi目录
$mipmapDir = "$outputDir\mipmap-hdpi"
if (-not (Test-Path $mipmapDir)) {
    New-Item -ItemType Directory -Path $mipmapDir -Force
}

# 加载System.Drawing命名空间
Add-Type -AssemblyName System.Drawing

# 读取原始logo
try {
    $originalImage = [System.Drawing.Image]::FromFile($logoPath)
    
    # 创建新的图标
    $size = 72
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
    
    Write-Host "Generated icons for hdpi density"
    Write-Host "All icons have been generated successfully!"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Stack trace: $($_.Exception.StackTrace)"
}
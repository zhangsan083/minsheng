from PIL import Image
import os
import math

# 定义变量
logo_path = "C:\\Users\\zhangsan\\Desktop\\项目\\minsheng\\public\\logo主图形.png"
output_dir = "C:\\Users\\zhangsan\\Desktop\\项目\\minsheng\\android\\app\\src\\main\\res"

# 确保输出目录存在
os.makedirs(output_dir, exist_ok=True)

# 定义图标密度和尺寸
icon_densities = [
    {"name": "mdpi", "size": 48},
    {"name": "hdpi", "size": 72},
    {"name": "xhdpi", "size": 96},
    {"name": "xxhdpi", "size": 144},
    {"name": "xxxhdpi", "size": 192}
]

# 定义启动图密度
splash_densities = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"]

# 读取原始logo
original_image = Image.open(logo_path)

# 处理图标
for density in icon_densities:
    density_name = density["name"]
    size = density["size"]
    
    # 创建输出目录
    mipmap_dir = os.path.join(output_dir, f"mipmap-{density_name}")
    os.makedirs(mipmap_dir, exist_ok=True)
    
    # 创建新的图标
    new_image = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    
    # 计算缩放比例和位置
    scale = min(size / original_image.width, size / original_image.height)
    new_width = int(original_image.width * scale)
    new_height = int(original_image.height * scale)
    x = (size - new_width) // 2
    y = (size - new_height) // 2
    
    # 调整图片大小
    resized_image = original_image.resize((new_width, new_height), Image.LANCZOS)
    
    # 粘贴到新图标
    new_image.paste(resized_image, (x, y), resized_image if resized_image.mode == "RGBA" else None)
    
    # 保存图标
    icon_path = os.path.join(mipmap_dir, "ic_launcher.png")
    new_image.save(icon_path, "PNG")
    
    # 保存圆形图标
    round_icon_path = os.path.join(mipmap_dir, "ic_launcher_round.png")
    new_image.save(round_icon_path, "PNG")
    
    # 保存前景图标
    foreground_icon_path = os.path.join(mipmap_dir, "ic_launcher_foreground.png")
    new_image.save(foreground_icon_path, "PNG")
    
    print(f"Generated icons for {density_name} density")

# 处理启动图
for density in splash_densities:
    # 创建竖屏启动图目录
    portrait_dir = os.path.join(output_dir, f"drawable-port-{density}")
    os.makedirs(portrait_dir, exist_ok=True)
    
    # 创建横屏启动图目录
    landscape_dir = os.path.join(output_dir, f"drawable-land-{density}")
    os.makedirs(landscape_dir, exist_ok=True)
    
    # 为竖屏创建启动图 (1080x1920 比例)
    if density == "mdpi":
        portrait_width, portrait_height = 360, 640
    elif density == "hdpi":
        portrait_width, portrait_height = 540, 960
    elif density == "xhdpi":
        portrait_width, portrait_height = 720, 1280
    elif density == "xxhdpi":
        portrait_width, portrait_height = 1080, 1920
    elif density == "xxxhdpi":
        portrait_width, portrait_height = 1440, 2560
    
    # 创建竖屏启动图
    portrait_image = Image.new("RGB", (portrait_width, portrait_height), (255, 255, 255))
    
    # 计算缩放比例和位置
    portrait_scale = min(portrait_width * 0.7 / original_image.width, portrait_height * 0.7 / original_image.height)
    portrait_new_width = int(original_image.width * portrait_scale)
    portrait_new_height = int(original_image.height * portrait_scale)
    portrait_x = (portrait_width - portrait_new_width) // 2
    portrait_y = (portrait_height - portrait_new_height) // 2
    
    # 调整图片大小
    portrait_resized = original_image.resize((portrait_new_width, portrait_new_height), Image.LANCZOS)
    
    # 粘贴到启动图
    portrait_image.paste(portrait_resized, (portrait_x, portrait_y))
    
    # 保存竖屏启动图
    portrait_path = os.path.join(portrait_dir, "splash.png")
    portrait_image.save(portrait_path, "PNG")
    
    # 为横屏创建启动图 (1920x1080 比例)
    if density == "mdpi":
        landscape_width, landscape_height = 640, 360
    elif density == "hdpi":
        landscape_width, landscape_height = 960, 540
    elif density == "xhdpi":
        landscape_width, landscape_height = 1280, 720
    elif density == "xxhdpi":
        landscape_width, landscape_height = 1920, 1080
    elif density == "xxxhdpi":
        landscape_width, landscape_height = 2560, 1440
    
    # 创建横屏启动图
    landscape_image = Image.new("RGB", (landscape_width, landscape_height), (255, 255, 255))
    
    # 计算缩放比例和位置
    landscape_scale = min(landscape_width * 0.7 / original_image.width, landscape_height * 0.7 / original_image.height)
    landscape_new_width = int(original_image.width * landscape_scale)
    landscape_new_height = int(original_image.height * landscape_scale)
    landscape_x = (landscape_width - landscape_new_width) // 2
    landscape_y = (landscape_height - landscape_new_height) // 2
    
    # 调整图片大小
    landscape_resized = original_image.resize((landscape_new_width, landscape_new_height), Image.LANCZOS)
    
    # 粘贴到启动图
    landscape_image.paste(landscape_resized, (landscape_x, landscape_y))
    
    # 保存横屏启动图
    landscape_path = os.path.join(landscape_dir, "splash.png")
    landscape_image.save(landscape_path, "PNG")
    
    print(f"Generated splash screens for {density} density")

# 生成默认drawable目录下的splash.png
default_splash_dir = os.path.join(output_dir, "drawable")
os.makedirs(default_splash_dir, exist_ok=True)

# 创建默认启动图
default_width, default_height = 720, 1280
default_image = Image.new("RGB", (default_width, default_height), (255, 255, 255))

# 计算缩放比例和位置
default_scale = min(default_width * 0.7 / original_image.width, default_height * 0.7 / original_image.height)
default_new_width = int(original_image.width * default_scale)
default_new_height = int(original_image.height * default_scale)
default_x = (default_width - default_new_width) // 2
default_y = (default_height - default_new_height) // 2

# 调整图片大小
default_resized = original_image.resize((default_new_width, default_new_height), Image.LANCZOS)

# 粘贴到启动图
default_image.paste(default_resized, (default_x, default_y))

# 保存默认启动图
default_path = os.path.join(default_splash_dir, "splash.png")
default_image.save(default_path, "PNG")

# 关闭原始图片
original_image.close()

print("Generated default splash screen")
print("All icons and splash screens have been generated successfully!")
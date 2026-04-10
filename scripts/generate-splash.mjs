/**
 * 生成 Android 启动页图片
 * 白色背景 + 居中 logo + 底部"民生资产"文字
 */
import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const logoPath = resolve(projectRoot, 'public/logo主图形.png')
const resDir = resolve(projectRoot, 'android/app/src/main/res')

// 竖屏和横屏的各密度尺寸
const sizes = {
  'drawable':              { w: 480,  h: 800 },
  'drawable-port-mdpi':    { w: 480,  h: 800 },
  'drawable-port-hdpi':    { w: 720,  h: 1280 },
  'drawable-port-xhdpi':   { w: 1080, h: 1920 },
  'drawable-port-xxhdpi':  { w: 1440, h: 2560 },
  'drawable-port-xxxhdpi': { w: 1440, h: 2560 },
  'drawable-land-mdpi':    { w: 800,  h: 480 },
  'drawable-land-hdpi':    { w: 1280, h: 720 },
  'drawable-land-xhdpi':   { w: 1920, h: 1080 },
  'drawable-land-xxhdpi':  { w: 2560, h: 1440 },
  'drawable-land-xxxhdpi': { w: 2560, h: 1440 },
}

async function generateSplash(folder, width, height) {
  const logoSize = Math.min(width, height) * 0.25
  const logoResized = await sharp(logoPath)
    .resize(Math.round(logoSize), Math.round(logoSize), { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer()

  // 创建白色背景，logo 居中偏上
  const logoTop = Math.round(height * 0.3)
  const logoLeft = Math.round((width - logoSize) / 2)

  // 生成"民生资产"文字 SVG
  const fontSize = Math.round(Math.min(width, height) * 0.06)
  const textTop = Math.round(logoTop + logoSize + height * 0.05)
  const textSvg = Buffer.from(`
    <svg width="${width}" height="${Math.round(fontSize * 1.5)}">
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="#0b3d91"
        letter-spacing="${Math.round(fontSize * 0.3)}">民生资产</text>
    </svg>
  `)

  const output = resolve(resDir, folder, 'splash.png')

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 255 }
    }
  })
    .composite([
      { input: logoResized, top: logoTop, left: logoLeft },
      { input: textSvg, top: textTop, left: 0 }
    ])
    .png()
    .toFile(output)

  console.log(`✅ ${output} (${width}x${height})`)
}

async function main() {
  console.log('生成启动页图片...\n')
  for (const [folder, { w, h }] of Object.entries(sizes)) {
    await generateSplash(folder, w, h)
  }
  console.log('\n🎉 所有启动页图片生成完成！')
}

main().catch(console.error)

/**
 * 生成 Android 应用图标
 * 使用 public/logo主图形.png 作为源图，生成各分辨率的 ic_launcher.png、ic_launcher_round.png 和 ic_launcher_foreground.png
 */
import sharp from 'sharp'
import { mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const sourceIcon = resolve(projectRoot, 'public/logo主图形.png')
const resDir = resolve(projectRoot, 'android/app/src/main/res')

// Android 各密度对应的图标尺寸
const sizes = {
  'mipmap-mdpi':    { launcher: 48, foreground: 108 },
  'mipmap-hdpi':    { launcher: 72, foreground: 162 },
  'mipmap-xhdpi':   { launcher: 96, foreground: 216 },
  'mipmap-xxhdpi':  { launcher: 144, foreground: 324 },
  'mipmap-xxxhdpi': { launcher: 192, foreground: 432 },
}

async function generateIcon(inputPath, outputPath, size) {
  const dir = dirname(outputPath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  await sharp(inputPath)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(outputPath)
  console.log(`✅ ${outputPath} (${size}x${size})`)
}

async function generateRoundIcon(inputPath, outputPath, size) {
  const dir = dirname(outputPath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  // 创建圆形蒙版
  const roundedMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`
  )
  const resized = await sharp(inputPath)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer()
  await sharp(resized)
    .composite([{ input: roundedMask, blend: 'dest-in' }])
    .png()
    .toFile(outputPath)
  console.log(`✅ ${outputPath} (${size}x${size} round)`)
}

async function main() {
  console.log(`源图标: ${sourceIcon}\n`)

  for (const [folder, { launcher, foreground }] of Object.entries(sizes)) {
    const base = resolve(resDir, folder)
    // ic_launcher.png
    await generateIcon(sourceIcon, resolve(base, 'ic_launcher.png'), launcher)
    // ic_launcher_round.png
    await generateRoundIcon(sourceIcon, resolve(base, 'ic_launcher_round.png'), launcher)
    // ic_launcher_foreground.png (自适应图标前景层，尺寸更大)
    await generateIcon(sourceIcon, resolve(base, 'ic_launcher_foreground.png'), foreground)
  }

  console.log('\n🎉 所有图标生成完成！')
}

main().catch(console.error)

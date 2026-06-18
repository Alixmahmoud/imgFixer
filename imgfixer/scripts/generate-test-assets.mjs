import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const OUT = path.resolve("tests/fixtures/generated")

if (!fs.existsSync(OUT)) {
  fs.mkdirSync(OUT, { recursive: true })
}

function labelSvg(text, width, height) {
  return Buffer.from(
    `<svg width="${width}" height="${height}">
      <style>
        text { fill: white; font-family: Arial, sans-serif; font-size: ${Math.max(20, Math.round(height / 8))}px; font-weight: bold; }
      </style>
      <rect width="100%" height="100%" fill="#333" rx="8"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">${text}</text>
    </svg>`
  )
}

function noisyGradientBuffer(width, height, noiseAmp = 40) {
  const rgba = Buffer.alloc(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const baseR = (x / width) * 255
      const baseG = (y / height) * 255
      const baseB = 128 + 64 * Math.sin(x * 0.01 + y * 0.01)
      const n1 = Math.sin(x * 0.5 + y * 0.3) * noiseAmp
      const n2 = Math.cos(x * 0.7 - y * 0.4) * noiseAmp * 0.6
      const n3 = Math.sin(x * 1.1 + y * 0.9) * noiseAmp * 0.3
      rgba[idx] = Math.max(0, Math.min(255, Math.round(baseR + n1)))
      rgba[idx + 1] = Math.max(0, Math.min(255, Math.round(baseG + n2)))
      rgba[idx + 2] = Math.max(0, Math.min(255, Math.round(baseB + n3)))
      rgba[idx + 3] = 255
    }
  }
  return rgba
}

function simpleGradientBuffer(width, height) {
  const rgba = Buffer.alloc(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      rgba[idx] = Math.round((x / width) * 255)
      rgba[idx + 1] = Math.round((y / height) * 255)
      rgba[idx + 2] = Math.round(128 + 64 * Math.sin(x * 0.01 + y * 0.01))
      rgba[idx + 3] = 255
    }
  }
  return rgba
}

let totalSize = 0

async function generate() {
  // 1. photo-large.jpg — large detailed image, >2 MB
  // Use 3000x2000 with strong noise so JPEG can't compress smoothly
  console.log("Generating photo-large.jpg ...")
  const largeRaw = noisyGradientBuffer(3000, 2000, 60)
  await sharp(largeRaw, { raw: { width: 3000, height: 2000, channels: 4 } })
    .jpeg({ quality: 95 })
    .toFile(path.join(OUT, "photo-large.jpg"))

  // 2. photo-medium.jpg — medium-sized JPG
  console.log("Generating photo-medium.jpg ...")
  const medRaw = noisyGradientBuffer(1200, 800, 40)
  await sharp(medRaw, { raw: { width: 1200, height: 800, channels: 4 } })
    .jpeg({ quality: 80 })
    .toFile(path.join(OUT, "photo-medium.jpg"))

  // 3. photo-small-under-100kb.jpg — very small file (under 100 KB)
  console.log("Generating photo-small-under-100kb.jpg ...")
  const smallRaw = noisyGradientBuffer(400, 300, 20)
  await sharp(smallRaw, { raw: { width: 400, height: 300, channels: 4 } })
    .jpeg({ quality: 30 })
    .toFile(path.join(OUT, "photo-small-under-100kb.jpg"))

  // 4. transparent-logo.png — PNG with alpha transparency
  console.log("Generating transparent-logo.png ...")
  const logoSize = 500
  const logoRaw = Buffer.alloc(logoSize * logoSize * 4)
  for (let y = 0; y < logoSize; y++) {
    for (let x = 0; x < logoSize; x++) {
      const idx = (y * logoSize + x) * 4
      const cx = logoSize / 2, cy = logoSize / 2, r = logoSize * 0.4
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      if (dist < r) {
        const angle = Math.atan2(y - cy, x - cx)
        logoRaw[idx] = Math.round(128 + 127 * Math.sin(angle))
        logoRaw[idx + 1] = Math.round(128 + 127 * Math.cos(angle))
        logoRaw[idx + 2] = 200
        logoRaw[idx + 3] = dist < r * 0.5 ? 255 : Math.round(150 + 105 * ((r - dist) / (r * 0.5)))
      } else {
        logoRaw[idx] = 0; logoRaw[idx + 1] = 0; logoRaw[idx + 2] = 0; logoRaw[idx + 3] = 0
      }
    }
  }
  await sharp(logoRaw, { raw: { width: logoSize, height: logoSize, channels: 4 } })
    .png()
    .toFile(path.join(OUT, "transparent-logo.png"))

  // 5. screenshot-text.png — PNG with text/graphics-like content overlay
  console.log("Generating screenshot-text.png ...")
  const ssRaw = noisyGradientBuffer(1000, 700, 30)
  const ssSvg = `<svg width="1000" height="700">
    <rect x="50" y="50" width="900" height="100" rx="8" fill="rgba(255,255,255,0.2)"/>
    <rect x="50" y="200" width="600" height="40" rx="4" fill="rgba(255,255,255,0.15)"/>
    <rect x="50" y="260" width="750" height="40" rx="4" fill="rgba(255,255,255,0.15)"/>
    <rect x="50" y="320" width="500" height="40" rx="4" fill="rgba(255,255,255,0.15)"/>
    <rect x="50" y="400" width="300" height="200" rx="8" fill="rgba(255,255,255,0.1)"/>
    <rect x="400" y="400" width="550" height="200" rx="8" fill="rgba(255,255,255,0.1)"/>
    <line x1="430" y1="440" x2="920" y2="440" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <line x1="430" y1="470" x2="850" y2="470" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <line x1="430" y1="500" x2="900" y2="500" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <text x="100" y="420" fill="rgba(255,255,255,0.5)" font-family="monospace" font-size="14">Chart area</text>
  </svg>`
  await sharp(ssRaw, { raw: { width: 1000, height: 700, channels: 4 } })
    .composite([{ input: Buffer.from(ssSvg), top: 0, left: 0 }])
    .png()
    .toFile(path.join(OUT, "screenshot-text.png"))

  // 6. photo.webp — WebP image
  console.log("Generating photo.webp ...")
  const webpRaw = noisyGradientBuffer(800, 600, 35)
  await sharp(webpRaw, { raw: { width: 800, height: 600, channels: 4 } })
    .webp({ quality: 75 })
    .toFile(path.join(OUT, "photo.webp"))

  // 7. large-dimension.jpg — dimension > 6000px on one side
  // 6400 wide ensures both resize (MAX_DIMENSION=6000) and EXIF rejection tests work
  console.log("Generating large-dimension.jpg ...")
  const largeDimRaw = simpleGradientBuffer(6400, 100)
  const dimSvg = labelSvg("6400px WIDE", 6400, 100)
  await sharp(largeDimRaw, { raw: { width: 6400, height: 100, channels: 4 } })
    .composite([{ input: dimSvg, top: 0, left: 0 }])
    .jpeg({ quality: 85 })
    .toFile(path.join(OUT, "large-dimension.jpg"))

  // 8. wrong-file.txt
  console.log("Generating wrong-file.txt ...")
  fs.writeFileSync(path.join(OUT, "wrong-file.txt"), "This file is deliberately not an image. Used to test unsupported file rejection.")

  // 9. Multi-page images with distinct labels for PDF ordering test
  const pageDefs = [
    { name: "multi-page-1.jpg", label: "PAGE 1", w: 800, h: 600 },
    { name: "multi-page-2.jpg", label: "PAGE 2", w: 800, h: 600 },
    { name: "multi-page-3.jpg", label: "PAGE 3", w: 800, h: 600 },
  ]
  for (const p of pageDefs) {
    console.log(`Generating ${p.name} ...`)
    const raw = noisyGradientBuffer(p.w, p.h, 30)
    const svg = labelSvg(p.label, p.w, p.h)
    await sharp(raw, { raw: { width: p.w, height: p.h, channels: 4 } })
      .composite([{ input: svg, top: 0, left: 0 }])
      .jpeg({ quality: 85 })
      .toFile(path.join(OUT, p.name))
  }

  // Report sizes
  const files = fs.readdirSync(OUT).filter(f => !f.endsWith(".md"))
  console.log("\nGenerated assets:")
  for (const f of files.sort()) {
    const stat = fs.statSync(path.join(OUT, f))
    const sizeKB = (stat.size / 1024).toFixed(1)
    totalSize += stat.size
    console.log(`  ${f.padEnd(35)} ${sizeKB.padStart(8)} KB`)
  }
  console.log(`\nTotal: ${(totalSize / (1024 * 1024)).toFixed(2)} MB across ${files.length} files`)
}

generate().catch((err) => {
  console.error("Asset generation failed:", err)
  process.exit(1)
})

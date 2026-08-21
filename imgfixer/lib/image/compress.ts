import imageCompression from "browser-image-compression"

export async function compressImage(
  file: File,
  quality: number
): Promise<File> {
  const originalSizeMB = file.size / (1024 * 1024)
  const targetSizeMB = Math.max(
    0.05,
    Math.min(20, originalSizeMB * Math.max(0.3, quality) * 0.9)
  )

  const options = {
    maxSizeMB: targetSizeMB,
    maxWidthOrHeight: 10000,
    useWebWorker: true,
    initialQuality: quality,
    fileType: file.type === "image/png" ? "image/jpeg" : undefined,
  }

  return imageCompression(file, options)
}

export interface TargetSizeResult {
  file: File
  originalSize: number
  compressedSize: number
  targetSize: number
  finalQuality: number
  finalMaxDimension: number | undefined
  isUnderTarget: boolean
  wasAlreadyUnderTarget: boolean
  formatChanged: boolean
  originalFormat: string
  hasTransparency: boolean
  warning: string | undefined
}

function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image dimensions"))
    }
    img.src = url
  })
}

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg"
    case "image/png":
      return "png"
    case "image/webp":
      return "webp"
    default:
      return "jpg"
  }
}

async function tryFormat(
  file: File,
  targetBytes: number,
  targetMB: number,
  startDimension: number,
  outputType: string,
  outputName: string
): Promise<{
  success: boolean
  file: File | null
  quality: number
  maxDimension: number
}> {
  let bestFile: File | null = null
  let bestSize = Infinity
  let bestQuality = 1
  let bestMaxDimension = startDimension

  const attempt = async (q: number, dim: number): Promise<File | null> => {
    try {
      const opts: Record<string, unknown> = {
        maxSizeMB: targetMB,
        maxWidthOrHeight: dim,
        useWebWorker: true,
        initialQuality: q,
      }
      if (outputType !== file.type) {
        opts.fileType = outputType
      }
      const raw = await imageCompression(file, opts)
      const result = new File([raw], outputName, { type: outputType })

      if (result.size <= targetBytes) return result

      if (result.size < bestSize) {
        bestFile = result
        bestSize = result.size
        bestQuality = q
        bestMaxDimension = dim
      }
    } catch {
      // skip failed attempt
    }
    return null
  }

  let hit: File | null

  // Phase 1 — quality reduction at original dimensions
  for (const q of [0.85, 0.7, 0.55, 0.4, 0.25, 0.1]) {
    hit = await attempt(q, startDimension)
    if (hit) {
      return {
        success: true,
        file: hit,
        quality: q,
        maxDimension: startDimension,
      }
    }
  }

  // Phase 2 — dimension reduction with quality cycling
  let dim = startDimension
  const qCycle = [0.8, 0.6, 0.4, 0.2, 0.1]
  while (dim > 400) {
    dim = Math.round(dim * 0.85)
    if (dim < 400) dim = 400

    for (const q of qCycle) {
      hit = await attempt(q, dim)
      if (hit) {
        return {
          success: true,
          file: hit,
          quality: q,
          maxDimension: dim,
        }
      }
    }
  }

  return {
    success: false,
    file: bestFile,
    quality: bestQuality,
    maxDimension: bestMaxDimension,
  }
}

export async function compressImageToTargetSize(
  file: File,
  targetSizeKB: number
): Promise<TargetSizeResult> {
  const targetBytes = targetSizeKB * 1024
  const targetMB = targetSizeKB / 1024

  if (file.size <= targetBytes) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      targetSize: targetBytes,
      finalQuality: 1,
      finalMaxDimension: undefined,
      isUnderTarget: true,
      wasAlreadyUnderTarget: true,
      formatChanged: false,
      originalFormat: file.type,
      hasTransparency: false,
      warning: undefined,
    }
  }

  let startDimension = 4000
  try {
    const dims = await getImageDimensions(file)
    startDimension = Math.max(dims.width, dims.height)
  } catch {
    // fall back to 4000 default
  }

  const originalType = file.type
  const originalExt = extFromMime(originalType)
  const baseName = file.name.replace(/\.[^.]+$/, "")
  const suffix =
    targetSizeKB >= 1024 ? `${targetSizeKB / 1024}mb` : `${targetSizeKB}kb`

  // ── Attempt 1: keep original format ──
  const origName = `${baseName}-compressed-${suffix}.${originalExt}`
  const orig = await tryFormat(
    file,
    targetBytes,
    targetMB,
    startDimension,
    originalType,
    origName
  )

  if (orig.success) {
    return {
      file: orig.file!,
      originalSize: file.size,
      compressedSize: orig.file!.size,
      targetSize: targetBytes,
      finalQuality: orig.quality,
      finalMaxDimension: undefined,
      isUnderTarget: true,
      wasAlreadyUnderTarget: false,
      formatChanged: false,
      originalFormat: originalType,
      hasTransparency: false,
      warning: undefined,
    }
  }

  // ── Attempt 2: convert to JPEG ──
  const jpgResumeDim =
    orig.file && orig.maxDimension ? orig.maxDimension : startDimension
  const jpgName = `${baseName}-compressed-${suffix}.jpg`
  const jpg = await tryFormat(
    file,
    targetBytes,
    targetMB,
    jpgResumeDim,
    "image/jpeg",
    jpgName
  )

  if (jpg.success) {
    return {
      file: jpg.file!,
      originalSize: file.size,
      compressedSize: jpg.file!.size,
      targetSize: targetBytes,
      finalQuality: jpg.quality,
      finalMaxDimension: jpg.maxDimension,
      isUnderTarget: true,
      wasAlreadyUnderTarget: false,
      formatChanged: originalType !== "image/jpeg",
      originalFormat: originalType,
      hasTransparency: originalType === "image/png",
      warning: undefined,
    }
  }

  // ── Best effort ──
  const jpgBetter = !!(
    jpg.file && (!orig.file || jpg.file.size < orig.file.size)
  )
  const best = jpgBetter ? jpg : orig
  const label =
    targetSizeKB >= 1024 ? `${targetSizeKB / 1024}MB` : `${targetSizeKB}KB`

  return {
    file: best.file!,
    originalSize: file.size,
    compressedSize: best.file!.size,
    targetSize: targetBytes,
    finalQuality: best.quality,
    finalMaxDimension: best.maxDimension,
    isUnderTarget: false,
    wasAlreadyUnderTarget: false,
    formatChanged: jpgBetter && originalType !== "image/jpeg",
    originalFormat: originalType,
    hasTransparency: jpgBetter && originalType === "image/png",
    warning: `We compressed the image as much as possible, but it could not reach ${label} without making it too small or too low quality.`,
  }
}

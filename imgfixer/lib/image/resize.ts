export interface ResizeOptions {
  width: number
  height: number
  outputFormat: "same" | "image/jpeg" | "image/png" | "image/webp"
  quality?: number
  resizeMode?: "fit" | "exact" | "crop"
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

export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<File> {
  const { width, height, outputFormat, quality = 0.92, resizeMode = "crop" } = options

  const mimeType = outputFormat === "same" ? file.type : outputFormat
  const ext = extFromMime(mimeType)
  const baseName = file.name.replace(/\.[^.]+$/, "")

  const url = URL.createObjectURL(file)

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () =>
        reject(new Error("Failed to load image for resizing"))
      image.src = url
    })

    const imgW = img.naturalWidth
    const imgH = img.naturalHeight

    let canvasW: number
    let canvasH: number
    let sx: number
    let sy: number
    let sw: number
    let sh: number

    if (resizeMode === "fit") {
      const ratio = Math.min(width / imgW, height / imgH)
      canvasW = Math.round(imgW * ratio)
      canvasH = Math.round(imgH * ratio)
      sx = 0
      sy = 0
      sw = imgW
      sh = imgH
    } else if (resizeMode === "crop") {
      canvasW = width
      canvasH = height
      const imgRatio = imgW / imgH
      const targetRatio = width / height
      if (imgRatio > targetRatio) {
        sh = imgH
        sw = Math.round(imgH * targetRatio)
        sx = Math.round((imgW - sw) / 2)
        sy = 0
      } else {
        sw = imgW
        sh = Math.round(imgW / targetRatio)
        sx = 0
        sy = Math.round((imgH - sh) / 2)
      }
    } else {
      canvasW = width
      canvasH = height
      sx = 0
      sy = 0
      sw = imgW
      sh = imgH
    }

    const outputName = `${baseName}-resized-${canvasW}x${canvasH}.${ext}`

    const canvas = document.createElement("canvas")
    canvas.width = canvasW
    canvas.height = canvasH

    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Could not get canvas context")

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b)
          else reject(new Error("Canvas export failed"))
        },
        mimeType,
        quality
      )
    })

    return new File([blob], outputName, { type: mimeType })
  } finally {
    URL.revokeObjectURL(url)
  }
}

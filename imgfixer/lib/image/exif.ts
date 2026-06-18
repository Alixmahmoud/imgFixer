export interface RemoveMetadataOptions {
  outputFormat: "same" | "image/jpeg" | "image/png" | "image/webp"
  quality?: number
}

export interface RemoveMetadataResult {
  file: File
  width: number
  height: number
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

export async function removeImageMetadata(
  file: File,
  options: RemoveMetadataOptions
): Promise<RemoveMetadataResult> {
  const outputMimeType =
    options.outputFormat === "same" ? file.type : options.outputFormat
  const quality = options.quality ?? 0.92

  const url = URL.createObjectURL(file)

  let img: HTMLImageElement
  try {
    img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error("Failed to decode the image"))
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }

  const width = img.naturalWidth
  const height = img.naturalHeight
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not get canvas context")

  if (outputMimeType === "image/jpeg" && file.type === "image/png") {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)
  }

  ctx.drawImage(img, 0, 0)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b)
        else reject(new Error("Failed to export image"))
      },
      outputMimeType,
      quality
    )
  })

  const ext = extFromMime(outputMimeType)
  const baseName = file.name.replace(/\.[^.]+$/, "")
  const resultFile = new File([blob], `${baseName}-cleaned.${ext}`, {
    type: outputMimeType,
  })

  return { file: resultFile, width, height }
}

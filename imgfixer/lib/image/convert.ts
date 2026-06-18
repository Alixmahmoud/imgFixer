export interface ConvertResult {
  file: File
  dimensions: { width: number; height: number }
}

export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error("Could not read image dimensions"))
      image.src = url
    })
    return { width: img.naturalWidth, height: img.naturalHeight }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function webpToJpg(file: File): Promise<ConvertResult> {
  const dimensions = await getImageDimensions(file)
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error("Failed to decode the WebP image"))
      image.src = url
    })

    const canvas = document.createElement("canvas")
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Failed to initialize canvas")

    ctx.drawImage(img, 0, 0)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b)
          else reject(new Error("Failed to export image"))
        },
        "image/jpeg",
        0.92
      )
    })

    const baseName = file.name.replace(/\.[^.]+$/, "")
    const resultFile = new File([blob], `${baseName}-converted.jpg`, {
      type: "image/jpeg",
    })
    return { file: resultFile, dimensions }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function pngToJpg(file: File): Promise<ConvertResult> {
  const dimensions = await getImageDimensions(file)
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error("Failed to decode the PNG image"))
      image.src = url
    })

    const canvas = document.createElement("canvas")
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Failed to initialize canvas")

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b)
          else reject(new Error("Failed to export image"))
        },
        "image/jpeg",
        0.92
      )
    })

    const baseName = file.name.replace(/\.[^.]+$/, "")
    const resultFile = new File([blob], `${baseName}-converted.jpg`, {
      type: "image/jpeg",
    })
    return { file: resultFile, dimensions }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function heicToJpg(file: File): Promise<ConvertResult> {
  const heic2anyModule = await import("heic2any")
  const heic2any = heic2anyModule.default

  let blob: Blob
  try {
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    })
    blob = Array.isArray(result) ? result[0] : result
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "HEIC conversion failed"
    )
  }

  const baseName = file.name.replace(/\.[^.]+$/, "")
  const resultFile = new File([blob], `${baseName}-converted.jpg`, {
    type: "image/jpeg",
  })

  let dimensions: { width: number; height: number }
  try {
    dimensions = await getImageDimensions(resultFile)
  } catch {
    dimensions = { width: 0, height: 0 }
  }

  return { file: resultFile, dimensions }
}


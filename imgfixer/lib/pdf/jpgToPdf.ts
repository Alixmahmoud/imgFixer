import { jsPDF } from "jspdf"

export type PdfPageSize = "a4" | "letter" | "same"
export type PdfOrientation = "auto" | "portrait" | "landscape"
export type PdfMargin = "none" | "small" | "medium"
export type PdfFitMode = "fit" | "fill" | "original"

export interface PdfOptions {
  pageSize: PdfPageSize
  orientation: PdfOrientation
  margin: PdfMargin
  fitMode: PdfFitMode
}

interface ImageInfo {
  file: File
  width: number
  height: number
}

const PAGE_SIZES: Record<string, [number, number]> = {
  a4: [210, 297],
  letter: [215.9, 279.4],
}

const MARGIN_VALUES: Record<string, number> = {
  none: 0,
  small: 10,
  medium: 20,
}

function imageToDataUrl(
  img: HTMLImageElement
): string {
  const canvas = document.createElement("canvas")
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Failed to initialize canvas")
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL("image/jpeg", 0.95)
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = url
  })
}

function orientationFromImage(
  w: number,
  h: number,
  orientation: PdfOrientation
): "portrait" | "landscape" {
  if (orientation === "portrait") return "portrait"
  if (orientation === "landscape") return "landscape"
  return w > h ? "landscape" : "portrait"
}

function getPageSizeMm(
  imgW: number,
  imgH: number,
  pageSize: PdfPageSize,
  orientation: PdfOrientation
): [number, number] {
  let pw: number
  let ph: number

  if (pageSize === "same") {
    pw = imgW * 25.4 / 72
    ph = imgH * 25.4 / 72
    if (pw > 600 || ph > 600) {
      const scale = Math.min(600 / pw, 600 / ph)
      pw *= scale
      ph *= scale
    }
  } else {
    ;[pw, ph] = PAGE_SIZES[pageSize]
  }

  const orient = orientationFromImage(pw, ph, orientation)
  if (orient === "portrait" && pw > ph) {
    ;[pw, ph] = [ph, pw]
  } else if (orient === "landscape" && pw < ph) {
    ;[pw, ph] = [ph, pw]
  }

  return [pw, ph]
}

function getImagePlacement(
  imgW: number,
  imgH: number,
  pageW: number,
  pageH: number,
  marginMm: number,
  fitMode: PdfFitMode
): { x: number; y: number; w: number; h: number } {
  const usableW = pageW - 2 * marginMm
  const usableH = pageH - 2 * marginMm

  if (fitMode === "fill") {
    const scale = Math.max(usableW / imgW, usableH / imgH)
    return {
      x: marginMm + (usableW - imgW * scale) / 2,
      y: marginMm + (usableH - imgH * scale) / 2,
      w: imgW * scale,
      h: imgH * scale,
    }
  }

  if (fitMode === "original") {
    const imgWmm = imgW * 25.4 / 72
    const imgHmm = imgH * 25.4 / 72
    if (imgWmm <= usableW && imgHmm <= usableH) {
      return {
        x: marginMm + (usableW - imgWmm) / 2,
        y: marginMm + (usableH - imgHmm) / 2,
        w: imgWmm,
        h: imgHmm,
      }
    }
  }

  const scale = Math.min(usableW / imgW, usableH / imgH)
  return {
    x: marginMm + (usableW - imgW * scale) / 2,
    y: marginMm + (usableH - imgH * scale) / 2,
    w: imgW * scale,
    h: imgH * scale,
  }
}

export async function imagesToPdf(
  images: ImageInfo[],
  options: PdfOptions
): Promise<File> {
  const marginMm = MARGIN_VALUES[options.margin]
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  for (let i = 0; i < images.length; i++) {
    const { file, width: imgW, height: imgH } = images[i]
    const url = URL.createObjectURL(file)

    let img: HTMLImageElement
    try {
      img = await loadImage(url)
    } finally {
      URL.revokeObjectURL(url)
    }

    const dataUrl = imageToDataUrl(img)
    const [pageW, pageH] = getPageSizeMm(imgW, imgH, options.pageSize, options.orientation)
    const placement = getImagePlacement(imgW, imgH, pageW, pageH, marginMm, options.fitMode)

    if (i > 0) doc.addPage([pageW, pageH])
    else {
      doc.internal.pageSize.width = pageW
      doc.internal.pageSize.height = pageH
    }

    doc.addImage(dataUrl, "JPEG", placement.x, placement.y, placement.w, placement.h)
  }

  const blob = doc.output("blob")
  return new File([blob], "images-to-pdf.pdf", { type: "application/pdf" })
}

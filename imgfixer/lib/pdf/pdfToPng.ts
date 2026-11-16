// PDF -> PNG conversion, done entirely in the browser with pdf.js.
// pdf.js is loaded lazily so it never ends up in the server bundle or in
// the bundles of the other tool pages.

export type PdfRenderScale = 1 | 2 | 3 | 4

export interface PdfPageImage {
  pageNumber: number
  file: File
  width: number
  height: number
}

export const MAX_PDF_PAGES = 100

type PdfJs = typeof import("pdfjs-dist")

let pdfjsPromise: Promise<PdfJs> | null = null

function loadPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString()
      }
      return pdfjs
    })
    pdfjsPromise.catch(() => {
      pdfjsPromise = null
    })
  }
  return pdfjsPromise
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode page as PNG.")),
      "image/png"
    )
  })
}

function baseName(fileName: string): string {
  return fileName.replace(/\.pdf$/i, "") || "document"
}

export interface PdfToPngOptions {
  /** 1 = 72 DPI, 2 = 144 DPI, 3 = 216 DPI, 4 = 288 DPI */
  scale: PdfRenderScale
  /** Fill the background with white (true) or keep it transparent (false). */
  whiteBackground: boolean
  onProgress?: (done: number, total: number) => void
}

export async function pdfToPng(
  file: File,
  { scale, whiteBackground, onProgress }: PdfToPngOptions
): Promise<PdfPageImage[]> {
  const pdfjs = await loadPdfJs()
  const data = new Uint8Array(await file.arrayBuffer())

  const loadingTask = pdfjs.getDocument({ data })
  let doc
  try {
    doc = await loadingTask.promise
  } catch (err) {
    await loadingTask.destroy()
    if (err instanceof Error && err.name === "PasswordException") {
      throw new Error("This PDF is password-protected. Please unlock it first.")
    }
    throw new Error("Could not read this PDF. The file may be corrupt.")
  }

  try {
    const total = doc.numPages
    if (total > MAX_PDF_PAGES) {
      throw new Error(
        `This PDF has ${total} pages. Please use a PDF with up to ${MAX_PDF_PAGES} pages.`
      )
    }

    const name = baseName(file.name)
    const digits = String(total).length
    const results: PdfPageImage[] = []
    onProgress?.(0, total)

    for (let i = 1; i <= total; i++) {
      const page = await doc.getPage(i)
      const viewport = page.getViewport({ scale })
      const canvas = document.createElement("canvas")
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)

      // pdf.js creates an opaque (alpha: false) context when given a bare
      // canvas, so we hand it our own alpha-enabled context instead to make
      // the "transparent" background option work.
      const canvasContext = canvas.getContext("2d", { alpha: true })
      if (!canvasContext) {
        throw new Error("Your browser could not create a canvas to render the PDF.")
      }

      await page.render({
        canvas: null,
        canvasContext,
        viewport,
        background: whiteBackground ? "rgb(255,255,255)" : "rgba(0,0,0,0)",
      }).promise

      const blob = await canvasToPngBlob(canvas)
      const pageLabel = total === 1 ? "" : `-page-${String(i).padStart(digits, "0")}`
      results.push({
        pageNumber: i,
        file: new File([blob], `${name}${pageLabel}.png`, { type: "image/png" }),
        width: canvas.width,
        height: canvas.height,
      })

      // Free the canvas memory before the next page.
      canvas.width = 0
      canvas.height = 0
      page.cleanup()
      onProgress?.(i, total)
    }

    return results
  } finally {
    await loadingTask.destroy()
  }
}

export async function zipPngPages(
  pages: PdfPageImage[],
  pdfFileName: string
): Promise<File> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()
  for (const p of pages) zip.file(p.file.name, p.file)
  const blob = await zip.generateAsync({ type: "blob" })
  return new File([blob], `${baseName(pdfFileName)}-png.zip`, {
    type: "application/zip",
  })
}

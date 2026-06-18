"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { imagesToPdf } from "@/lib/pdf/jpgToPdf"
import type { PdfPageSize, PdfOrientation, PdfMargin, PdfFitMode } from "@/lib/pdf/jpgToPdf"
import Image from "next/image"
import { formatSize } from "@/lib/utils"
import {
  Upload,
  RotateCcw,
  Download,
  ChevronUp,
  ChevronDown,
  X,
  Loader2,
  FileText,
  AlertTriangle,
} from "lucide-react"

interface ImageItem {
  id: string
  file: File
  url: string
  width: number
  height: number
}

const ALLOWED_TYPES = ["image/jpeg", "image/png"]
const MAX_IMAGES = 20
const MAX_FILE_SIZE = 15 * 1024 * 1024

const PAGE_SIZES: { value: PdfPageSize; label: string }[] = [
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
  { value: "same", label: "Same as image" },
]

const ORIENTATIONS: { value: PdfOrientation; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
]

const MARGINS: { value: PdfMargin; label: string }[] = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
]

const FIT_MODES: { value: PdfFitMode; label: string }[] = [
  { value: "fit", label: "Fit page" },
  { value: "fill", label: "Fill page" },
  { value: "original", label: "Original size" },
]

let idCounter = 0

function nextId(): string {
  idCounter += 1
  return `img-${idCounter}`
}

function loadImageInfo(
  file: File
): Promise<{ url: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      resolve({ url, width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Could not load image: ${file.name}`))
    }
    img.src = url
  })
}

export default function JpgToPdfTool() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [successCount, setSuccessCount] = useState(0)

  const [isDragOver, setIsDragOver] = useState(false)
  const [pageSize, setPageSize] = useState<PdfPageSize>("a4")
  const [orientation, setOrientation] = useState<PdfOrientation>("auto")
  const [margin, setMargin] = useState<PdfMargin>("small")
  const [fitMode, setFitMode] = useState<PdfFitMode>("fit")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfUrlRef = useRef("")

  useEffect(() => {
    pdfUrlRef.current = pdfUrl
  }, [pdfUrl])

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(pdfUrlRef.current)
    }
  }, [])

  const revokeAllUrls = useCallback(() => {
    for (const img of images) {
      URL.revokeObjectURL(img.url)
    }
  }, [images])

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null)
      setPdfFile(null)
      setPdfUrl("")

      const fileArray = Array.from(files)
      const totalCount = images.length + fileArray.length

      if (totalCount > MAX_IMAGES) {
        setError(
          `Please upload up to ${MAX_IMAGES} images at a time. You have ${totalCount}.`
        )
        return
      }

      const invalidFiles = fileArray.filter(
        (f) => !ALLOWED_TYPES.includes(f.type)
      )
      if (invalidFiles.length > 0) {
        setError("Please upload only JPG and PNG images.")
        return
      }

      const oversizedFiles = fileArray.filter(
        (f) => f.size > MAX_FILE_SIZE
      )
      if (oversizedFiles.length > 0) {
        setError("Each image must be smaller than 15MB.")
        return
      }

      const newItems: ImageItem[] = []
      for (const file of fileArray) {
        try {
          const info = await loadImageInfo(file)
          newItems.push({
            id: nextId(),
            file,
            url: info.url,
            width: info.width,
            height: info.height,
          })
        } catch {
          setError(`Failed to load: ${file.name}. The file may be corrupt.`)
          for (const item of newItems) URL.revokeObjectURL(item.url)
          return
        }
      }

      setImages((prev) => [...prev, ...newItems])
    },
    [images.length]
  )

  const removeImage = useCallback(
    (id: string) => {
      setImages((prev) => {
        const item = prev.find((i) => i.id === id)
        if (item) URL.revokeObjectURL(item.url)
        return prev.filter((i) => i.id !== id)
      })
    },
    []
  )

  const moveImage = useCallback(
    (id: string, direction: "up" | "down") => {
      setImages((prev) => {
        const idx = prev.findIndex((i) => i.id === id)
        if (idx === -1) return prev
        if (direction === "up" && idx === 0) return prev
        if (direction === "down" && idx === prev.length - 1) return prev

        const next = [...prev]
        const swapIdx = direction === "up" ? idx - 1 : idx + 1
        ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
        return next
      })
    },
    []
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        addFiles(files)
      }
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    [addFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        addFiles(files)
      }
    },
    [addFiles]
  )

  const handleReset = useCallback(() => {
    revokeAllUrls()
    URL.revokeObjectURL(pdfUrlRef.current)
    setImages([])
    setPdfFile(null)
    setPdfUrl("")
    setError(null)
    setSuccessCount(0)
  }, [revokeAllUrls])

  const handleCreatePdf = useCallback(async () => {
    if (images.length === 0) return

    setIsProcessing(true)
    setError(null)
    setPdfFile(null)
    setPdfUrl("")

    try {
      const result = await imagesToPdf(
        images.map((img) => ({
          file: img.file,
          width: img.width,
          height: img.height,
        })),
        { pageSize, orientation, margin, fitMode }
      )

      const url = URL.createObjectURL(result)
      URL.revokeObjectURL(pdfUrlRef.current)
      setPdfFile(result)
      setPdfUrl(url)
      setSuccessCount(images.length)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create PDF. The images may be too large for your browser."
      )
    } finally {
      setIsProcessing(false)
    }
  }, [images, pageSize, orientation, margin, fitMode])

  const handleDownload = useCallback(() => {
    if (!pdfFile || !pdfUrl) return
    const a = document.createElement("a")
    a.href = pdfUrl
    a.download = pdfFile.name
    a.click()
  }, [pdfFile, pdfUrl])

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Upload area (shown when no images or as add-more) */}
      {images.length === 0 && !pdfFile && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
          role="button"
          tabIndex={0}
          aria-label="Upload images"
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isDragOver
              ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800"
              : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
          }`}
        >
          <Upload className="mb-3 h-8 w-8 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Drop your images here or click to browse
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Supports JPG, PNG &mdash; Up to {MAX_IMAGES} images &mdash; Max
            15MB each
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            Your files are processed in your browser.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="sr-only"
            onChange={handleFileSelect}
            tabIndex={-1}
          />
        </div>
      )}

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {images.length} {images.length === 1 ? "image" : "images"}
            </h3>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              + Add more
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <div className="space-y-2">
            {images.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                {/* Thumbnail */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={item.url}
                    alt={item.file.name}
                    width={56}
                    height={56}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatSize(item.file.size)} &middot; {item.width} &times;{" "}
                    {item.height}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(item.id, "up")}
                    disabled={idx === 0}
                    className="rounded p-1 text-zinc-400 transition-colors hover:text-zinc-600 disabled:opacity-30 dark:hover:text-zinc-300"
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(item.id, "down")}
                    disabled={idx === images.length - 1}
                    className="rounded p-1 text-zinc-400 transition-colors hover:text-zinc-600 disabled:opacity-30 dark:hover:text-zinc-300"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    className="rounded p-1 text-zinc-400 transition-colors hover:text-red-500 dark:hover:text-red-400"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings (only show when images exist and no PDF yet) */}
      {images.length > 0 && !pdfFile && (
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            PDF Settings
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Page size
              </label>
              <select
                value={pageSize}
                onChange={(e) =>
                  setPageSize(e.target.value as PdfPageSize)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {PAGE_SIZES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) =>
                  setOrientation(e.target.value as PdfOrientation)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {ORIENTATIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Margin
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(e.target.value as PdfMargin)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {MARGINS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Image fit
              </label>
              <select
                value={fitMode}
                onChange={(e) => setFitMode(e.target.value as PdfFitMode)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {FIT_MODES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {images.length} {images.length === 1 ? "image" : "images"} &mdash;{" "}
            {images.length} {images.length === 1 ? "page" : "pages"} estimated
          </div>

          <button
            type="button"
            onClick={handleCreatePdf}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating PDF...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Create PDF
              </>
            )}
          </button>
        </div>
      )}

      {/* Processing standalone indicator */}
      {isProcessing && images.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Creating PDF&hellip;
        </div>
      )}

      {/* Result */}
      {pdfFile && pdfUrl && (
        <div className="space-y-4">
          <hr className="border-zinc-200 dark:border-zinc-800" />

          <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-zinc-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {pdfFile.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatSize(pdfFile.size)} &middot; {successCount}{" "}
                  {successCount === 1 ? "page" : "pages"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Reset (always visible when content exists) */}
      {(images.length > 0 || pdfFile) && (
        <button
          type="button"
          onClick={handleReset}
          disabled={isProcessing}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      )}
    </div>
  )
}

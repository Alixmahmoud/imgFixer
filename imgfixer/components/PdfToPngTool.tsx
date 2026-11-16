"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { pdfToPng, zipPngPages, MAX_PDF_PAGES } from "@/lib/pdf/pdfToPng"
import type { PdfPageImage, PdfRenderScale } from "@/lib/pdf/pdfToPng"
import { formatSize } from "@/lib/utils"
import {
  Upload,
  RotateCcw,
  Download,
  ChevronDown,
  Loader2,
  FileText,
  FileImage,
  AlertTriangle,
  Archive,
} from "lucide-react"

const MAX_FILE_SIZE = 50 * 1024 * 1024

const SCALES: { value: PdfRenderScale; label: string }[] = [
  { value: 1, label: "Low (72 DPI)" },
  { value: 2, label: "Standard (144 DPI)" },
  { value: 3, label: "High (216 DPI)" },
  { value: 4, label: "Very high (288 DPI)" },
]

const BACKGROUNDS: { value: "white" | "transparent"; label: string }[] = [
  { value: "white", label: "White" },
  { value: "transparent", label: "Transparent" },
]

const selectClass =
  "w-full cursor-pointer appearance-none rounded-full border border-[#d7d9dd] bg-[#f4f4f3] px-4 py-3 pr-10 text-base font-medium text-[#1d1f23] shadow-sm transition-all focus:border-[#24389c] focus:outline-none focus:ring-2 focus:ring-[#24389c]/15"

interface PageResult extends PdfPageImage {
  url: string
}

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name)
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()
}

export default function PdfToPngTool() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageResult[]>([])
  const [scale, setScale] = useState<PdfRenderScale>(2)
  const [background, setBackground] = useState<"white" | "transparent">("white")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isZipping, setIsZipping] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pagesRef = useRef<PageResult[]>([])

  useEffect(() => {
    pagesRef.current = pages
  }, [pages])

  useEffect(() => {
    return () => {
      for (const p of pagesRef.current) URL.revokeObjectURL(p.url)
    }
  }, [])

  const clearPages = useCallback(() => {
    for (const p of pagesRef.current) URL.revokeObjectURL(p.url)
    pagesRef.current = []
    setPages([])
  }, [])

  const selectFile = useCallback(
    (file: File) => {
      setError(null)
      clearPages()
      if (!isPdf(file)) {
        setError("Please upload a PDF file.")
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("The PDF must be smaller than 50MB.")
        return
      }
      setPdfFile(file)
    },
    [clearPages]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) selectFile(file)
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    [selectFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) selectFile(file)
    },
    [selectFile]
  )

  const handleConvert = useCallback(async () => {
    if (!pdfFile) return
    setIsProcessing(true)
    setError(null)
    clearPages()
    setProgress(null)

    try {
      const result = await pdfToPng(pdfFile, {
        scale,
        whiteBackground: background === "white",
        onProgress: (done, total) => setProgress({ done, total }),
      })
      setPages(result.map((p) => ({ ...p, url: URL.createObjectURL(p.file) })))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Conversion failed. The PDF may be too large for your browser."
      )
    } finally {
      setIsProcessing(false)
      setProgress(null)
    }
  }, [pdfFile, scale, background, clearPages])

  const handleDownloadZip = useCallback(async () => {
    if (!pdfFile || pages.length === 0) return
    setIsZipping(true)
    try {
      const zip = await zipPngPages(pages, pdfFile.name)
      const url = URL.createObjectURL(zip)
      triggerDownload(url, zip.name)
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch {
      setError("Could not create the ZIP file.")
    } finally {
      setIsZipping(false)
    }
  }, [pages, pdfFile])

  const handleReset = useCallback(() => {
    clearPages()
    setPdfFile(null)
    setError(null)
    setProgress(null)
  }, [clearPages])

  const totalSize = pages.reduce((sum, p) => sum + p.file.size, 0)

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

      {/* Upload */}
      {!pdfFile && (
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
          aria-label="Upload PDF"
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isDragOver
              ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800"
              : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
          }`}
        >
          <Upload className="mb-3 h-8 w-8 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Drop your PDF here or click to browse
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-[#24389c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3f51b5]"
          >
            Choose PDF
          </button>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {`Supports PDF — Up to ${MAX_PDF_PAGES} pages — Max 50MB`}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            Your file is processed in your browser.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={handleFileInput}
            tabIndex={-1}
          />
        </div>
      )}

      {/* Selected file + settings */}
      {pdfFile && (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <FileText className="h-8 w-8 shrink-0 text-zinc-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {pdfFile.name}
            </p>
            <p className="text-xs text-zinc-500">{formatSize(pdfFile.size)}</p>
          </div>
        </div>
      )}

      {pdfFile && pages.length === 0 && (
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            PNG Settings
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="pdf-png-quality"
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Resolution
              </label>
              <div className="relative">
                <select
                  id="pdf-png-quality"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value) as PdfRenderScale)}
                  disabled={isProcessing}
                  className={selectClass}
                >
                  {SCALES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#49515d]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="pdf-png-bg"
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Background
              </label>
              <div className="relative">
                <select
                  id="pdf-png-bg"
                  value={background}
                  onChange={(e) =>
                    setBackground(e.target.value as "white" | "transparent")
                  }
                  disabled={isProcessing}
                  className={selectClass}
                >
                  {BACKGROUNDS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#49515d]" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConvert}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {progress
                  ? `Converting page ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…`
                  : "Loading PDF…"}
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4" />
                Convert to PNG
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {pages.length > 0 && pdfFile && (
        <div className="space-y-4">
          <hr className="border-zinc-200 dark:border-zinc-800" />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {pages.length} PNG {pages.length === 1 ? "image" : "images"} &middot;{" "}
              {formatSize(totalSize)}
            </h3>
            {pages.length > 1 && (
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isZipping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                Download all (ZIP)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pages.map((p) => (
              <div
                key={p.pageNumber}
                className="space-y-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md bg-[repeating-conic-gradient(#e4e4e7_0%_25%,#fafafa_0%_50%)] bg-[length:16px_16px]">
                  <Image
                    src={p.url}
                    alt={`Page ${p.pageNumber}`}
                    width={p.width}
                    height={p.height}
                    unoptimized
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="px-1 text-xs text-zinc-500">
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">
                    Page {p.pageNumber}
                  </p>
                  <p>
                    {p.width} &times; {p.height} &middot; {formatSize(p.file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerDownload(p.url, p.file.name)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 px-2 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PNG
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={clearPages}
            className="w-full cursor-pointer rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Back to settings
          </button>
        </div>
      )}

      {pdfFile && (
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

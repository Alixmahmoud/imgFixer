"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import UploadBox from "./UploadBox"
import ImagePreview from "./ImagePreview"
import { removeImageMetadata } from "@/lib/image/exif"
import type { RemoveMetadataOptions } from "@/lib/image/exif"
import { getImageDimensions } from "@/lib/image/convert"
import { formatSize } from "@/lib/utils"
import {
  RotateCcw,
  Download,
  Loader2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 15 * 1024 * 1024
const MAX_DIMENSION = 6000

const OUTPUT_OPTIONS: {
  value: RemoveMetadataOptions["outputFormat"]
  label: string
}[] = [
  { value: "same", label: "Same as original" },
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
]

export default function RemoveExifTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState("")
  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)

  const [cleanedFile, setCleanedFile] = useState<File | null>(null)
  const [cleanedUrl, setCleanedUrl] = useState("")
  const [cleanedWidth, setCleanedWidth] = useState(0)
  const [cleanedHeight, setCleanedHeight] = useState(0)

  const [outputFormat, setOutputFormat] =
    useState<RemoveMetadataOptions["outputFormat"]>("same")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const originalUrlRef = useRef("")
  const cleanedUrlRef = useRef("")

  useEffect(() => {
    originalUrlRef.current = originalUrl
  }, [originalUrl])

  useEffect(() => {
    cleanedUrlRef.current = cleanedUrl
  }, [cleanedUrl])

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(originalUrlRef.current)
      URL.revokeObjectURL(cleanedUrlRef.current)
    }
  }, [])

  const formatChangedToJpg = useMemo(() => {
    const actualOutput =
      outputFormat === "same" ? originalFile?.type : outputFormat
    return (
      originalFile?.type === "image/png" && actualOutput === "image/jpeg"
    )
  }, [outputFormat, originalFile])

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    setCleanedFile(null)
    setCleanedUrl("")

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be under 15MB.")
      return
    }

    URL.revokeObjectURL(originalUrlRef.current)
    URL.revokeObjectURL(cleanedUrlRef.current)
    setCleanedFile(null)
    setCleanedUrl("")

    const url = URL.createObjectURL(file)
    setOriginalFile(file)
    setOriginalUrl(url)

    try {
      const dims = await getImageDimensions(file)
      if (dims.width > MAX_DIMENSION || dims.height > MAX_DIMENSION) {
        URL.revokeObjectURL(url)
        setOriginalFile(null)
        setOriginalUrl("")
        setError(`Image dimensions must not exceed ${MAX_DIMENSION}px.`)
        return
      }
      setOriginalWidth(dims.width)
      setOriginalHeight(dims.height)
    } catch {
      URL.revokeObjectURL(url)
      setOriginalFile(null)
      setOriginalUrl("")
      setError("Failed to read image dimensions. The file may be corrupt.")
    }
  }, [])

  const handleRemoveMetadata = useCallback(async () => {
    if (!originalFile) return

    setIsProcessing(true)
    setError(null)
    setCleanedFile(null)
    setCleanedUrl("")

    try {
      const result = await removeImageMetadata(originalFile, {
        outputFormat,
      })

      if (result.width > MAX_DIMENSION || result.height > MAX_DIMENSION) {
        setError(`Image dimensions must not exceed ${MAX_DIMENSION}px.`)
        return
      }

      const url = URL.createObjectURL(result.file)
      URL.revokeObjectURL(cleanedUrlRef.current)
      setCleanedFile(result.file)
      setCleanedUrl(url)
      setCleanedWidth(result.width)
      setCleanedHeight(result.height)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove metadata. Try a different image."
      )
    } finally {
      setIsProcessing(false)
    }
  }, [originalFile, outputFormat])

  const handleReset = useCallback(() => {
    URL.revokeObjectURL(originalUrlRef.current)
    URL.revokeObjectURL(cleanedUrlRef.current)
    setOriginalFile(null)
    setOriginalUrl("")
    setOriginalWidth(0)
    setOriginalHeight(0)
    setCleanedFile(null)
    setCleanedUrl("")
    setCleanedWidth(0)
    setCleanedHeight(0)
    setError(null)
  }, [])

  const handleDownload = useCallback(() => {
    if (!cleanedFile || !cleanedUrl) return
    const a = document.createElement("a")
    a.href = cleanedUrl
    a.download = cleanedFile.name
    a.click()
  }, [cleanedFile, cleanedUrl])

  const sizeDiff = useMemo(() => {
    if (!originalFile || !cleanedFile) return null
    const diff = originalFile.size - cleanedFile.size
    const percent =
      originalFile.size > 0
        ? ((diff / originalFile.size) * 100).toFixed(1)
        : "0"
    return { diff, percent, isSmaller: diff > 0 }
  }, [originalFile, cleanedFile])

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

      {!originalFile ? (
        <div className="space-y-3">
          <UploadBox
            onFileSelect={handleFileSelect}
            accept="image/jpeg,image/png,image/webp"
            supportedFormats="JPG, PNG, WebP"
          />
          <p className="text-center text-xs text-zinc-400">
            Your image is processed in your browser. It is not uploaded to a
            server.
          </p>
        </div>
      ) : (
        <>
          {/* Original preview */}
          {originalUrl && originalFile && (
            <div className="space-y-3">
              <ImagePreview
                src={originalUrl}
                file={originalFile}
                label="Original"
                sublabel={
                  originalWidth > 0
                    ? `${originalWidth} × ${originalHeight}`
                    : undefined
                }
              />
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-500">
                <span>Format:</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {originalFile.type || "Unknown"}
                </span>
                <span>Dimensions:</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {originalWidth} × {originalHeight}px
                </span>
              </div>
            </div>
          )}

          {/* Metadata info box */}
          <div className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Metadata can include camera model, software, date, and sometimes
              location information. This tool removes common embedded metadata
              by re-encoding the image.
            </p>
          </div>

          {/* Output format */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Output format
            </label>
            <select
              value={outputFormat}
              onChange={(e) =>
                setOutputFormat(
                  e.target.value as RemoveMetadataOptions["outputFormat"]
                )
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {OUTPUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {formatChangedToJpg && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
              JPG does not support transparency. Transparent areas may become
              white.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRemoveMetadata}
              disabled={isProcessing}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <ShieldCheck className="h-4 w-4" />
              {isProcessing ? "Processing…" : "Remove Metadata"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-zinc-600 dark:text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              Re-encoding image to remove metadata…
            </div>
          )}

          {/* Result */}
          {cleanedFile && cleanedUrl && !isProcessing && (
            <div className="space-y-4">
              <hr className="border-zinc-200 dark:border-zinc-800" />

              <div className="space-y-3">
                <ImagePreview
                  src={cleanedUrl}
                  file={cleanedFile}
                  label="Cleaned"
                  sublabel={
                    cleanedWidth > 0
                      ? `${cleanedWidth} × ${cleanedHeight}`
                      : undefined
                  }
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-500">
                  <span>Format:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {cleanedFile.type}
                  </span>
                  <span>Dimensions:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {cleanedWidth} × {cleanedHeight}px
                  </span>
                </div>

                {sizeDiff && (
                  <p className="text-xs text-zinc-500">
                    {sizeDiff.isSmaller ? (
                      <>
                        File size reduced by {formatSize(sizeDiff.diff)} (
                        {sizeDiff.percent}%)
                      </>
                    ) : (
                      <>
                        File size increased because the image was re-encoded.
                        Metadata was still removed.
                      </>
                    )}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Download className="h-4 w-4" />
                  Download Clean Image
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

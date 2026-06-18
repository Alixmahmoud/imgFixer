"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import UploadBox from "./UploadBox"
import ImagePreview from "./ImagePreview"
import DownloadCard from "./DownloadCard"
import { resizeImage } from "@/lib/image/resize"
import type { ResizeOptions } from "@/lib/image/resize"
import { RotateCcw, Crop, Link2, Link2Off } from "lucide-react"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_DIMENSION = 6000

interface Preset {
  w: number
  h: number
  label: string
  sub?: string
}

const PRESETS: Preset[] = [
  { w: 300, h: 300, label: "300 × 300", sub: "Profile photo" },
  { w: 512, h: 512, label: "512 × 512", sub: "App icon" },
  { w: 800, h: 800, label: "800 × 800", sub: "Instagram square" },
  { w: 1080, h: 1080, label: "1080 × 1080" },
  { w: 1200, h: 630, label: "1200 × 630", sub: "Social preview" },
  { w: 1920, h: 1080, label: "1920 × 1080", sub: "Full HD" },
]

const OUTPUT_OPTIONS: { value: ResizeOptions["outputFormat"]; label: string }[] = [
  { value: "same", label: "Same as original" },
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
]

export default function ResizeImageTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState("")
  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)

  const [width, setWidth] = useState<number | "">("")
  const [height, setHeight] = useState<number | "">("")
  const [keepAspectRatio, setKeepAspectRatio] = useState(true)
  const [outputFormat, setOutputFormat] =
    useState<ResizeOptions["outputFormat"]>("same")
  const [resizeMode, setResizeMode] = useState<"fit" | "exact" | "crop">("crop")

  const [resizedFile, setResizedFile] = useState<File | null>(null)
  const [resizedUrl, setResizedUrl] = useState("")
  const [resizedWidth, setResizedWidth] = useState(0)
  const [resizedHeight, setResizedHeight] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const originalUrlRef = useRef("")
  const resizedUrlRef = useRef("")

  useEffect(() => {
    originalUrlRef.current = originalUrl
  }, [originalUrl])

  useEffect(() => {
    resizedUrlRef.current = resizedUrl
  }, [resizedUrl])

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(originalUrlRef.current)
      URL.revokeObjectURL(resizedUrlRef.current)
    }
  }, [])

  const setWidthWithAspect = useCallback(
    (w: number) => {
      setWidth(w)
      if (resizeMode === "fit" && keepAspectRatio && originalWidth > 0 && originalHeight > 0) {
        setHeight(Math.round(w * (originalHeight / originalWidth)))
      }
    },
    [keepAspectRatio, originalWidth, originalHeight, resizeMode]
  )

  const setHeightWithAspect = useCallback(
    (h: number) => {
      setHeight(h)
      if (resizeMode === "fit" && keepAspectRatio && originalWidth > 0 && originalHeight > 0) {
        setWidth(Math.round(h * (originalWidth / originalHeight)))
      }
    },
    [keepAspectRatio, originalWidth, originalHeight, resizeMode]
  )

  const handleFileSelect = useCallback((file: File) => {
    setError(null)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        "Unsupported file type. Please upload a JPG, PNG, or WebP image."
      )
      return
    }

    URL.revokeObjectURL(originalUrlRef.current)
    URL.revokeObjectURL(resizedUrlRef.current)
    setResizedFile(null)
    setResizedUrl("")
    setError(null)

    const url = URL.createObjectURL(file)
    setOriginalFile(file)
    setOriginalUrl(url)

    const img = new Image()
    img.onload = () => {
      const w = img.naturalWidth
      const h = img.naturalHeight
      setOriginalWidth(w)
      setOriginalHeight(h)
      setWidth(w)
      setHeight(h)
      setResizedWidth(0)
      setResizedHeight(0)
    }
    img.onerror = () => {
      setError("Failed to read image dimensions.")
    }
    img.src = url
  }, [])

  const handleReset = () => {
    URL.revokeObjectURL(originalUrlRef.current)
    URL.revokeObjectURL(resizedUrlRef.current)
    setOriginalUrl("")
    setResizedUrl("")
    setOriginalFile(null)
    setResizedFile(null)
    setOriginalWidth(0)
    setOriginalHeight(0)
    setWidth("")
    setHeight("")
    setResizedWidth(0)
    setResizedHeight(0)
    setResizeMode("crop")
    setKeepAspectRatio(true)
    setError(null)
  }

  const handleResize = async () => {
    if (!originalFile) return

    const w = Number(width)
    const h = Number(height)

    if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1) {
      setError("Width and height must be positive whole numbers.")
      return
    }

    if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
      setError(
        `Dimensions cannot exceed ${MAX_DIMENSION}px.`
      )
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await resizeImage(originalFile, {
        width: w,
        height: h,
        outputFormat,
        resizeMode,
      })

      const actualW = resizeMode === "fit"
        ? Math.round(Math.min(w / originalWidth, h / originalHeight) * originalWidth)
        : w
      const actualH = resizeMode === "fit"
        ? Math.round(Math.min(w / originalWidth, h / originalHeight) * originalHeight)
        : h

      const resizedUrl = URL.createObjectURL(result)
      URL.revokeObjectURL(resizedUrlRef.current)
      setResizedFile(result)
      setResizedUrl(resizedUrl)
      setResizedWidth(actualW)
      setResizedHeight(actualH)
    } catch {
      setError("Resizing failed. Try different dimensions.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resizedFile || !resizedUrl) return
    const a = document.createElement("a")
    a.href = resizedUrl
    a.download = resizedFile.name
    a.click()
  }

  const applyPreset = (p: Preset) => {
    setWidth(p.w)
    setHeight(p.h)
    setResizeMode("crop")
  }

  const formatChangedToJpg =
    outputFormat === "image/jpeg" &&
    originalFile?.type === "image/png"

  return (
    <>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {!originalFile ? (
        <UploadBox onFileSelect={handleFileSelect} />
      ) : (
        <div className="space-y-6">
          {/* Original preview */}
          {originalUrl && originalFile && (
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
          )}

          {/* Resize mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Resize mode
            </label>
            <div className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
              {(["fit", "exact", "crop"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setResizeMode(mode)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    resizeMode === mode
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {mode === "fit" ? "Fit" : mode === "exact" ? "Exact" : "Crop"}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {resizeMode === "fit"
                ? "Fits inside the given size while maintaining aspect ratio. Result may be smaller than the target."
                : resizeMode === "exact"
                  ? "Stretches the image to the exact width and height. May distort the image."
                  : "Center-crops the image to fill the exact size without distortion."}
            </p>
          </div>

          {/* Dimensions */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max={MAX_DIMENSION}
                  value={width}
                  onChange={(e) => {
                    const v = e.target.value
                    setWidthWithAspect(v === "" ? 0 : Number(v))
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max={MAX_DIMENSION}
                  value={height}
                  onChange={(e) => {
                    const v = e.target.value
                    setHeightWithAspect(v === "" ? 0 : Number(v))
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {resizeMode === "fit" && (
              <button
                type="button"
                onClick={() => setKeepAspectRatio(!keepAspectRatio)}
                className="flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {keepAspectRatio ? (
                  <Link2 className="h-4 w-4" />
                ) : (
                  <Link2Off className="h-4 w-4" />
                )}
                {keepAspectRatio ? "Aspect ratio locked" : "Aspect ratio unlocked"}
              </button>
            )}
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
                  e.target.value as ResizeOptions["outputFormat"]
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

          {/* Result expectation */}
          {width !== "" && height !== "" && Number(width) > 0 && Number(height) > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              {resizeMode === "fit" && (
                <p>
                  The image will be scaled to fit within{" "}
                  <strong>
                    {width} × {height}px
                  </strong>{" "}
                  while preserving its aspect ratio. The actual output size may
                  be smaller.
                </p>
              )}
              {resizeMode === "exact" && (
                <p>
                  The image will be stretched to exactly{" "}
                  <strong>
                    {width} × {height}px
                  </strong>
                  .
                </p>
              )}
              {resizeMode === "crop" && (
                <p>
                  The image will be center-cropped to exactly{" "}
                  <strong>
                    {width} × {height}px
                  </strong>
                  .
                </p>
              )}
            </div>
          )}

          {/* Presets */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Presets
              <span className="ml-2 text-xs font-normal text-zinc-400">
                (switches to Crop mode)
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={`${p.w}-${p.h}`}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-left text-xs transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
                >
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {p.w} × {p.h}
                  </span>
                  {p.sub && (
                    <span className="ml-1.5 text-zinc-400">{p.sub}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleResize}
              disabled={isProcessing}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Crop className="h-4 w-4" />
              {isProcessing ? "Resizing…" : "Resize"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Result */}
          {resizedFile && resizedUrl && (
            <div className="space-y-4">
              <hr className="border-zinc-200 dark:border-zinc-800" />

              <ImagePreview
                src={resizedUrl}
                file={resizedFile}
                label="Resized"
                sublabel={
                  resizedWidth > 0
                    ? `${resizedWidth} × ${resizedHeight}`
                    : undefined
                }
              />

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span>Original:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {originalWidth} × {originalHeight}px
                  </span>
                  <span>Requested:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {width} × {height}px
                  </span>
                  <span>Output:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {resizedWidth} × {resizedHeight}px
                  </span>
                  <span>Mode:</span>
                  <span className="font-medium capitalize text-zinc-800 dark:text-zinc-200">
                    {resizeMode}
                  </span>
                </div>
              </div>

              <DownloadCard
                file={resizedFile}
                originalSize={originalFile?.size ?? 0}
                onDownload={handleDownload}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

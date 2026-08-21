"use client"

import { useState, useEffect, useRef } from "react"
import UploadBox from "./UploadBox"
import ImagePreview from "./ImagePreview"
import DownloadCard from "./DownloadCard"
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize,
  FileType,
} from "lucide-react"
import { compressImage, compressImageToTargetSize } from "@/lib/image/compress"

interface QualityMode {
  mode: "quality"
}

interface TargetMode {
  mode: "target"
  targetSizeKB: number
  targetLabel: string
}

type Props = QualityMode | TargetMode

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

function mimeLabel(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "JPG"
    case "image/png":
      return "PNG"
    case "image/webp":
      return "WebP"
    default:
      return mime
  }
}

export default function CompressImageTool(props: Props) {
  const isTarget = props.mode === "target"
  const targetSizeKB = isTarget ? (props as TargetMode).targetSizeKB : undefined

  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState("")
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [compressedUrl, setCompressedUrl] = useState("")
  const [quality, setQuality] = useState(70)
  const [finalQuality, setFinalQuality] = useState<number | null>(null)
  const [finalMaxDimension, setFinalMaxDimension] = useState<
    number | undefined
  >(undefined)
  const [isUnderTarget, setIsUnderTarget] = useState<boolean | null>(null)
  const [wasAlreadyUnderTarget, setWasAlreadyUnderTarget] = useState(false)
  const [formatChanged, setFormatChanged] = useState(false)
  const [originalFormat, setOriginalFormat] = useState("")
  const [hasTransparency, setHasTransparency] = useState(false)
  const [warning, setWarning] = useState<string | undefined>(undefined)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const compressedUrlRef = useRef("")

  useEffect(() => {
    compressedUrlRef.current = compressedUrl
  }, [compressedUrl])

  const compressKey = isTarget ? 0 : quality

  useEffect(() => {
    if (!originalFile) return

    let cancelled = false

    const run = async () => {
      try {
        if (isTarget) {
          const result = await compressImageToTargetSize(
            originalFile,
            targetSizeKB!
          )
          if (cancelled) return
          setCompressedFile(result.file)
          setFinalQuality(result.finalQuality)
          setFinalMaxDimension(result.finalMaxDimension)
          setIsUnderTarget(result.isUnderTarget)
          setWasAlreadyUnderTarget(result.wasAlreadyUnderTarget)
          setFormatChanged(result.formatChanged)
          setOriginalFormat(result.originalFormat)
          setHasTransparency(result.hasTransparency)
          setWarning(result.warning)
          URL.revokeObjectURL(compressedUrlRef.current)
          setCompressedUrl(URL.createObjectURL(result.file))
        } else {
          const nextQuality = quality / 100
          const result = await compressImage(originalFile, nextQuality)
          if (cancelled) return
          setCompressedFile(result)
          setFinalQuality(nextQuality)
          URL.revokeObjectURL(compressedUrlRef.current)
          setCompressedUrl(URL.createObjectURL(result))
        }
      } catch {
        if (cancelled) return
        setError("Compression failed. Try a different image.")
      } finally {
        if (!cancelled) setIsCompressing(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [originalFile, compressKey, quality, isTarget, targetSizeKB])

  const handleFileSelect = (file: File) => {
    setError(null)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        "Unsupported file type. Please upload a JPG, PNG, or WebP image."
      )
      return
    }
    URL.revokeObjectURL(originalUrl)
    URL.revokeObjectURL(compressedUrl)
    setOriginalUrl("")
    setCompressedUrl("")
    setCompressedFile(null)
    setFinalQuality(null)
    setFinalMaxDimension(undefined)
    setIsUnderTarget(null)
    setWasAlreadyUnderTarget(false)
    setFormatChanged(false)
    setOriginalFormat("")
    setHasTransparency(false)
    setWarning(undefined)
    setIsCompressing(true)
    setOriginalFile(file)
    setOriginalUrl(URL.createObjectURL(file))
  }

  const handleReset = () => {
    URL.revokeObjectURL(originalUrl)
    URL.revokeObjectURL(compressedUrl)
    setOriginalUrl("")
    setCompressedUrl("")
    setOriginalFile(null)
    setCompressedFile(null)
    setQuality(70)
    setFinalQuality(null)
    setFinalMaxDimension(undefined)
    setIsUnderTarget(null)
    setWasAlreadyUnderTarget(false)
    setFormatChanged(false)
    setOriginalFormat("")
    setHasTransparency(false)
    setWarning(undefined)
    setError(null)
  }

  const handleDownload = () => {
    if (!compressedFile || !compressedUrl) return
    const a = document.createElement("a")
    a.href = compressedUrl
    a.download = compressedFile.name
    a.click()
  }

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
          {isTarget && (
            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <Info className="h-5 w-5 shrink-0 text-zinc-500" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Target size:{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {(props as TargetMode).targetLabel}
                </span>
              </p>
            </div>
          )}

          {formatChanged && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400">
              <p className="flex items-center gap-2 font-medium">
                <FileType className="h-4 w-4 shrink-0" />
                Converted from {mimeLabel(originalFormat)} to JPG to reach a
                smaller file size.
              </p>
              {hasTransparency && (
                <p className="mt-1">
                  This image may have transparency. Converting to JPG will
                  remove transparent areas.
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            {!isTarget && (
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Quality: {quality}%
              </label>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {!isTarget && (
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => {
                const nextQuality = Number(e.target.value)
                setQuality(nextQuality)
                setFinalQuality(nextQuality / 100)
                setCompressedFile(null)
                setCompressedUrl("")
                setError(null)
                setIsCompressing(true)
              }}
              aria-label="Compression quality"
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#dfe4f3] accent-[#24389c]"
            />
          )}

          {wasAlreadyUnderTarget && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <p className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                This image is already under the target size.
              </p>
            </div>
          )}

          {warning && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
              <p className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {warning}
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {originalUrl && originalFile && (
              <ImagePreview
                src={originalUrl}
                file={originalFile}
                label="Original"
              />
            )}
            {compressedUrl && compressedFile && (
              <ImagePreview
                src={compressedUrl}
                file={compressedFile}
                label="Compressed"
                sublabel={
                  originalFile
                    ? `${((1 - compressedFile.size / originalFile.size) * 100).toFixed(1)}% smaller`
                    : undefined
                }
              />
            )}
          </div>

          {isCompressing && (
            <p className="text-center text-sm text-zinc-500">
              Compressing&hellip;
            </p>
          )}

          {isTarget && !isCompressing && compressedFile && finalQuality !== null && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
              {isUnderTarget !== null && (
                <span className="flex items-center gap-1">
                  {isUnderTarget ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Under target
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-amber-600 dark:text-amber-400">
                        Over target
                      </span>
                    </>
                  )}
                </span>
              )}
              <span>
                Quality:{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {Math.round(finalQuality * 100)}%
                </span>
              </span>
              {finalMaxDimension && (
                <span className="flex items-center gap-1">
                  <Maximize className="h-3.5 w-3.5" />
                  Resized to{" "}
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {finalMaxDimension}px
                  </span>
                </span>
              )}
            </div>
          )}

          <DownloadCard
            file={compressedFile}
            originalSize={originalFile?.size ?? 0}
            onDownload={handleDownload}
          />
        </div>
      )}
    </>
  )
}

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import UploadBox from "./UploadBox"
import ImagePreview from "./ImagePreview"
import type { ConvertResult } from "@/lib/image/convert"
import { getImageDimensions, heicToJpg, webpToJpg, pngToJpg } from "@/lib/image/convert"
import { formatSize } from "@/lib/utils"
import { RotateCcw, Download, Loader2, AlertTriangle } from "lucide-react"

const CONVERTERS: Record<string, (file: File) => Promise<ConvertResult>> = {
  heic: heicToJpg,
  webp: webpToJpg,
  png: pngToJpg,
}

interface ImageConvertToolProps {
  inputFormatLabel: string
  outputFormatLabel: string
  acceptedTypes: string[]
  outputMimeType: "image/jpeg"
  outputExtension: "jpg"
  converterType: "heic" | "webp" | "png"
  hasTransparencyWarning?: boolean
}

const PREVIEWABLE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
]

function canPreview(mimeType: string): boolean {
  return PREVIEWABLE_TYPES.includes(mimeType)
}

function isAcceptedFile(
  file: File,
  acceptedTypes: string[]
): boolean {
  if (acceptedTypes.includes(file.type)) return true
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (!ext) return false
  return acceptedTypes.some(
    (t) => t.replace("image/", "").toLowerCase() === ext
  )
}

export default function ImageConvertTool({
  inputFormatLabel,
  outputFormatLabel,
  acceptedTypes,
  converterType,
  hasTransparencyWarning,
}: ImageConvertToolProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState("")
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  const [convertedResult, setConvertedResult] =
    useState<ConvertResult | null>(null)
  const [convertedUrl, setConvertedUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const originalUrlRef = useRef("")
  const convertedUrlRef = useRef("")

  useEffect(() => {
    originalUrlRef.current = originalUrl
  }, [originalUrl])

  useEffect(() => {
    convertedUrlRef.current = convertedUrl
  }, [convertedUrl])

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(originalUrlRef.current)
      URL.revokeObjectURL(convertedUrlRef.current)
    }
  }, [])

  const convertAndSet = useCallback(
    async (file: File) => {
      setIsProcessing(true)
      setError(null)

      const converter = CONVERTERS[converterType]
      if (!converter) {
        setError("Conversion type not found.")
        setIsProcessing(false)
        return
      }

      try {
        const result = await converter(file)
        const url = URL.createObjectURL(result.file)
        URL.revokeObjectURL(convertedUrlRef.current)
        setConvertedResult(result)
        setConvertedUrl(url)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : `Conversion to ${outputFormatLabel} failed.`
        )
      } finally {
        setIsProcessing(false)
      }
    },
    [converterType, outputFormatLabel]
  )

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null)
      setConvertedResult(null)
      setConvertedUrl("")

      if (!isAcceptedFile(file, acceptedTypes)) {
        setError(`Please upload a ${inputFormatLabel} file.`)
        return
      }

      URL.revokeObjectURL(originalUrlRef.current)
      URL.revokeObjectURL(convertedUrlRef.current)
      setConvertedResult(null)
      setConvertedUrl("")

      const url = URL.createObjectURL(file)
      setOriginalFile(file)
      setOriginalUrl(url)

      if (canPreview(file.type)) {
        try {
          const dims = await getImageDimensions(file)
          setOriginalDimensions(dims)
        } catch {
          setOriginalDimensions(null)
        }
      } else {
        setOriginalDimensions(null)
      }

      await convertAndSet(file)
    },
    [acceptedTypes, inputFormatLabel, convertAndSet]
  )

  const handleReset = useCallback(() => {
    URL.revokeObjectURL(originalUrlRef.current)
    URL.revokeObjectURL(convertedUrlRef.current)
    setOriginalFile(null)
    setOriginalUrl("")
    setOriginalDimensions(null)
    setConvertedResult(null)
    setConvertedUrl("")
    setError(null)
  }, [])

  const handleDownload = useCallback(() => {
    if (!convertedResult || !convertedUrl) return
    const a = document.createElement("a")
    a.href = convertedUrl
    a.download = convertedResult.file.name
    a.click()
  }, [convertedResult, convertedUrl])

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {!originalFile ? (
        <div className="space-y-3">
          <UploadBox
            onFileSelect={handleFileSelect}
            disabled={isProcessing}
            accept={acceptedTypes.join(",")}
            supportedFormats={inputFormatLabel}
          />
          <p className="text-center text-xs text-zinc-400">
            Your file is processed in your browser.
          </p>
        </div>
      ) : (
        <>
          {/* Original info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Original {inputFormatLabel}
            </h3>

            {canPreview(originalFile.type) && originalUrl ? (
              <ImagePreview
                src={originalUrl}
                file={originalFile}
                label={inputFormatLabel}
              />
            ) : (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <p className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                  {originalFile.name}
                </p>
                <p className="mt-1">{formatSize(originalFile.size)}</p>
                <p className="mt-1">
                  Format: {originalFile.type || inputFormatLabel}
                </p>
                {originalDimensions && (
                  <p className="mt-1">
                    {originalDimensions.width} × {originalDimensions.height}px
                  </p>
                )}
              </div>
            )}

            {!canPreview(originalFile.type) && (
              <p className="text-xs text-zinc-400">
                Preview not available for this format in your browser.
              </p>
            )}
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-zinc-600 dark:text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              Converting...
            </div>
          )}

          {/* Transparency warning */}
          {hasTransparencyWarning && !isProcessing && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {inputFormatLabel} does not support transparency. Transparent
                  areas will become white.
                </span>
              </div>
            </div>
          )}

          {/* Converted result */}
          {convertedResult && convertedUrl && !isProcessing && (
            <div className="space-y-3">
              <hr className="border-zinc-200 dark:border-zinc-800" />

              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Converted to {outputFormatLabel}
              </h3>

              <ImagePreview
                src={convertedUrl}
                file={convertedResult.file}
                label={outputFormatLabel}
                sublabel={
                  convertedResult.dimensions.width > 0
                    ? `${convertedResult.dimensions.width} × ${convertedResult.dimensions.height}`
                    : undefined
                }
              />

              <button
                type="button"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Download className="h-4 w-4" />
                Download {outputFormatLabel}
              </button>
            </div>
          )}

          {/* Actions */}
          {!isProcessing && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
        </>
      )}
    </div>
  )
}

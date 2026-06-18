"use client"

import { useRef, useState, type ChangeEvent, type DragEvent } from "react"
import { Upload } from "lucide-react"

interface UploadBoxProps {
  onFileSelect?: (file: File) => void
  disabled?: boolean
  accept?: string
  supportedFormats?: string
}

export default function UploadBox({
  onFileSelect,
  disabled,
  accept = "image/png,image/jpeg,image/webp",
  supportedFormats = "PNG, JPG, WebP",
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFile = (file: File) => {
    if (disabled) return
    onFileSelect?.(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload image"
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
        isDragOver
          ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800"
          : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
      }`}
    >
      <Upload className="mb-3 h-8 w-8 text-zinc-400" />
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Drop your image here or click to browse
      </p>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
        Supports {supportedFormats}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
        tabIndex={-1}
      />
    </div>
  )
}

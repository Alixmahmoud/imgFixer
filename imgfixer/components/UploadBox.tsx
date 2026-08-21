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

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="group"
      aria-label="Upload image"
      className={`flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed p-12 text-center transition-all ${
        isDragOver
          ? "border-[var(--primary)] bg-[rgba(36,56,156,0.06)] shadow-sm"
          : "border-[var(--outline)] bg-[var(--surface-container-low)] hover:border-[var(--primary)] hover:bg-[rgba(36,56,156,0.04)]"
      }`}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(36,56,156,0.08)] text-[var(--primary)]">
        <Upload className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-[var(--on-surface)]">
        Drop your image here or click to browse
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          inputRef.current?.click()
        }}
        disabled={disabled}
        className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-container)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Choose file
      </button>
      <p className="mt-2 text-xs text-[var(--on-surface-variant)]">
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

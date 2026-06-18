import Image from "next/image"
import { formatSize } from "@/lib/utils"

interface ImagePreviewProps {
  src: string
  file: File
  label: string
  sublabel?: string
}

export default function ImagePreview({
  src,
  file,
  label,
  sublabel,
}: ImagePreviewProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
        {sublabel && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400">
            {sublabel}
          </span>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <Image
          src={src}
          alt={file.name}
          width={400}
          height={300}
          unoptimized
          className="max-h-64 w-full object-contain"
          style={{ height: "auto" }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-500">
        <span className="truncate">{file.name}</span>
        <span className="shrink-0">{formatSize(file.size)}</span>
      </div>
    </div>
  )
}

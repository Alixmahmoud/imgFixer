import { formatSize } from "@/lib/utils"

interface DownloadCardProps {
  file: File | null
  originalSize: number
  onDownload: () => void
}

export default function DownloadCard({
  file,
  originalSize,
  onDownload,
}: DownloadCardProps) {
  if (!file) return null

  const saved = originalSize - file.size
  const percentSaved =
    originalSize > 0 ? ((saved / originalSize) * 100).toFixed(1) : "0"
  const isLarger = saved < 0

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {file.name}
          </p>
          <p className="text-xs text-zinc-500">
            {formatSize(file.size)}
            {isLarger
              ? ` — ${formatSize(Math.abs(saved))} larger than original`
              : ` — Saved ${formatSize(saved)} (${percentSaved}%)`}
          </p>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="shrink-0 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Download
        </button>
      </div>
    </div>
  )
}

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
    <div className="space-y-3 rounded-[24px] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-[var(--on-surface)]">
            {file.name}
          </p>
          <p className="text-xs text-[var(--on-surface-variant)]">
            {formatSize(file.size)}
            {isLarger
              ? ` — ${formatSize(Math.abs(saved))} larger than original`
              : ` — Saved ${formatSize(saved)} (${percentSaved}%)`}
          </p>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="shrink-0 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--on-primary)] shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Download
        </button>
      </div>
    </div>
  )
}

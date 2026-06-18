import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import CompressImageTool from "@/components/CompressImageTool"
import { compressTargetMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = compressTargetMetadata("200KB")

export default function CompressTo200kbPage() {
  return (
    <>
      <ToolLayout
        title="Compress Image to 200KB Online"
        description="Compress your image to 200KB or less while maintaining good quality."
        faq={[
          {
            question: "Is it possible to compress any image to 200KB?",
            answer:
              "Most images can be compressed to 200KB, but the result depends on the original size and quality. Larger or high-resolution images may need more aggressive compression.",
          },
          {
            question: "What happens if my image is already under 200KB?",
            answer:
              "If your image is already under 200KB, no compression is needed. The tool will let you know and you can download the original.",
          },
          {
            question: "Why can't some images reach 200KB?",
            answer:
              "Very high-resolution images or images with complex detail may not compress below 200KB without unacceptable quality loss. In that case, the best possible result is provided with a warning.",
          },
        ]}
      >
        <CompressImageTool mode="target" targetSizeKB={200} targetLabel="200KB" />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Compress an Image to 200KB
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload your image — the tool will automatically compress it to 200KB or less.</li>
          <li>Review the compressed result and the quality indicator.</li>
          <li>Download your optimized image.</li>
        </ol>
      </section>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Related Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/compress-image"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Compress Image
          </Link>
          <Link
            href="/compress-image-to-100kb"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Compress to 100KB
          </Link>
          <Link
            href="/compress-image-to-500kb"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Compress to 500KB
          </Link>
          <Link
            href="/compress-image-to-1mb"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Compress to 1MB
          </Link>
          <Link
            href="/resize-image"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Resize Image
          </Link>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import CompressImageTool from "@/components/CompressImageTool"
import { compressMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = compressMetadata()

export default function CompressImagePage() {
  return (
    <>
      <ToolLayout
        title="Compress Image"
        description="Reduce your image file size without losing quality."
        faq={[
          {
            question: "How does image compression work?",
            answer:
              "Image compression reduces file size by removing unnecessary data and optimizing the encoding. Our tool uses smart compression algorithms to balance quality and file size.",
          },
          {
            question: "Will I lose image quality?",
            answer:
              "Our compression is designed to minimize visible quality loss while significantly reducing file size. You can adjust the compression level to find the right balance.",
          },
        ]}
      >
        <CompressImageTool mode="quality" />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Compress an Image
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload your image by clicking the upload area or dragging a file onto it.</li>
          <li>Adjust the quality slider to balance file size and visual quality.</li>
          <li>Preview the compressed result and download it when ready.</li>
        </ol>
      </section>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Related Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/compress-image-to-100kb"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Compress to 100KB
          </Link>
          <Link
            href="/compress-image-to-200kb"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Compress to 200KB
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

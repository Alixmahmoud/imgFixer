import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import ResizeImageTool from "@/components/ResizeImageTool"
import { resizeMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = resizeMetadata

export default function ResizeImagePage() {
  return (
    <>
      <ToolLayout
        title="Resize Image"
        description="Change your image dimensions to your exact specifications."
        faq={[
          {
            question: "Will resizing affect image quality?",
            answer:
              "Resizing to smaller dimensions typically maintains quality. Enlarging images may result in pixelation or blurriness.",
          },
          {
            question: "Can I maintain the aspect ratio?",
            answer:
              "Yes, the tool will preserve the original aspect ratio by default. You can unlink the width and height to set custom dimensions.",
          },
        ]}
      >
        <ResizeImageTool />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Resize an Image
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload your image using the upload area.</li>
          <li>Enter your desired width and height, or choose a preset like &quot;Instagram Square&quot;.</li>
          <li>Select your fit mode — Fit, Exact, or Crop.</li>
          <li>Preview the result and download your resized image.</li>
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
            href="/heic-to-jpg"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            HEIC to JPG
          </Link>
          <Link
            href="/webp-to-jpg"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            WebP to JPG
          </Link>
          <Link
            href="/png-to-jpg"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            PNG to JPG
          </Link>
          <Link
            href="/jpg-to-pdf"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            JPG to PDF
          </Link>
        </div>
      </section>
    </>
  )
}

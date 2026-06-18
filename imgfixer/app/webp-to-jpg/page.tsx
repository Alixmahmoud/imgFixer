import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import ImageConvertTool from "@/components/ImageConvertTool"
import { webpToJpgMetadata } from "@/lib/seo/metadata"
export const metadata: Metadata = webpToJpgMetadata

export default function WebpToJpgPage() {
  return (
    <>
      <ToolLayout
        title="WebP to JPG"
        description="Convert WebP images to the more compatible JPG format."
        faq={[
          {
            question: "What is WebP?",
            answer:
              "WebP is a modern image format developed by Google that provides superior compression. However, some older applications and websites may not support it.",
          },
          {
            question: "Will I lose quality?",
            answer:
              "JPG uses lossy compression, so there may be some quality reduction. The conversion is optimized to balance file size and visual quality.",
          },
        ]}
      >
        <ImageConvertTool
          inputFormatLabel="WebP"
          outputFormatLabel="JPG"
          acceptedTypes={["image/webp"]}
          outputMimeType="image/jpeg"
          outputExtension="jpg"
          converterType="webp"
        />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Convert WebP to JPG
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload your WebP image from your device.</li>
          <li>The tool will convert it to the widely compatible JPG format.</li>
          <li>Download your converted JPG image.</li>
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
            href="/resize-image"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Resize Image
          </Link>
          <Link
            href="/heic-to-jpg"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            HEIC to JPG
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

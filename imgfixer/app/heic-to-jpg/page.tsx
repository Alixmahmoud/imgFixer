import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import ImageConvertTool from "@/components/ImageConvertTool"
import { heicToJpgMetadata } from "@/lib/seo/metadata"
export const metadata: Metadata = heicToJpgMetadata

export default function HeicToJpgPage() {
  return (
    <>
      <ToolLayout
        title="HEIC to JPG"
        description="Convert HEIC/HEIF images to the widely supported JPG format."
        faq={[
          {
            question: "What is HEIC?",
            answer:
              "HEIC (High Efficiency Image Container) is Apple's default image format used on iOS devices. It offers better compression than JPG but has limited support on some platforms.",
          },
          {
            question: "Will I lose quality converting to JPG?",
            answer:
              "JPG is a lossy format, so there may be a slight reduction in quality. However, the conversion is optimized to maintain the best possible visual result.",
          },
        ]}
      >
        <ImageConvertTool
          inputFormatLabel="HEIC"
          outputFormatLabel="JPG"
          acceptedTypes={["image/heic", "image/heif"]}
          outputMimeType="image/jpeg"
          outputExtension="jpg"
          converterType="heic"
        />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Convert HEIC to JPG
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload your HEIC or HEIF image from your iPhone or other device.</li>
          <li>The tool will instantly convert it to JPG format.</li>
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

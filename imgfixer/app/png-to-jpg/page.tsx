import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import ImageConvertTool from "@/components/ImageConvertTool"
import { pngToJpgMetadata } from "@/lib/seo/metadata"
export const metadata: Metadata = pngToJpgMetadata

export default function PngToJpgPage() {
  return (
    <>
      <ToolLayout
        title="PNG to JPG"
        description="Convert PNG images to the more compact JPG format."
        faq={[
          {
            question: "What's the difference between PNG and JPG?",
            answer:
              "PNG supports transparency and lossless compression, resulting in larger files. JPG is lossy but produces much smaller file sizes, making it better for web use.",
          },
          {
            question: "Will I lose transparency?",
            answer:
              "Yes, JPG does not support transparency. Any transparent areas in your PNG will be filled with a white background during conversion.",
          },
        ]}
      >
        <ImageConvertTool
          inputFormatLabel="PNG"
          outputFormatLabel="JPG"
          acceptedTypes={["image/png"]}
          outputMimeType="image/jpeg"
          outputExtension="jpg"
          converterType="png"
          hasTransparencyWarning
        />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Convert PNG to JPG
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload your PNG image from your device.</li>
          <li>The tool will convert it to the more compact JPG format.</li>
          <li>Note that transparent areas will be filled with a white background.</li>
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
            href="/webp-to-jpg"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            WebP to JPG
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

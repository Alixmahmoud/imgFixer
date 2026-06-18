import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import JpgToPdfTool from "@/components/JpgToPdfTool"
import { jpgToPdfMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = jpgToPdfMetadata

export default function JpgToPdfPage() {
  return (
    <>
      <ToolLayout
        title="JPG to PDF"
        description="Convert your JPG and PNG images into a PDF document right in your browser."
        faq={[
          {
            question: "Can I combine multiple images into one PDF?",
            answer:
              "Yes! You can upload up to 20 JPG or PNG images and they will be combined into a single PDF file, with each image on its own page.",
          },
          {
            question: "Can I change the order of images before creating the PDF?",
            answer:
              "Yes, you can reorder images using the move up and move down buttons next to each image. You can also remove individual images.",
          },
          {
            question: "What page sizes are supported?",
            answer:
              "You can choose from A4, Letter, or 'Same as image' which sizes each page to match the image's native dimensions at 72 DPI.",
          },
          {
            question: "Is there a limit on file size or number of images?",
            answer:
              "Since everything runs locally in your browser, the limit depends on your device's memory. For best results, we recommend converting up to 20 images at a time, each under 15MB.",
          },
          {
            question: "Can I control how images fit on the page?",
            answer:
              "Yes. You can choose from three fit modes: 'Fit page' scales the image to fit within the margins, 'Fill page' center-crops the image to fill the page, and 'Original size' places the image at its native resolution.",
          },
        ]}
      >
        <JpgToPdfTool />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Convert JPG to PDF
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload one or more JPG or PNG images (up to 20 images).</li>
          <li>Reorder the images by using the move up and move down buttons.</li>
          <li>Adjust page settings: choose page size, orientation, margins, and fit mode.</li>
          <li>Click &quot;Create PDF&quot; to generate your document.</li>
          <li>Download the resulting PDF file.</li>
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
            href="/png-to-jpg"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            PNG to JPG
          </Link>
          <Link
            href="/remove-exif"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            Remove EXIF
          </Link>
        </div>
      </section>
    </>
  )
}

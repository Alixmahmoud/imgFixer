import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import RemoveExifTool from "@/components/RemoveExifTool"
import { removeExifMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = removeExifMetadata

export default function RemoveExifPage() {
  return (
    <>
      <ToolLayout
        title="Remove EXIF Metadata"
        description="Strip hidden metadata from your images to protect your privacy."
        faq={[
          {
            question: "What is EXIF data?",
            answer:
              "EXIF (Exchangeable Image File Format) data is metadata stored in image files. It can include camera settings, GPS location, date and time, and device information.",
          },
          {
            question: "Why should I remove EXIF data?",
            answer:
              "Removing EXIF data protects your privacy by eliminating potentially sensitive information like your location, camera model, and when the photo was taken before sharing online.",
          },
          {
            question: "Is all metadata guaranteed to be removed?",
            answer:
              "This tool removes common embedded metadata by re-encoding the image through a canvas. This strips most standard EXIF, XMP, and IPTC metadata. Some specialized or proprietary metadata may not be affected.",
          },
          {
            question: "Can I keep the same file format?",
            answer:
              "Yes. The default setting preserves your original format (JPG, PNG, or WebP). You can also choose to convert to a different format if needed.",
          },
          {
            question: "Will this affect image quality?",
            answer:
              "The image is re-encoded at high quality (92%), so visual quality is preserved. The file size may change slightly due to re-encoding.",
          },
        ]}
      >
        <RemoveExifTool />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Remove EXIF Metadata
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload your image — the tool will scan it for embedded metadata.</li>
          <li>Choose whether to keep the original format or convert to a different one.</li>
          <li>The tool will strip GPS location, camera info, and other hidden data.</li>
          <li>Download your cleaned image.</li>
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

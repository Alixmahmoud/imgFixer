import type { Metadata } from "next"
import Link from "next/link"
import ToolLayout from "@/components/ToolLayout"
import PdfToPngTool from "@/components/PdfToPngTool"
import { pdfToPngMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pdfToPngMetadata

const relatedLinkClass =
  "rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"

export default function PdfToPngPage() {
  return (
    <>
      <ToolLayout
        title="PDF to PNG"
        description="Convert every page of a PDF into a high-quality PNG image, right in your browser."
        faq={[
          {
            question: "Does each PDF page become a separate PNG?",
            answer:
              "Yes. Every page is saved as its own PNG image. You can download pages one by one, or download all of them together in a single ZIP file.",
          },
          {
            question: "Which resolution should I choose?",
            answer:
              "Standard (144 DPI) is good for screens and sharing. Choose High (216 DPI) or Very high (288 DPI) for sharp text, zooming, or printing. Higher resolutions produce larger files and take longer to convert.",
          },
          {
            question: "Can I get a transparent background?",
            answer:
              "Yes. Set Background to Transparent and areas of the page with no content will stay transparent in the PNG. Choose White if you want the pages to look exactly like a printed document.",
          },
          {
            question: "Are my PDFs uploaded to a server?",
            answer:
              "No. The PDF is opened and rendered entirely inside your browser, so your document never leaves your device.",
          },
          {
            question: "Is there a limit on file size or pages?",
            answer:
              "You can convert PDFs up to 50MB with up to 100 pages. Password-protected PDFs need to be unlocked first.",
          },
        ]}
      >
        <PdfToPngTool />
      </ToolLayout>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          How to Convert PDF to PNG
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Upload a PDF file from your device.</li>
          <li>Choose the resolution and whether the background should be white or transparent.</li>
          <li>Click &quot;Convert to PNG&quot; to turn each page into an image.</li>
          <li>Download individual pages, or download all pages as a ZIP file.</li>
        </ol>
      </section>

      <section className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Related Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/jpg-to-pdf" className={relatedLinkClass}>
            JPG to PDF
          </Link>
          <Link href="/png-to-jpg" className={relatedLinkClass}>
            PNG to JPG
          </Link>
          <Link href="/compress-image" className={relatedLinkClass}>
            Compress Image
          </Link>
          <Link href="/resize-image" className={relatedLinkClass}>
            Resize Image
          </Link>
        </div>
      </section>
    </>
  )
}

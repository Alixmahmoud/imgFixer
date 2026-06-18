import type { Metadata } from "next"
import { termsMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = termsMetadata

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Terms of Service
      </h1>
      <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Service Description
        </h2>
        <p>
          ImgFixer provides free online image processing tools that run entirely
          in your browser. No images are uploaded to any server. All processing
          is performed client-side using JavaScript.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          No Warranty
        </h2>
        <p>
          The tools are provided &quot;as-is&quot; without any warranty, express
          or implied. We do not guarantee that the tools will meet your specific
          requirements or that they will be error-free.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Limitation of Liability
        </h2>
        <p>
          ImgFixer is not liable for any damages arising from the use or
          inability to use these tools. This includes, but is not limited to,
          loss of data, loss of image quality, or any other damages.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          User Responsibility
        </h2>
        <p>
          You are responsible for ensuring you have the legal right to process
          any images you use with our tools. Do not upload illegal, infringing,
          or sensitive content.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Availability
        </h2>
        <p>
          We strive to keep the service available at all times but make no
          guarantees. The service may be modified, suspended, or discontinued at
          any time without notice.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Changes to Terms
        </h2>
        <p>
          We reserve the right to update these terms at any time. Changes will
          be posted on this page. Continued use of the service after changes
          constitutes acceptance of the new terms.
        </p>
      </div>
    </div>
  )
}

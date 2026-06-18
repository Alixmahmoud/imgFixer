import type { Metadata } from "next"
import { privacyMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = privacyMetadata

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Privacy Policy
      </h1>
      <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Browser-First Processing
        </h2>
        <p>
          ImgFixer processes all images entirely in your browser using
          client-side JavaScript. No image data is ever uploaded to any server.
          Each tool — whether compressing, resizing, converting, or removing
          metadata — runs locally on your device.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          No Account Required
        </h2>
        <p>
          You do not need to create an account or provide personal information
          to use any of our image tools. We do not collect names, email
          addresses, or any other personally identifiable information.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          File Storage
        </h2>
        <p>
          We do not intentionally store, transmit, or access the images you
          process. All data remains on your device. Once you close or refresh
          the page, any loaded files are cleared from memory.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Third-Party Services
        </h2>
        <p>
          We may use basic analytics services to understand how the site is
          used. These services do not collect personally identifiable
          information. If advertisements are added in the future, they may use
          cookies. This policy will be updated accordingly.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          User Responsibility
        </h2>
        <p>
          You are responsible for ensuring you have the right to process any
          images you upload. Do not upload illegal, infringing, or sensitive
          content.
        </p>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Contact
        </h2>
        <p>
          If you have questions about this policy, reach out to us at{" "}
          <a
            href="mailto:support@example.com"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            support@example.com
          </a>
          .
        </p>

        <p className="pt-4 text-xs text-zinc-400">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  )
}

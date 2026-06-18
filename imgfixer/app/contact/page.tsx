import type { Metadata } from "next"
import { contactMetadata } from "@/lib/seo/metadata"
import Link from "next/link"

export const metadata: Metadata = contactMetadata

/* TODO: Replace support@example.com with real email before deploy. */

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Contact Us
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Have a question, suggestion, or feedback? We would love to hear from
        you. Reach out to us at{" "}
        <a
          href="mailto:support@example.com"
          className="font-medium text-zinc-900 underline dark:text-zinc-100"
        >
          support@example.com
        </a>
        .
      </p>

      <div className="space-y-3 pt-4">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Quick Links
        </h2>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Terms of Service
            </Link>
          </li>
          <li>
            <Link
              href="/tools"
              className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Browse All Tools
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

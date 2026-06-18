import type { ReactNode } from "react"
import AdSlot from "./AdSlot"
import FAQ from "./FAQ"
import type { FAQItem } from "./FAQ"

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
  faq?: FAQItem[]
}

export default function ToolLayout({
  title,
  description,
  children,
  faq,
}: ToolLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
      {children}
      <AdSlot />
      {faq && faq.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Frequently Asked Questions
          </h2>
          <FAQ items={faq} />
        </div>
      )}
    </div>
  )
}

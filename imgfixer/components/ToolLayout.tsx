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
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-4 rounded-[28px] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Image utility
        </p>
        <h1 className="text-4xl font-bold tracking-[-0.05em] text-[var(--on-surface)] sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--on-surface-variant)]">
          {description}
        </p>
      </header>

      <div className="rounded-[28px] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-sm sm:p-6">
        {children}
      </div>

      <AdSlot />
      {faq && faq.length > 0 && (
        <div className="space-y-4 rounded-[28px] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--on-surface)]">
            Frequently Asked Questions
          </h2>
          <FAQ items={faq} />
        </div>
      )}
    </div>
  )
}

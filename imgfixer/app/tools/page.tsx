import type { Metadata } from "next"
import Link from "next/link"
import { tools, categories } from "@/lib/tools"
import { toolsMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = toolsMetadata

const featuredSlugs = ["jpg-to-pdf", "compress-image", "resize-image"]

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          All Image Tools
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Choose a focused browser tool for your image workflow. Your files stay
          on your device.
        </p>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              Start here
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Popular tools
            </h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {featuredSlugs.map((slug) => {
            const tool = tools.find((item) => item.slug === slug)
            if (!tool) return null
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-center gap-3 rounded-lg border border-[#cfd3e4] bg-[#edf0ff] p-4 transition-all hover:-translate-y-0.5 hover:border-[#24389c] hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--primary)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">{tool.title}</h3>
                  <p className="mt-0.5 text-sm text-zinc-600">Open tool</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {categories.map((category) => {
        const categoryTools = tools.filter((t) => t.category === category.key)
        return (
          <section key={category.key}>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {category.label}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                      <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {tool.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

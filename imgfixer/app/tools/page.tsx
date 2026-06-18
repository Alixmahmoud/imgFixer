import type { Metadata } from "next"
import Link from "next/link"
import { tools, categories } from "@/lib/tools"
import { toolsMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = toolsMetadata

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          All Image Tools
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Browse every tool ImgFixer offers. Compress, resize, convert, and
          protect your images — all in your browser.
        </p>
      </div>

      {categories.map((category) => {
        const categoryTools = tools.filter((t) => t.category === category.key)
        return (
          <section key={category.key}>
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {category.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
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

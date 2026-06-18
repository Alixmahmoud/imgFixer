import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          ImgFixer
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:gap-6">
          <Link
            href="/"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Home
          </Link>
          <Link
            href="/tools"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            All Tools
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}

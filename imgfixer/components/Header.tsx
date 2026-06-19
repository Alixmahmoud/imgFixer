import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M9 15l3 3 3-3" />
            <path d="M12 18v-6" />
          </svg>
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

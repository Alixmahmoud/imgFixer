import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <p className="text-center">
            © {new Date().getFullYear()} ImgFixer. All images are processed in your browser — nothing is uploaded to any server.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/" className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200">
              Home
            </Link>
            <Link href="/tools" className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200">
              Tools
            </Link>
            <Link href="/privacy" className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200">
              Privacy
            </Link>
            <Link href="/terms" className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200">
              Terms
            </Link>
            <Link href="/contact" className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

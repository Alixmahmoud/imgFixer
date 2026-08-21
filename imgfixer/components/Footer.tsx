import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-sm text-[var(--on-surface-variant)]">
          <p className="text-center">
            © {new Date().getFullYear()} ImgFixer. All images are processed in your browser — nothing is uploaded to any server.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/" className="underline-offset-2 transition-colors hover:text-[var(--primary)] hover:underline">
              Home
            </Link>
            <Link href="/tools" className="underline-offset-2 transition-colors hover:text-[var(--primary)] hover:underline">
              Tools
            </Link>
            <Link href="/privacy" className="underline-offset-2 transition-colors hover:text-[var(--primary)] hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="underline-offset-2 transition-colors hover:text-[var(--primary)] hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="underline-offset-2 transition-colors hover:text-[var(--primary)] hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

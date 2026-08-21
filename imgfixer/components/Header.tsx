"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe1e4] bg-[#f7f7f5]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-[2rem] font-black leading-none tracking-[-0.06em] text-[#181d1f]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#24389c] text-[#ffffff] shadow-sm">
            <svg
              width="18"
              height="18"
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
          </span>
          <span className="text-[2.05rem] sm:text-[2.2rem]">ImgFixer</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[1.25rem] font-medium text-[#32363b] sm:gap-8 md:flex">
          <Link href="/" className="transition-colors hover:text-[var(--primary)]">
            Home
          </Link>
          <Link href="/tools" className="transition-colors hover:text-[var(--primary)]">
            All Tools
          </Link>
          <Link href="/contact" className="transition-colors hover:text-[var(--primary)]">
            Contact
          </Link>
        </nav>
        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#dfe1e4] text-[#32363b] md:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="border-t border-[#dfe1e4] px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-1 text-base font-semibold text-[#32363b]">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#edf0ff]">
              Home
            </Link>
            <Link href="/tools" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#edf0ff]">
              All Tools
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#edf0ff]">
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

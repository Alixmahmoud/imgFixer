import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { homeMetadata } from "@/lib/seo/metadata"
import { Analytics } from "@vercel/analytics/next"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  ...homeMetadata,
  verification: {
    google: "0uSPBrcbn9-HLrznjwix-pAq4H7lOZFF-hxPBZ-fQ3s",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--on-surface)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

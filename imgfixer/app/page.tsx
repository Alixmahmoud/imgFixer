import Link from "next/link"
import { tools } from "@/lib/tools"
import { ArrowRight, FileText, Shield, Zap, Globe, Download } from "lucide-react"

const steps = [
  {
    number: "1",
    title: "Choose a Tool",
    description:
      "Select the image tool you need — compress, resize, convert, or remove metadata.",
  },
  {
    number: "2",
    title: "Upload Your Image",
    description:
      "Select a file from your device. Everything stays in your browser.",
  },
  {
    number: "3",
    title: "Download the Result",
    description: "Adjust settings, preview the output, and download instantly.",
  },
]

const benefits = [
  {
    title: "100% Free",
    description: "No hidden fees, no premium tiers. Every tool is free to use.",
    icon: Shield,
  },
  {
    title: "No Uploads",
    description:
      "All processing happens in your browser. Your files never leave your device.",
    icon: Globe,
  },
  {
    title: "Fast Processing",
    description:
      "Optimized libraries work directly in your browser for instant results.",
    icon: Zap,
  },
  {
    title: "Private & Secure",
    description:
      "No accounts, no tracking, no data collection. Your images stay yours.",
    icon: Download,
  },
]

const faqs = [
  {
    question: "Is ImgFixer really free?",
    answer:
      "Yes. All tools are completely free with no usage limits, registration, or hidden charges.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. Every tool processes images right in your browser using JavaScript. Your files never leave your device.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support JPG, PNG, WebP, and HEIC/HEIF for input. Output formats include JPG, PDF, and the original format depending on the tool.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Since everything runs in your browser, the limit depends on your device's available memory. Most modern phones and computers can handle images up to 50MB easily.",
  },
]

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-5 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-[#dfe1e4] bg-[#f7f7f5] px-4 pb-5 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[22px] border border-[#dfe1e4] bg-[#f2f2f1] px-4 pb-4 pt-5 sm:px-6 lg:px-7">
          <div className="inline-flex items-center rounded-full border border-[#d8d9e1] bg-[#edf0ff] px-3 py-1 text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#3143a6]">
            Browser-based image tools
          </div>

          <h1 className="mt-8 max-w-[1100px] text-[clamp(4rem,7vw,8.4rem)] leading-[0.9] tracking-[-0.07em] text-[#1a1b1d]">
            ImgFixer — Free online image tools
          </h1>

          <p className="mt-8 max-w-[1100px] text-[clamp(1.5rem,2.1vw,3rem)] leading-[1.2] text-[#4a4d54]">
            Compress, resize, convert, and clean up images in your browser with no upload,
            no sign-up, and no hidden fees.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-full bg-[#24389c] px-7 py-3 text-[1.1rem] font-semibold text-white shadow-[0_8px_20px_rgba(36,56,156,0.18)] transition-transform hover:-translate-y-0.5"
            >
              View All Tools
            </Link>
            <Link
              href="/compress-image"
              className="inline-flex items-center justify-center rounded-full border border-[#b7bac1] bg-[#f6f6f5] px-7 py-3 text-[1.1rem] font-semibold text-[#1d1f24] transition-colors hover:border-[#24389c] hover:text-[#24389c]"
            >
              Compress an Image
            </Link>
            <Link
              href="/jpg-to-pdf"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b7bac1] bg-[#f6f6f5] px-7 py-3 text-[1.1rem] font-semibold text-[#1d1f24] transition-colors hover:border-[#24389c] hover:text-[#24389c]"
            >
              <FileText className="h-4 w-4" />
              JPG to PDF
            </Link>
          </div>

          <div className="mt-12 rounded-[24px] border border-[#d5d7dc] bg-[#f5f5f3] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 px-1 pb-4 pt-1">
              <div>
                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[#70747d]">
                  Workflow
                </p>
                <p className="mt-2 text-[2.2rem] font-bold leading-none tracking-[-0.05em] text-[#1a1b1d]">
                  Ready to process
                </p>
              </div>
              <span className="rounded-full bg-[#e9ebf6] px-4 py-2 text-[0.9rem] font-semibold text-[#3b4bb0]">
                100% local
              </span>
            </div>

            <div className="rounded-[20px] border border-[#c9cbd1] bg-[#f7f7f6] p-4 sm:p-6">
              <div className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[#676d75]">
                Upload
              </div>
              <div className="flex h-[168px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#9ea3ad] bg-[#f8f8f7] text-center text-[1.1rem] text-[#60656c]">
                <p>Choose a tool to get started</p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/compress-image"
                    className="inline-flex items-center gap-2 rounded-full bg-[#24389c] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Compress image <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/resize-image"
                    className="inline-flex items-center rounded-full border border-[#b7bac1] bg-[#f6f6f5] px-4 py-2 text-sm font-semibold text-[#1d1f24] transition-colors hover:border-[#24389c] hover:text-[#24389c]"
                  >
                    Resize image
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 hidden md:block">
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-[#1a1b1d] opacity-15" />
        </div>
      </div>

      <div className="fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1c1e] text-lg font-bold text-white shadow-lg">
        N
      </div>

      <div className="mt-8"></div>
    </div>
  )
}

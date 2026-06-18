import Link from "next/link"
import { tools } from "@/lib/tools"
import { Shield, Zap, Globe, Download } from "lucide-react"

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
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero */}
      <section className="mb-20 space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          Free Online Image Tools
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Compress, resize, convert images, create PDFs, and remove metadata — all in your browser. Nothing is uploaded to any server.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            View All Tools
          </Link>
          <Link
            href="/compress-image"
            className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Compress an Image
          </Link>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="mb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
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

      {/* How It Works */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          How It Works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                {step.number}
              </div>
              <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Why ImgFixer
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                  {benefit.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-2xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {faq.question}
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Ready to get started?
        </h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Pick a tool and start processing your images right now — no signup required.
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse All Tools
        </Link>
      </section>
    </div>
  )
}

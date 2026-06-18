import type { Metadata } from "next"

/* Set NEXT_PUBLIC_SITE_URL in Vercel env vars so sitemap, robots, canonical, and OG URLs use the correct domain. Falls back to localhost for dev. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

interface PageMetadata {
  title: string
  description: string
  path?: string
  ogImage?: string
}

export function createMetadata({
  title,
  description,
  path,
  ogImage,
}: PageMetadata): Metadata {
  const url = path ? `${SITE_URL}${path}` : SITE_URL
  return {
    title: `${title} | ImgFixer`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ImgFixer`,
      description,
      url,
      siteName: "ImgFixer",
      locale: "en_US",
      type: "website",
      images: ogImage
        ? [{ url: `${SITE_URL}${ogImage}`, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ImgFixer`,
      description,
      images: ogImage ? [`${SITE_URL}${ogImage}`] : undefined,
    },
  }
}

/*
 * Alias for static pages (privacy, terms, contact, etc.).
 */
export const createPageMetadata = createMetadata

/*
 * Alias for tool pages (compress, resize, convert, etc.).
 */
export const createToolMetadata = createMetadata

export const homeMetadata: Metadata = createMetadata({
  title: "Free Online Image Tools",
  description:
    "Compress, resize, and convert images online for free. No uploads required — everything runs in your browser.",
  path: "/",
})

export const toolsMetadata: Metadata = createMetadata({
  title: "All Image Tools",
  description:
    "Browse all free online image tools. Compress, resize, convert JPG, PNG, WebP, HEIC, and more. All tools run entirely in your browser.",
  path: "/tools",
})

export function compressMetadata(path?: string): Metadata {
  return createMetadata({
    title: "Compress Image",
    description:
      "Compress your images online for free. Reduce file size without losing quality. Supports JPG, PNG, and WebP.",
    path: path || "/compress-image",
  })
}

export function compressTargetMetadata(size: string, path?: string): Metadata {
  return createMetadata({
    title: `Compress Image to ${size}`,
    description: `Compress your image to ${size} or less online for free. No uploads required — your image stays on your device.`,
    path: path || `/compress-image-to-${size.toLowerCase().replace(" ", "")}`,
  })
}

export const resizeMetadata: Metadata = createMetadata({
  title: "Resize Image",
  description:
    "Resize your images online for free. Change width and height instantly with fit, exact, or crop modes. Preserve aspect ratio or set custom dimensions.",
  path: "/resize-image",
})

export const heicToJpgMetadata: Metadata = createMetadata({
  title: "HEIC to JPG",
  description:
    "Convert HEIC and HEIF images to JPG format online for free. Works with iPhone photos directly in your browser.",
  path: "/heic-to-jpg",
})

export const webpToJpgMetadata: Metadata = createMetadata({
  title: "WebP to JPG",
  description:
    "Convert WebP images to JPG format online for free. Download your images in the widely supported JPEG format.",
  path: "/webp-to-jpg",
})

export const pngToJpgMetadata: Metadata = createMetadata({
  title: "PNG to JPG",
  description:
    "Convert PNG images to JPG format online for free. Reduce file size while maintaining quality. Transparent areas become white.",
  path: "/png-to-jpg",
})

export const jpgToPdfMetadata: Metadata = createMetadata({
  title: "JPG to PDF",
  description:
    "Convert JPG and PNG images to PDF online for free. Combine multiple images into one PDF. Adjust page size, margins, and orientation.",
  path: "/jpg-to-pdf",
})

export const removeExifMetadata: Metadata = createMetadata({
  title: "Remove EXIF Metadata",
  description:
    "Remove EXIF metadata from your images online for free. Strip GPS location, camera info, and hidden data to protect your privacy.",
  path: "/remove-exif",
})

export const privacyMetadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "ImgFixer privacy policy. We process images locally in your browser — no uploads to any server. Learn how your data is protected.",
  path: "/privacy",
})

export const termsMetadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "ImgFixer terms of service. Free browser-based image tools provided as-is. Review your rights and responsibilities.",
  path: "/terms",
})

export const contactMetadata: Metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with the ImgFixer team. Send feedback, suggestions, or questions about our free online image tools.",
  path: "/contact",
})

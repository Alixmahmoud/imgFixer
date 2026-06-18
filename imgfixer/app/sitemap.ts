import type { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "/compress-image",
    "/compress-image-to-100kb",
    "/compress-image-to-200kb",
    "/compress-image-to-500kb",
    "/compress-image-to-1mb",
    "/resize-image",
    "/heic-to-jpg",
    "/webp-to-jpg",
    "/png-to-jpg",
    "/jpg-to-pdf",
    "/remove-exif",
  ]

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]

  const toolPages: MetadataRoute.Sitemap = tools.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...toolPages]
}

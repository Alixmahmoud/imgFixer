import {
  FileDown,
  Maximize,
  RefreshCw,
  FileImage,
  FileType,
  Scan,
  FileText,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ToolCategory = "compress" | "resize" | "convert" | "pdf" | "privacy"

export interface ToolDefinition {
  title: string
  slug: string
  href: string
  description: string
  category: ToolCategory
  keywords: string[]
  icon: LucideIcon
  shortUseCases: string[]
  relatedTools: string[]
}

export const tools: ToolDefinition[] = [
  {
    title: "Compress Image",
    slug: "compress-image",
    href: "/compress-image",
    description: "Reduce image file size without losing quality.",
    category: "compress",
    keywords: ["compress image", "reduce file size", "optimize image", "smaller image"],
    icon: FileDown,
    shortUseCases: ["Reduce file size for web", "Optimize images for email", "Save disk space"],
    relatedTools: ["compress-image-to-100kb", "compress-image-to-200kb", "compress-image-to-500kb", "compress-image-to-1mb", "resize-image"],
  },
  {
    title: "Compress to 100KB",
    slug: "compress-image-to-100kb",
    href: "/compress-image-to-100kb",
    description: "Compress your image to 100KB or less.",
    category: "compress",
    keywords: ["compress to 100kb", "image under 100kb", "resize for upload"],
    icon: FileDown,
    shortUseCases: ["Upload size limits", "Forum attachments", "Application forms"],
    relatedTools: ["compress-image", "compress-image-to-200kb", "compress-image-to-500kb", "compress-image-to-1mb", "resize-image"],
  },
  {
    title: "Compress to 200KB",
    slug: "compress-image-to-200kb",
    href: "/compress-image-to-200kb",
    description: "Compress your image to 200KB or less.",
    category: "compress",
    keywords: ["compress to 200kb", "image under 200kb"],
    icon: FileDown,
    shortUseCases: ["Document uploads", "Portfolio submissions", "Social media"],
    relatedTools: ["compress-image", "compress-image-to-100kb", "compress-image-to-500kb", "compress-image-to-1mb", "resize-image"],
  },
  {
    title: "Compress to 500KB",
    slug: "compress-image-to-500kb",
    href: "/compress-image-to-500kb",
    description: "Compress your image to 500KB or less.",
    category: "compress",
    keywords: ["compress to 500kb", "image under 500kb"],
    icon: FileDown,
    shortUseCases: ["Email attachments", "Blog images", "CMS uploads"],
    relatedTools: ["compress-image", "compress-image-to-100kb", "compress-image-to-200kb", "compress-image-to-1mb", "resize-image"],
  },
  {
    title: "Compress to 1MB",
    slug: "compress-image-to-1mb",
    href: "/compress-image-to-1mb",
    description: "Compress your image to 1MB or less.",
    category: "compress",
    keywords: ["compress to 1mb", "image under 1mb", "reduce to 1 megabyte"],
    icon: FileDown,
    shortUseCases: ["High-quality web images", "Print submissions", "Photography portfolios"],
    relatedTools: ["compress-image", "compress-image-to-100kb", "compress-image-to-200kb", "compress-image-to-500kb", "resize-image"],
  },
  {
    title: "Resize Image",
    slug: "resize-image",
    href: "/resize-image",
    description: "Change image dimensions to your exact specifications.",
    category: "resize",
    keywords: ["resize image", "change dimensions", "image width height", "scale image"],
    icon: Maximize,
    shortUseCases: ["Social media sizes", "Thumbnail creation", "Banner dimensions"],
    relatedTools: ["compress-image", "jpg-to-pdf", "heic-to-jpg", "webp-to-jpg", "png-to-jpg", "remove-exif"],
  },
  {
    title: "HEIC to JPG",
    slug: "heic-to-jpg",
    href: "/heic-to-jpg",
    description: "Convert HEIC/HEIF images to widely supported JPG format.",
    category: "convert",
    keywords: ["heic to jpg", "heif to jpg", "convert heic", "apple photo converter"],
    icon: RefreshCw,
    shortUseCases: ["iPhone photos", "Cross-platform sharing", "Backward compatibility"],
    relatedTools: ["webp-to-jpg", "png-to-jpg", "jpg-to-pdf", "compress-image", "resize-image"],
  },
  {
    title: "WebP to JPG",
    slug: "webp-to-jpg",
    href: "/webp-to-jpg",
    description: "Convert WebP images to the more compatible JPG format.",
    category: "convert",
    keywords: ["webp to jpg", "convert webp", "webp converter"],
    icon: FileType,
    shortUseCases: ["Website images", "Legacy software compatibility", "Print preparation"],
    relatedTools: ["heic-to-jpg", "png-to-jpg", "jpg-to-pdf", "compress-image", "resize-image"],
  },
  {
    title: "PNG to JPG",
    slug: "png-to-jpg",
    href: "/png-to-jpg",
    description: "Convert PNG images to more compact JPG format.",
    category: "convert",
    keywords: ["png to jpg", "convert png", "png to jpeg"],
    icon: FileImage,
    shortUseCases: ["Smaller file sizes", "Web publishing", "Photo storage"],
    relatedTools: ["heic-to-jpg", "webp-to-jpg", "jpg-to-pdf", "compress-image", "resize-image"],
  },
  {
    title: "JPG to PDF",
    slug: "jpg-to-pdf",
    href: "/jpg-to-pdf",
    description: "Convert your JPG images into a single PDF document.",
    category: "pdf",
    keywords: ["jpg to pdf", "image to pdf", "convert to pdf", "make pdf from images"],
    icon: FileText,
    shortUseCases: ["Scan documents", "Receipt archiving", "Portfolio creation"],
    relatedTools: ["heic-to-jpg", "webp-to-jpg", "png-to-jpg", "compress-image", "resize-image", "remove-exif"],
  },
  {
    title: "Remove EXIF",
    slug: "remove-exif",
    href: "/remove-exif",
    description: "Strip hidden metadata from your images to protect your privacy.",
    category: "privacy",
    keywords: ["remove exif", "remove metadata", "strip photo data", "privacy tool"],
    icon: Scan,
    shortUseCases: ["Privacy protection", "Remove GPS location", "Clean photos for sharing"],
    relatedTools: ["compress-image", "resize-image", "jpg-to-pdf"],
  },
]

export const categories: { key: ToolCategory; label: string }[] = [
  { key: "pdf", label: "PDF" },
  { key: "compress", label: "Compress" },
  { key: "resize", label: "Resize" },
  { key: "convert", label: "Convert" },
  { key: "privacy", label: "Privacy" },
]

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug)
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getToolBySlug(slug)
  if (!tool) return []
  return tools.filter((t) => t.slug !== slug)
}

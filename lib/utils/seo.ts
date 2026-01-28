import type { SEOMetadata } from '@/types/seo.types'

export function generateSEOMetadata({
  title,
  description,
  canonical,
  noindex = false,
  nofollow = false,
}: SEOMetadata) {
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: !noindex,
      follow: !nofollow,
    },
  }
}

export function truncateDescription(text: string | null, maxLength = 160): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

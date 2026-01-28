import { Metadata } from 'next'
import type { SEOMetadata } from '@/types/seo.types'

export function generateMetaTags(seo: SEOMetadata): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    robots: {
      index: !seo.noindex,
      follow: !seo.nofollow,
    },
  }
}

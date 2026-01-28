import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

type SitemapEntry = {
  slug: string
  updated_at: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Get all active products
  const { data: products } = await supabase
    .from('catalog_products')
    .select('slug, updated_at')
    .eq('is_active', true)
    .eq('noindex', false)

  // Get all active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true)
    .eq('noindex', false)

  // Get all active brands
  const { data: brands } = await supabase
    .from('brands')
    .select('slug, updated_at')
    .eq('is_active', true)
    .eq('noindex', false)

  const productUrls = (products as SitemapEntry[] | null)?.map((product) => ({
    url: `${baseUrl}/urunler/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  const categoryUrls = (categories as SitemapEntry[] | null)?.map((category) => ({
    url: `${baseUrl}/kategoriler/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  const brandUrls = (brands as SitemapEntry[] | null)?.map((brand) => ({
    url: `${baseUrl}/markalar/${brand.slug}`,
    lastModified: new Date(brand.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kategoriler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/markalar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...productUrls,
    ...categoryUrls,
    ...brandUrls,
  ]
}

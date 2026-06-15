import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getBrandBySlug } from '@/lib/supabase/queries/brands'
import { getProductsByBrandWithOffers } from '@/lib/supabase/queries/products'
import { getAllCategories } from '@/lib/supabase/queries/categories'
import { getBrands } from '@/lib/supabase/queries/brands'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { BrandProductsClient } from '@/components/catalog/brand-products-client'

interface BrandPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params
  const brand = await getBrandBySlug(slug)
  
  if (!brand) return {}

  return {
    title: brand.seo_title || `${brand.name} - Dent Alışveriş`,
    description: brand.seo_description || `${brand.name} markalı diş hekimliği ürünlerini keşfedin`,
    alternates: {
      canonical: brand.canonical_url || `/markalar/${brand.slug}`,
    },
    robots: {
      index: !brand.noindex,
      follow: !brand.noindex,
    },
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params
  const brand = await getBrandBySlug(slug)
  
  if (!brand) notFound()

  const [products, categories, brands] = await Promise.all([
    getProductsByBrandWithOffers(brand.id, 100, 0),
    getAllCategories(),
    getBrands(),
  ])

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Markalar', href: '/markalar' },
    { label: brand.name, href: `/markalar/${brand.slug}` },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-primary">{brand.name}</h1>
        <p className="mt-2 text-text-secondary">
          {brand.name} markalı ürünleri keşfedin
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-text-secondary">Ürünler yükleniyor…</div>
          }
        >
          <BrandProductsClient 
            products={products}
            categories={categories}
            brands={brands}
            currentBrandId={brand.id}
          />
        </Suspense>
      </div>
    </div>
  )
}

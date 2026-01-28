import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBrandBySlug } from '@/lib/supabase/queries/brands'
import { getProductsByBrand } from '@/lib/supabase/queries/products'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { ProductGrid } from '@/components/catalog/product-grid'

interface BrandPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params
  const brand = await getBrandBySlug(slug)
  
  if (!brand) return {}

  return {
    title: brand.seo_title || `${brand.name} - Dental Market`,
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

  const products = await getProductsByBrand(brand.id, 20, 0)

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Markalar', href: '/markalar' },
    { label: brand.name, href: `/markalar/${brand.slug}` },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-8">
        <h1 className="text-4xl font-bold">{brand.name}</h1>
        <p className="mt-2 text-gray-600">
          {brand.name} markalı ürünleri keşfedin
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Ürünler</h2>
        <div className="mt-4">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}

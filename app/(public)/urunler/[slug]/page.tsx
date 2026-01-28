import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/supabase/queries/products'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { Badge } from '@/components/ui/badge'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) return {}

  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.short_description,
    alternates: {
      canonical: product.canonical_url || `/urunler/${product.slug}`,
    },
    robots: {
      index: !product.noindex,
      follow: !product.noindex,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) notFound()

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Ürünler', href: '/urunler' },
    { label: product.name, href: `/urunler/${product.slug}` },
  ]

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand.name,
    } : undefined,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            {product.brand && (
              <div className="mt-2">
                <Badge variant="secondary">{product.brand.name}</Badge>
              </div>
            )}
          </div>
          {product.sku && (
            <div className="text-right">
              <p className="text-sm text-gray-500">SKU</p>
              <p className="font-mono text-sm">{product.sku}</p>
            </div>
          )}
        </div>

        {product.short_description && (
          <p className="mt-4 text-xl text-gray-600">{product.short_description}</p>
        )}

        {product.description && (
          <div className="mt-8 prose max-w-none">
            <h2 className="text-2xl font-bold">Ürün Açıklaması</h2>
            <p className="mt-4 text-gray-700">{product.description}</p>
          </div>
        )}

        {product.manufacturer_code && (
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Üretici Kodu: <span className="font-mono">{product.manufacturer_code}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

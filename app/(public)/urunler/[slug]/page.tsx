import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getProductsByCategory } from '@/lib/supabase/queries/products'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { ProductDetailClient } from '@/components/product'
import { RelatedProducts } from '@/components/product'
import { ProductReviews } from '@/components/reviews'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { formatPrice } from '@/lib/utils/format'
import { siteConfig } from '@/lib/constants/site-config'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) return {}

  const imageUrl = getImageUrl(product.primary_image)
  const title = product.seo_title || `${product.name} | ${siteConfig.name}`
  const description = product.seo_description || product.short_description || product.description?.slice(0, 160) || ''

  return {
    title,
    description,
    alternates: {
      canonical: product.canonical_url || `/urunler/${product.slug}`,
    },
    robots: {
      index: !product.noindex,
      follow: !product.noindex,
    },
    openGraph: {
      title: product.seo_title || product.name,
      description,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      type: 'website',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo_title || product.name,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) notFound()

  // Benzer ürünleri çek (aynı kategoriden)
  let relatedProducts: Awaited<ReturnType<typeof getProductsByCategory>> = []
  if (product.primary_category_id) {
    relatedProducts = await getProductsByCategory(product.primary_category_id, 5)
  }

  // Breadcrumb öğeleri
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    ...(product.category ? [{ 
      label: product.category.name, 
      href: `/kategoriler/${product.category.slug}` 
    }] : [{ 
      label: 'Ürünler', 
      href: '/urunler' 
    }]),
    { label: product.name, href: `/urunler/${product.slug}` },
  ]

  // Schema.org yapılandırılmış veri
  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short_description || '',
    image: getImageUrl(product.primary_image),
    sku: product.sku,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand.name,
    } : undefined,
    category: product.category?.name,
  }

  // Fiyat ve stok bilgisi varsa offers ekle
  if (product.price) {
    productSchema.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'TRY',
      availability: product.stock_quantity !== null && product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Yapılandırılmış Veri */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Breadcrumb */}
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Ürün Detay - Client Component */}
      <div className="mt-8">
        <ProductDetailClient product={product} />
      </div>

      {/* Sekmeler: Açıklama, Özellikler, Kargo */}
      <ProductTabs description={product.description} />

      {/* Ürün İncelemeleri */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Müşteri Yorumları</h2>
        <ProductReviews productId={product.id} />
      </div>

      {/* Benzer Ürünler */}
      <RelatedProducts 
        products={relatedProducts} 
        currentProductId={product.id} 
      />
    </div>
  )
}

/* ─── Tabs Bileşeni (Server Component) ─── */

function ProductTabs({ description }: { description: string | null }) {
  return (
    <div className="mt-12">
      {/* Tab panellerini statik render et, client tarafında tab switching yapılabilir */}
      <ProductTabsClient description={description} />
    </div>
  )
}

/* Tabs client wrapper - aşağıda import edilen bileşen */
import { ProductTabsClient } from '@/components/product/ProductTabsClient'

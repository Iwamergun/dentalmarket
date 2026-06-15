import { Metadata } from 'next'
import { Suspense } from 'react'
import { getProductsWithOffers } from '@/lib/supabase/queries/products'
import { getAllCategories } from '@/lib/supabase/queries/categories'
import { getBrands } from '@/lib/supabase/queries/brands'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { ProductsClient } from '@/components/catalog/products-client'

export const metadata: Metadata = {
  title: 'Ürünler - Dent Alışveriş',
  description: 'Diş hekimliği ürünlerini keşfedin',
}

export default async function ProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getProductsWithOffers(100, 0),
    getAllCategories(),
    getBrands(),
  ])

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Ürünler', href: '/urunler' },
  ]

  return (
    <div className="container-main bg-background py-4 sm:py-8">
      <div className="hidden sm:block">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      
      <div className="mt-2 sm:mt-8">
        <h1 className="text-2xl font-bold text-primary sm:text-4xl">Ürünler</h1>
        <p className="mt-1 text-sm text-text-secondary sm:mt-2 sm:text-base">
          Diş hekimliği için ihtiyacınız olan tüm ürünleri keşfedin
        </p>
      </div>

      <div className="mt-4 sm:mt-8">
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-text-secondary">Ürünler yükleniyor…</div>
          }
        >
          <ProductsClient products={products} categories={categories} brands={brands} />
        </Suspense>
      </div>
    </div>
  )
}

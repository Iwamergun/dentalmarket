import { Metadata } from 'next'
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
    <div className="container-main py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-primary">Ürünler</h1>
        <p className="mt-2 text-text-secondary">
          Diş hekimliği için ihtiyacınız olan tüm ürünleri keşfedin
        </p>
      </div>

      <div className="mt-8">
        <ProductsClient products={products} categories={categories} brands={brands} />
      </div>
    </div>
  )
}

import { Metadata } from 'next'
import { ProductGrid } from '@/components/catalog/product-grid'
import { getProducts } from '@/lib/supabase/queries/products'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Ürünler - Dental Market',
  description: 'Diş hekimliği ürünlerini keşfedin',
}

export default async function ProductsPage() {
  const products = await getProducts(20, 0)

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Ürünler', href: '/urunler' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-8">
        <h1 className="text-4xl font-bold">Ürünler</h1>
        <p className="mt-2 text-gray-600">
          Diş hekimliği için ihtiyacınız olan tüm ürünleri keşfedin
        </p>
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}

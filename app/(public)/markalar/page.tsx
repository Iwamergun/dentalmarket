import { Metadata } from 'next'
import { getBrands } from '@/lib/supabase/queries/brands'
import { BrandCard } from '@/components/catalog/brand-card'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Markalar - Dental Market',
  description: 'Diş hekimliği ürün markalarını keşfedin',
}

export default async function BrandsPage() {
  const brands = await getBrands()

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Markalar', href: '/markalar' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-8">
        <h1 className="text-4xl font-bold">Markalar</h1>
        <p className="mt-2 text-gray-600">
          Güvenilir markalardan ürünler keşfedin
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>

      {brands.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">Henüz marka bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}

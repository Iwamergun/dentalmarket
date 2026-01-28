import { Metadata } from 'next'
import { getRootCategories } from '@/lib/supabase/queries/categories'
import { CategoryCard } from '@/components/catalog/category-card'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Kategoriler - Dental Market',
  description: 'Diş hekimliği ürün kategorilerini keşfedin',
}

export default async function CategoriesPage() {
  const categories = await getRootCategories()

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Kategoriler', href: '/kategoriler' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-8">
        <h1 className="text-4xl font-bold">Kategoriler</h1>
        <p className="mt-2 text-gray-600">
          Ürünleri kategorilere göre inceleyin
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">Henüz kategori bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}

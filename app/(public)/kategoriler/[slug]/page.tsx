import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getChildCategories } from '@/lib/supabase/queries/categories'
import { getProductsByCategory } from '@/lib/supabase/queries/products'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { ProductGrid } from '@/components/catalog/product-grid'
import { CategoryCard } from '@/components/catalog/category-card'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) return {}

  return {
    title: category.seo_title || category.name,
    description: category.seo_description || category.description,
    alternates: {
      canonical: category.canonical_url || `/kategoriler/${category.slug}`,
    },
    robots: {
      index: !category.noindex,
      follow: !category.noindex,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) notFound()

  const [products, childCategories] = await Promise.all([
    getProductsByCategory(category.id, 20, 0),
    getChildCategories(category.id),
  ])

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Kategoriler', href: '/kategoriler' },
    { label: category.name, href: `/kategoriler/${category.slug}` },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-8">
        <h1 className="text-4xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
      </div>

      {childCategories.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Alt Kategoriler</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {childCategories.map((childCategory) => (
              <CategoryCard key={childCategory.id} category={childCategory} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Ürünler</h2>
        <div className="mt-4">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}

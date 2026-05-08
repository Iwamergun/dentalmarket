import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllCategories, getCategoryDescendantIds } from '@/lib/supabase/queries/categories'
import { getBrands } from '@/lib/supabase/queries/brands'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { CategoryProductsClient } from '@/components/catalog/category-products-client'
import { Category } from '@/types/catalog.types'
import { getProductsByCategoryIdsWithOffers } from '@/lib/supabase/queries/products'

// Force dynamic rendering to ensure cookies work properly
export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
  
  const category = categories?.[0] as Category | undefined
  
  if (!category) return {}

  return {
    title: category.seo_title || category.name,
    description: category.seo_description || category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  
  let supabase
  try {
    supabase = await createClient()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    notFound()
  }
  
  // Kategoriyi çek - limit(1) kullanarak duplicate slug durumunu handle et
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
  
  const category = categories?.[0] as Category | undefined
  
  if (catError || !category) {
    console.error('Category error:', catError?.message, catError?.code, catError?.details)
    notFound()
  }

  const allCategories = await getAllCategories()
  const descendantCategoryIds = getCategoryDescendantIds(allCategories, category.id)
  const relatedCategories = allCategories.filter((item) => descendantCategoryIds.includes(item.id))

  const [products, brands] = await Promise.all([
    getProductsByCategoryIdsWithOffers(descendantCategoryIds, 100, 0),
    getBrands(),
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
        <h1 className="text-4xl font-bold text-primary">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-text-secondary">{category.description}</p>
        )}
      </div>

      <div className="mt-8">
        <CategoryProductsClient 
          products={products}
          categories={relatedCategories}
          brands={brands}
          currentCategoryId={category.id}
        />
      </div>
    </div>
  )
}
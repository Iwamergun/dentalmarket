import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllCategories } from '@/lib/supabase/queries/categories'
import { getBrands } from '@/lib/supabase/queries/brands'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { CategoryProductsClient } from '@/components/catalog/category-products-client'
import { Category, Product } from '@/types/catalog.types'

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

  // Ürünleri çek (basit query)
  const { data: productsData } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('primary_category_id', category.id)
    .eq('is_active', true)
    .limit(100)

  const products = (productsData || []) as Product[]

  // Fetch all categories and brands for filters
  const [allCategories, brands] = await Promise.all([
    getAllCategories(),
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
          categories={allCategories}
          brands={brands}
          currentCategoryId={category.id}
        />
      </div>
    </div>
  )
}
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { ProductImageCard } from '@/components/catalog/product-image-card'
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
  const { data: productsData, error: prodError } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('primary_category_id', category.id)
    .eq('is_active', true)
    .limit(20)

  const products = (productsData || []) as Product[]

  console.log('Category:', category.name)
  console.log('Products count:', products.length)
  console.log('Products error:', prodError)
  console.log('Products data:', JSON.stringify(products, null, 2))

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

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Ürünler ({products?.length || 0})</h2>
        
        {products && products.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductImageCard 
                key={product.id} 
                product={product} 
                href={`/urunler/${product.slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">Henüz ürün bulunmamaktadır.</p>
        )}
      </div>
    </div>
  )
}
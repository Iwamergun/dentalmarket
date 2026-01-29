import { createClient } from '@/lib/supabase/server'
import { Product, ProductWithRelations } from '@/types/catalog.types'

export async function getProducts(limit = 20, offset = 0): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return []
  }

  return data || []
}

export async function getProductsByCategory(categoryId: string, limit = 20, offset = 0): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_products')
    .select('*')  // ← Basitleştir, ilişkileri kaldır
    .eq('primary_category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by category:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return []
  }

  console.log('Products found:', data?.length)  // ← Debug log ekle
  return data || []
}

export async function getProductsByBrand(brandId: string, limit = 20, offset = 0): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by brand:', error)
    return []
  }

  return (data || []) as Product[]
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient()

  // Önce ürünü çek
  const { data, error: productError } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (productError) {
    console.error('Error fetching product by slug:', productError.message)
    return null
  }

  if (!data) return null

  const product = data as Product

  // Brand bilgisini ayrı çek (eğer brand_id varsa)
  let brand = null
  if (product.brand_id) {
    const { data: brandData } = await supabase
      .from('brands')
      .select('id, name, slug')
      .eq('id', product.brand_id)
      .single()
    brand = brandData
  }

  // Category bilgisini ayrı çek (eğer primary_category_id varsa)
  let category = null
  if (product.primary_category_id) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('id', product.primary_category_id)
      .single()
    category = categoryData
  }

  return {
    ...product,
    brand,
    category,
  } as ProductWithRelations
}
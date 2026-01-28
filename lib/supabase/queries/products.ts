import { createClient } from '../server'
import type { ProductWithRelations } from '@/types/catalog.types'

export async function getProducts(limit = 20, offset = 0) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('catalog_products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*)
    `)
    .eq('is_active', true)
    .eq('noindex', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as ProductWithRelations[]
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('catalog_products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as ProductWithRelations
}

export async function getProductsByCategory(categoryId: string, limit = 20, offset = 0) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('catalog_products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*)
    `)
    .eq('primary_category_id', categoryId)
    .eq('is_active', true)
    .eq('noindex', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by category:', error)
    return []
  }

  return data as ProductWithRelations[]
}

export async function getProductsByBrand(brandId: string, limit = 20, offset = 0) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('catalog_products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*)
    `)
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .eq('noindex', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by brand:', error)
    return []
  }

  return data as ProductWithRelations[]
}

import { createClient } from '../server'
import type { Brand } from '@/types/catalog.types'

export async function getBrands() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data as Brand[]
}

export async function getBrandBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching brand:', error)
    return null
  }

  return data as Brand
}

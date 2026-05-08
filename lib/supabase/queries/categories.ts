import { createClient } from '@/lib/supabase/server'
import { Category } from '@/types/catalog.types'

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return null
  }

  return data as Category
}

export async function getChildCategories(parentId: string): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching child categories:', error)
    return []
  }

  return (data || []) as Category[]
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data || []) as Category[]
}

export async function getRootCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching root categories:', error)
    return []
  }

  return (data || []) as Category[]
}

export function getCategoryDescendantIds(categories: Category[], rootCategoryId: string): string[] {
  const childrenByParentId = new Map<string, Category[]>()

  categories.forEach((category) => {
    if (!category.parent_id) return

    const siblings = childrenByParentId.get(category.parent_id) ?? []
    siblings.push(category)
    childrenByParentId.set(category.parent_id, siblings)
  })

  const collectedIds: string[] = []
  const pendingIds = [rootCategoryId]

  while (pendingIds.length > 0) {
    const categoryId = pendingIds.shift()
    if (!categoryId || collectedIds.includes(categoryId)) continue

    collectedIds.push(categoryId)

    const children = childrenByParentId.get(categoryId) ?? []
    children.forEach((child) => pendingIds.push(child.id))
  }

  return collectedIds
}
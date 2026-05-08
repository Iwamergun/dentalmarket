import { describe, expect, it } from 'vitest'
import { getCategoryDescendantIds } from '@/lib/supabase/queries/categories'
import type { Category } from '@/types/catalog.types'

const categories: Category[] = [
  {
    id: 'root',
    parent_id: null,
    name: 'Kok',
    slug: 'kok',
    seo_title: null,
    seo_description: null,
    canonical_url: null,
    noindex: false,
    description: null,
    depth: 1,
    path: 'kok',
    sort_order: 0,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'child-a',
    parent_id: 'root',
    name: 'Alt A',
    slug: 'alt-a',
    seo_title: null,
    seo_description: null,
    canonical_url: null,
    noindex: false,
    description: null,
    depth: 2,
    path: 'kok/alt-a',
    sort_order: 0,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'child-b',
    parent_id: 'child-a',
    name: 'Alt B',
    slug: 'alt-b',
    seo_title: null,
    seo_description: null,
    canonical_url: null,
    noindex: false,
    description: null,
    depth: 3,
    path: 'kok/alt-a/alt-b',
    sort_order: 0,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

describe('getCategoryDescendantIds', () => {
  it('kok kategoriyi ve tum alt kategorilerini dondurur', () => {
    expect(getCategoryDescendantIds(categories, 'root')).toEqual(['root', 'child-a', 'child-b'])
  })
})
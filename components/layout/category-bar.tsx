'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Category } from '@/types/catalog.types'

export function CategoryBar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(8)

      setCategories((data || []) as Category[])
      setIsLoading(false)
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <nav className="hidden lg:block bg-gradient-to-r from-primary/5 to-secondary/5 border-b-2 border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 w-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="hidden lg:block bg-gradient-to-r from-primary/5 to-secondary/5 border-b-2 border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategoriler/${category.slug}`}
              className="relative shrink-0 px-4 py-2 text-sm font-medium text-secondary-text hover:text-secondary hover:bg-white rounded-xl transition-all duration-200 group"
            >
              {category.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-full rounded-full" />
            </Link>
          ))}
          <Link
            href="/kategoriler"
            className="relative shrink-0 px-4 py-2 text-sm text-accent hover:text-accent/80 transition-all duration-200 font-bold group"
          >
            Tüm Kategoriler →
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-warning transition-all duration-200 group-hover:w-full rounded-full" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

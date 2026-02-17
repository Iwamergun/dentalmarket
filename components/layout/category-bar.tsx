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
      <nav className="hidden lg:block bg-gradient-to-r from-background to-background-elevated border-b-2 border-border shadow-sm">
        <div className="container-main">
          <div className="flex items-center gap-2 h-14 overflow-x-auto scrollbar-hide">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-28 bg-background-elevated rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="hidden lg:block bg-gradient-to-r from-white via-background to-white border-b-2 border-border shadow-sm">
      <div className="container-main">
        <div className="flex items-center gap-2 h-14 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategoriler/${category.slug}`}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-text-secondary hover:text-accent hover:bg-accent/10 font-semibold transition-all duration-300 whitespace-nowrap border-2 border-transparent hover:border-accent/20 transform hover:scale-105"
            >
              <span>{category.name}</span>
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
          <Link
            href="/kategoriler"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-bold transition-all duration-300 whitespace-nowrap hover:shadow-glow-accent transform hover:scale-105"
          >
            <span>Tümü</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  )
}

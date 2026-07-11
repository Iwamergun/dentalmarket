'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

interface SortSelectProps {
  className?: string
}

export function SortSelect({ className }: SortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = (searchParams.get('sort') as SortOption) || 'newest'

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    const newSort = e.target.value
    
    if (newSort === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', newSort)
    }
    
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <select 
      value={currentSort}
      onChange={handleSortChange}
      className={cn(
        'h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors duration-200 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20',
        className
      )}
    >
      <option value="newest">En Yeni</option>
      <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
      <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
      <option value="name-asc">İsim: A-Z</option>
      <option value="name-desc">İsim: Z-A</option>
    </select>
  )
}

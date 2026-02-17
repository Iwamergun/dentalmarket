'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

interface SortSelectProps {
  className?: string
}

export function SortSelect({ className }: SortSelectProps) {
  const router = useRouter()
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
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <select 
      value={currentSort}
      onChange={handleSortChange}
      className="rounded-md border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
    >
      <option value="newest">En Yeni</option>
      <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
      <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
      <option value="name-asc">İsim: A-Z</option>
      <option value="name-desc">İsim: Z-A</option>
    </select>
  )
}

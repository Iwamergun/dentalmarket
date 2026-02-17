'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Star, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Category, Brand } from '@/types/catalog.types'

interface FilterSidebarProps {
  categories?: Category[]
  brands?: Brand[]
  className?: string
  selectedCategoryId?: string
  selectedBrandId?: string
}

export function FilterSidebar({
  categories = [],
  brands = [],
  className,
  selectedCategoryId,
  selectedBrandId,
}: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current filters from URL
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(() => {
    const cat = searchParams.get('category')
    return cat ? cat.split(',') : selectedCategoryId ? [selectedCategoryId] : []
  })
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>(() => {
    const brand = searchParams.get('brand')
    return brand ? brand.split(',') : selectedBrandId ? [selectedBrandId] : []
  })
  const [minPrice, setMinPrice] = React.useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get('maxPrice') || '')
  const [minRating, setMinRating] = React.useState(searchParams.get('minRating') || '')
  const [inStockOnly, setInStockOnly] = React.useState(searchParams.get('inStock') === 'true')

  // Apply filters
  const applyFilters = React.useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Remove old filters
    params.delete('category')
    params.delete('brand')
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('minRating')
    params.delete('inStock')

    // Add new filters - support multiple categories and brands
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','))
    }
    if (selectedBrands.length > 0) {
      params.set('brand', selectedBrands.join(','))
    }
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minRating) params.set('minRating', minRating)
    if (inStockOnly) params.set('inStock', 'true')

    router.push(`?${params.toString()}`, { scroll: false })
  }, [selectedCategories, selectedBrands, minPrice, maxPrice, minRating, inStockOnly, router, searchParams])

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories(selectedCategoryId ? [selectedCategoryId] : [])
    setSelectedBrands(selectedBrandId ? [selectedBrandId] : [])
    setMinPrice('')
    setMaxPrice('')
    setMinRating('')
    setInStockOnly(false)
    router.push(window.location.pathname, { scroll: false })
  }

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedBrands.length > 0 || 
    minPrice || 
    maxPrice || 
    minRating || 
    inStockOnly

  return (
    <div className={cn('space-y-6', className)}>
      {/* Categories */}
      {categories.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-primary">Kategoriler</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    setSelectedCategories(
                      checked
                        ? [...selectedCategories, category.id]
                        : selectedCategories.filter((id) => id !== category.id)
                    )
                  }}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className={cn(
                    'cursor-pointer text-text-secondary hover:text-primary',
                    selectedCategories.includes(category.id) && 'font-semibold text-primary'
                  )}
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <h3 className="mb-4 text-sm font-bold text-primary">Fiyat Aralığı</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
                ₺
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="pl-8 bg-white text-text-primary"
              />
            </div>
            <span className="text-text-secondary">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
                ₺
              </span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-8 bg-white text-text-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-primary">Markalar</h3>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={(checked) => {
                    setSelectedBrands(
                      checked
                        ? [...selectedBrands, brand.id]
                        : selectedBrands.filter((id) => id !== brand.id)
                    )
                  }}
                />
                <Label
                  htmlFor={`brand-${brand.id}`}
                  className={cn(
                    'cursor-pointer text-text-secondary hover:text-primary',
                    selectedBrands.includes(brand.id) && 'font-semibold text-primary'
                  )}
                >
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <h3 className="mb-4 text-sm font-bold text-primary">Değerlendirme</h3>
        <div className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === String(rating) ? '' : String(rating))}
              className={cn(
                'flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left transition-colors',
                'hover:bg-background-deep',
                minRating === String(rating) && 'bg-secondary/10'
              )}
            >
              <div className="flex items-center">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
                {Array.from({ length: 5 - rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-border" />
                ))}
              </div>
              <span className="text-sm text-text-secondary">ve üzeri</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={setInStockOnly}
          />
          <Label htmlFor="in-stock" className="cursor-pointer text-text-secondary">
            Sadece stokta olanlar
          </Label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={applyFilters}
          className="w-full bg-secondary hover:bg-secondary-dark"
          size="lg"
        >
          Filtreleri Uygula
        </Button>
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <X className="mr-2 h-4 w-4" />
            Filtreleri Temizle
          </Button>
        )}
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Star, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Category, Brand } from '@/types/catalog.types'

const CATEGORY_INITIAL_COUNT = 10

interface FilterSidebarProps {
  categories?: Category[]
  brands?: Brand[]
  className?: string
  selectedCategoryId?: string
  selectedBrandId?: string
  applyPath?: string
}

export function FilterSidebar({
  categories = [],
  brands = [],
  className,
  selectedCategoryId,
  selectedBrandId,
  applyPath,
}: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedCategoryDefaults = React.useMemo(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      return categoryParam.split(',').filter(Boolean)
    }

    return selectedCategoryId ? [selectedCategoryId] : []
  }, [searchParams, selectedCategoryId])

  const selectedBrandDefaults = React.useMemo(() => {
    const brandParam = searchParams.get('brand')
    if (brandParam) {
      return brandParam.split(',').filter(Boolean)
    }

    return selectedBrandId ? [selectedBrandId] : []
  }, [searchParams, selectedBrandId])

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(selectedCategoryDefaults)
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>(selectedBrandDefaults)
  const [minPrice, setMinPrice] = React.useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get('maxPrice') || '')
  const [minRating, setMinRating] = React.useState(searchParams.get('minRating') || '')
  const [inStockOnly, setInStockOnly] = React.useState(searchParams.get('inStock') === 'true')
  const [showAllCategories, setShowAllCategories] = React.useState(false)

  React.useEffect(() => {
    setSelectedCategories(selectedCategoryDefaults)
    setSelectedBrands(selectedBrandDefaults)
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
    setMinRating(searchParams.get('minRating') || '')
    setInStockOnly(searchParams.get('inStock') === 'true')
  }, [searchParams, selectedBrandDefaults, selectedCategoryDefaults])

  // Apply filters
  const applyFilters = React.useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    const targetPath = applyPath || pathname
    
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

    const query = params.toString()
    router.push(query ? `${targetPath}?${query}` : targetPath, { scroll: false })
  }, [applyPath, inStockOnly, maxPrice, minPrice, minRating, pathname, router, searchParams, selectedBrands, selectedCategories])

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories(selectedCategoryId ? [selectedCategoryId] : [])
    setSelectedBrands(selectedBrandId ? [selectedBrandId] : [])
    setMinPrice('')
    setMaxPrice('')
    setMinRating('')
    setInStockOnly(false)
    router.push(applyPath || pathname, { scroll: false })
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
            {[...categories]
              .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
              .slice(0, showAllCategories ? undefined : CATEGORY_INITIAL_COUNT)
              .map((category) => (
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
                    style={{ paddingLeft: `${Math.max(category.depth - 1, 0) * 12}px` }}
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
          </div>
          {categories.length > CATEGORY_INITIAL_COUNT && (
            <button
              type="button"
              onClick={() => setShowAllCategories((prev) => !prev)}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary-dark transition-colors"
            >
              {showAllCategories ? (
                <>
                  <svg className="h-3.5 w-3.5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Daha az göster
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {categories.length - CATEGORY_INITIAL_COUNT} kategori daha göster
                </>
              )}
            </button>
          )}
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

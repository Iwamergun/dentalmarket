'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Filter, Minus, Plus, Star, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

/**
 * Açılır-kapanır filtre bölümü (Tailwind Disclosure tasarımının
 * lucide-react ile yeniden yazılmış hâli).
 */
interface FilterSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

function FilterSection({ title, defaultOpen = true, children, className }: FilterSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div className={cn('border-b border-border py-6', className)}>
      <h3 className="-my-3 flow-root">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="group flex w-full items-center justify-between py-3 text-sm text-text-secondary transition-colors hover:text-primary"
          aria-expanded={open}
        >
          <span className="text-sm font-bold text-primary">{title}</span>
          <span className="ml-6 flex items-center">
            {open ? (
              <Minus className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Plus className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </button>
      </h3>
      {open && <div className="pt-6">{children}</div>}
    </div>
  )
}

/**
 * Mobil filtre dialog'u (Tailwind Dialog/DialogPanel tasarımının
 * Headless UI olmadan, kendi state'imizle yeniden yazılmış hâli).
 * Sağdan kayarak açılan tam yükseklikli panel.
 */
interface MobileFilterDialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

function MobileFilterDialog({ open, onClose, children }: MobileFilterDialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // ESC ile kapatma
  React.useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <div
      className={cn('relative z-40 lg:hidden', !open && 'pointer-events-none')}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-40 flex">
        {/* Panel */}
        <div
          className={cn(
            'relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-6 shadow-xl transition duration-300 ease-in-out',
            open ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <h2 className="text-lg font-bold text-primary">Filtreler</h2>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-text-secondary transition-colors hover:bg-background-deep hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <span className="sr-only">Menüyü kapat</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="px-4 pt-2">{children}</div>
        </div>
      </div>
    </div>
  )
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

  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)

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
    setMobileFiltersOpen(false)
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

  // Asıl filtre içeriği (hem masaüstü sidebar'da hem mobil dialog'da kullanılır)
  const filterContent = (
    <>
      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection title="Kategoriler">
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
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary-dark"
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
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {categories.length - CATEGORY_INITIAL_COUNT} kategori daha göster
                </>
              )}
            </button>
          )}
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Fiyat Aralığı">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">₺</span>
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="bg-white pl-8 text-text-primary"
            />
          </div>
          <span className="text-text-secondary">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">₺</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="bg-white pl-8 text-text-primary"
            />
          </div>
        </div>
      </FilterSection>

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title="Markalar">
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
        </FilterSection>
      )}

      {/* Rating Filter */}
      <FilterSection title="Değerlendirme">
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
      </FilterSection>

      {/* Stock Status */}
      <FilterSection title="Stok Durumu" defaultOpen={false}>
        <div className="flex items-center space-x-2">
          <Checkbox id="in-stock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
          <Label htmlFor="in-stock" className="cursor-pointer text-text-secondary">
            Sadece stokta olanlar
          </Label>
        </div>
      </FilterSection>

      {/* Action Buttons */}
      <div className="space-y-3 py-6">
        <Button
          onClick={applyFilters}
          className="h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          size="md"
        >
          Filtreleri Uygula
        </Button>
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="outline"
            className="h-11 w-full rounded-xl border-border bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            size="md"
          >
            <X className="mr-2 h-4 w-4" />
            Filtreleri Temizle
          </Button>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobil filtre butonu (yalnızca küçük ekranlarda görünür) */}
      <div className="lg:hidden">
        <Button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          variant="outline"
          className="h-11 w-full rounded-xl border-border bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          size="md"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtreler
          {hasActiveFilters && <span className="ml-2 h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />}
        </Button>
      </div>

      {/* Mobil filtre dialog'u */}
      <MobileFilterDialog open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        {filterContent}
      </MobileFilterDialog>

      {/* Masaüstü sidebar (büyük ekranlarda görünür) */}
      <div className={cn('hidden rounded-2xl border border-border bg-white px-6 shadow-card lg:block', className)}>
        {filterContent}
      </div>
    </>
  )
}

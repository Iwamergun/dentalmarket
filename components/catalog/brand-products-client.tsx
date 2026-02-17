'use client'

import * as React from 'react'
import { useState } from 'react'
import { Filter } from 'lucide-react'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { ProductGrid } from '@/components/catalog/product-grid'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { Category, Brand, ProductWithRelations } from '@/types/catalog.types'

interface BrandProductsClientProps {
  products: ProductWithRelations[]
  categories: Category[]
  brands: Brand[]
  currentBrandId: string
}

export function BrandProductsClient({ 
  products, 
  categories, 
  brands, 
  currentBrandId 
}: BrandProductsClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block">
        <div className="sticky top-[120px]">
          <FilterSidebar 
            categories={categories} 
            brands={brands} 
            selectedBrandId={currentBrandId}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Mobile Filter Button and Sorting */}
        <div className="flex items-center justify-between">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="md">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrele
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
                <SheetHeader className="px-6 py-4">
                  <SheetTitle>Filtreler</SheetTitle>
                </SheetHeader>
                <div className="px-6 pb-6">
                  <FilterSidebar 
                    categories={categories} 
                    brands={brands}
                    selectedBrandId={currentBrandId}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Count */}
          <div className="text-sm text-text-secondary">
            <span className="font-semibold text-primary">{products.length}</span> ürün bulundu
          </div>

          {/* Sorting */}
          <div className="hidden sm:block">
            <select className="rounded-md border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20">
              <option value="newest">En Yeni</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="name-asc">İsim: A-Z</option>
              <option value="name-desc">İsim: Z-A</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  )
}

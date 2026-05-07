'use client'

import * as React from 'react'
import { ArrowRight, Filter } from 'lucide-react'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { Brand, Category } from '@/types/catalog.types'

interface HomeCatalogFilterProps {
  categories: Category[]
  brands: Brand[]
}

export function HomeCatalogFilter({ categories, brands }: HomeCatalogFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0">
      <div className="lg:hidden">
        <div className="rounded-[28px] border border-border bg-white/90 p-5 shadow-card backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Hizli Katalog</p>
          <h2 className="mt-2 text-2xl font-bold text-primary">Filtreleyip urun listesine gecin</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Kategori, marka ve fiyat secip dogrudan urunler sayfasinda sonuclari gorun.
          </p>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="mt-4 w-full bg-secondary hover:bg-secondary-dark" size="lg">
                <Filter className="mr-2 h-4 w-4" />
                Filtreleri Ac
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto p-0 sm:w-[380px]">
              <SheetHeader className="px-6 py-5">
                <SheetTitle>Urun Arama</SheetTitle>
                <SheetDescription>Secimlerini yap, sonucu urunler sayfasinda ac.</SheetDescription>
              </SheetHeader>
              <div className="px-6 pb-6">
                <FilterSidebar categories={categories} brands={brands} applyPath="/urunler" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-[132px] space-y-4">
          <div className="rounded-[32px] border border-primary/10 bg-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Hizli Katalog</p>
            <h2 className="mt-2 text-2xl font-bold text-primary">Dogru urune daha hizli ulasin</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Ana sayfada filtreyi bir on izleme gibi kullanin; uyguladiginiz secimler sizi dogrudan urunler listesine tasir.
            </p>
          </div>

          <FilterSidebar categories={categories} brands={brands} applyPath="/urunler" />
        </div>
      </aside>
    </div>
  )
}
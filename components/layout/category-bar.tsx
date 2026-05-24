'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import type { Category } from '@/types/catalog.types'

interface CategoryWithChildren extends Category {
  children: Category[]
}

export function CategoryBar() {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [dropdownLeft, setDropdownLeft] = useState(0)

  const navRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLElement>>(new Map())
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      const all = (data || []) as Category[]
      const roots = all.filter((c) => !c.parent_id)

      setCategories(
        roots.map((root) => ({
          ...root,
          children: all
            .filter((c) => c.parent_id === root.id)
            .sort((a, b) => a.name.localeCompare(b.name, 'tr')),
        }))
      )
      setIsLoading(false)
    }

    fetchCategories()
  }, [])

  const openDropdown = useCallback((id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)

    const btn = buttonRefs.current.get(id)
    const nav = navRef.current
    if (btn && nav) {
      const btnRect = btn.getBoundingClientRect()
      const navRect = nav.getBoundingClientRect()
      setDropdownLeft(btnRect.left - navRect.left)
    }

    setHoveredId(id)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setHoveredId(null), 150)
  }, [])

  const cancelClose = useCallback((id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setHoveredId(id)
  }, [])

  const scrollCategories = useCallback((direction: 'left' | 'right') => {
    const scroller = scrollRef.current
    if (!scroller) return

    const scrollAmount = Math.max(scroller.clientWidth * 0.75, 240)
    scroller.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    })
  }, [])

  const hoveredCategory = hoveredId ? categories.find((c) => c.id === hoveredId) : null

  if (isLoading) {
    return (
      <nav className="mx-2 mt-2 hidden rounded-[1.5rem] border border-border/60 bg-white/70 backdrop-blur-xl lg:block md:mx-4">
        <div className="container-main">
          <div className="flex items-center gap-1 h-12">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-6 w-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </nav>
    )
  }

  return (
    /* position:relative + z-40 → stacking context above <main> so dropdown renders on top */
    <nav
      ref={navRef}
      className="relative z-40 mx-2 mt-2 hidden overflow-x-clip rounded-[1.5rem] border border-border/60 bg-white/66 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:block md:mx-4"
    >
      <div className="container-main">
        <div className="flex w-full items-center gap-2 py-1">
          <button
            type="button"
            aria-label="Kategorileri sola kaydır"
            onClick={() => scrollCategories('left')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-white/85 text-secondary shadow-sm transition-colors hover:border-secondary hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* outer wrapper handles horizontal scroll; inner track expands to full content width */}
          <div
            ref={scrollRef}
            className="min-w-0 flex-1 overflow-x-auto scroll-smooth scrollbar-hide"
          >
            <div className="inline-flex w-max min-w-full items-center gap-0.5 h-12 pr-4">
              {categories.map((category) => {
                const isOpen = hoveredId === category.id
                const hasChildren = category.children.length > 0

                return (
                  <div
                    key={category.id}
                    ref={(el) => {
                      if (el) buttonRefs.current.set(category.id, el)
                      else buttonRefs.current.delete(category.id)
                    }}
                    className="shrink-0"
                    onMouseEnter={() => openDropdown(category.id)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={`/kategoriler/${category.slug}`}
                      className={[
                        'flex items-center gap-1 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200',
                        isOpen
                          ? 'bg-white/90 text-secondary shadow-sm'
                          : 'text-secondary-text hover:bg-white/72 hover:text-secondary',
                      ].join(' ')}
                    >
                      {category.name}
                      {hasChildren && (
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </Link>
                  </div>
                )
              })}

              <div className="shrink-0 ml-3 pl-3 border-l border-primary/15">
                <Link
                  href="/kategoriler"
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-2xl border border-secondary/25 bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary transition-all duration-200 hover:bg-secondary hover:text-white"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Tüm Kategorileri Gör
                </Link>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Kategorileri sağa kaydır"
            onClick={() => scrollCategories('right')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-white/85 text-secondary shadow-sm transition-colors hover:border-secondary hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/*
        Dropdown is rendered here at <nav> level — NOT inside the overflow-x container.
        This prevents clipping. left is calculated via getBoundingClientRect().
      */}
      {hoveredCategory && hoveredCategory.children.length > 0 && (
        <div
          style={{ left: `${dropdownLeft}px` }}
          className="absolute top-full z-50 mt-2 max-h-[70vh] min-w-[230px] overflow-y-auto rounded-3xl border border-border/60 bg-white/90 py-2 shadow-2xl backdrop-blur-xl"
          onMouseEnter={() => cancelClose(hoveredCategory.id)}
          onMouseLeave={scheduleClose}
        >
          <p className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">
            {hoveredCategory.name}
          </p>
          {hoveredCategory.children.map((child) => (
            <Link
              key={child.id}
              href={`/kategoriler/${child.slug}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-secondary/8 hover:text-secondary transition-colors"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/40" />
              {child.name}
            </Link>
          ))}
          <div className="mt-1 border-t border-border pt-1">
            <Link
              href={`/kategoriler/${hoveredCategory.slug}`}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary hover:text-secondary transition-colors"
            >
              Tümünü Gör →
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

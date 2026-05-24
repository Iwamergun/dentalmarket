import Link from 'next/link'
import { Microscope, Syringe, Stethoscope, Pill, Scissors, Heart, Activity, ShoppingBag } from 'lucide-react'
import type { Category } from '@/types/catalog.types'

const categoryIcons = {
  default: ShoppingBag,
  microscope: Microscope,
  syringe: Syringe,
  stethoscope: Stethoscope,
  pill: Pill,
  scissors: Scissors,
  heart: Heart,
  activity: Activity,
}

const tones = [
  'bg-primary',
  'bg-secondary',
  'bg-accent',
  'bg-primary',
  'bg-secondary',
  'bg-accent',
  'bg-warning',
  'bg-primary',
]

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const displayCategories = categories.slice(0, 4)

  return (
    <section className="rounded-[2rem] border border-border/60 bg-white/70 px-5 py-10 shadow-subtle backdrop-blur-sm md:px-8 md:py-12">
      <div>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-text">Kategori seçkisi</p>
          <h2 className="mt-3 text-3xl font-bold text-body-text md:text-4xl">Popüler Kategoriler</h2>
          <p className="mt-3 text-base text-secondary-text md:text-lg">İhtiyacınız olan ürün gruplarına daha sade bir giriş.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {displayCategories.map((category, index) => {
            // Cycle through icons and tones
            const iconKeys = Object.keys(categoryIcons)
            const IconComponent = categoryIcons[iconKeys[index % iconKeys.length] as keyof typeof categoryIcons]
            const toneClass = tones[index % tones.length]

            return (
              <Link
                key={category.id}
                href={`/kategoriler/${category.slug}`}
                className="group rounded-2xl border border-border/60 bg-background/90 p-6 text-center shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-secondary/25 hover:shadow-premium"
              >
                <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${toneClass} text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-body-text mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-secondary-text">
                  Keşfet
                </p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/kategoriler"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-secondary/30 hover:text-secondary"
          >
            Tüm Kategorileri Gör
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

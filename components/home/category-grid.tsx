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
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-body-text mb-3">Popüler Kategoriler</h2>
          <p className="text-secondary-text text-lg">
            İhtiyacınız olan her şey burada
          </p>
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
                className="group bg-white border-2 border-border rounded-2xl p-6 text-center hover:shadow-2xl hover:border-primary/40 transition-all duration-300"
              >
                <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${toneClass} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-body-text mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-secondary-text">
                  Keşfet →
                </p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/kategoriler"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-bold text-lg transition-colors group"
          >
            Tüm Kategorileri Gör
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

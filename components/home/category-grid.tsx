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

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Use first 8 categories
  const displayCategories = categories.slice(0, 8)

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="section-title">Popüler Kategoriler</h2>
          <p className="section-subtitle">
            İhtiyacınız olan her şey burada
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category, index) => {
            // Cycle through icons
            const iconKeys = Object.keys(categoryIcons)
            const IconComponent = categoryIcons[iconKeys[index % iconKeys.length] as keyof typeof categoryIcons]

            return (
              <Link
                key={category.id}
                href={`/kategoriler/${category.slug}`}
                className="group card-base p-6 text-center transition-all duration-200 hover:border-secondary"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-200 mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1 group-hover:text-secondary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-text-muted">
                  {/* Product count would come from backend if available */}
                  Keşfet →
                </p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/kategoriler"
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary-dark font-medium transition-colors"
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

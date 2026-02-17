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

const gradients = [
  'from-primary to-secondary',
  'from-secondary to-accent',
  'from-accent to-warning',
  'from-primary to-accent',
  'from-secondary to-primary',
  'from-accent to-secondary',
  'from-warning to-accent',
  'from-primary to-warning',
]

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Use first 8 categories
  const displayCategories = categories.slice(0, 8)

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-body-text mb-3">Popüler Kategoriler</h2>
          <p className="text-secondary-text text-lg">
            İhtiyacınız olan her şey burada
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category, index) => {
            // Cycle through icons and gradients
            const iconKeys = Object.keys(categoryIcons)
            const IconComponent = categoryIcons[iconKeys[index % iconKeys.length] as keyof typeof categoryIcons]
            const gradientClass = gradients[index % gradients.length]

            return (
              <Link
                key={category.id}
                href={`/kategoriler/${category.slug}`}
                className="group bg-white border-2 border-border rounded-2xl p-6 text-center hover:shadow-2xl hover:border-primary/40 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClass} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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

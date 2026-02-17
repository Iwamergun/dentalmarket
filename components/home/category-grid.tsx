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

// Vibrant gradient colors for each category
const categoryGradients = [
  'from-accent to-accent-light',
  'from-purple to-purple-light',
  'from-teal to-teal-light',
  'from-secondary to-secondary-light',
  'from-accent to-purple',
  'from-purple to-teal',
  'from-teal to-secondary',
  'from-secondary to-accent',
]

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Use first 8 categories
  const displayCategories = categories.slice(0, 8)

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-background-elevated">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="section-title">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Popüler Kategoriler
            </span>
          </h2>
          <p className="section-subtitle">
            İhtiyacınız olan <span className="font-bold text-accent">her şey burada</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category, index) => {
            // Cycle through icons and gradients
            const iconKeys = Object.keys(categoryIcons)
            const IconComponent = categoryIcons[iconKeys[index % iconKeys.length] as keyof typeof categoryIcons]
            const gradientClass = categoryGradients[index % categoryGradients.length]

            return (
              <Link
                key={category.id}
                href={`/kategoriler/${category.slug}`}
                className="group relative card-base p-6 text-center transition-all duration-300 hover:shadow-card-hover overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon with Gradient Background */}
                <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientClass} text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}>
                  <IconComponent className="w-10 h-10" strokeWidth={2.5} />
                </div>
                
                {/* Category Name */}
                <h3 className="relative font-bold text-lg text-text-primary group-hover:text-accent transition-colors mb-2">
                  {category.name}
                </h3>
                
                {/* CTA */}
                <p className={`relative text-sm font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  Keşfet →
                </p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/kategoriler"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-accent-light text-white font-bold rounded-xl hover:shadow-glow-accent transition-all duration-300 transform hover:scale-105"
          >
            <span>Tüm Kategorileri Gör</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

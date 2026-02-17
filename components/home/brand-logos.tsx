import Link from 'next/link'
import type { Brand } from '@/types/catalog.types'

interface BrandLogosProps {
  brands: Brand[]
}

export function BrandLogos({ brands }: BrandLogosProps) {
  // Use first 12 brands
  const displayBrands = brands.slice(0, 12)

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-y-2 border-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-body-text mb-3">Güvenilir Markalar</h2>
          <p className="text-secondary-text text-lg">
            Dünya çapında tanınan markalarla çalışıyoruz
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {displayBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/markalar/${brand.slug}`}
              className="group flex items-center justify-center p-6 bg-white rounded-2xl border-2 border-border hover:border-secondary hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <span className="text-sm font-bold text-secondary-text group-hover:text-primary transition-colors text-center z-10 relative">
                {brand.name}
              </span>
              {/* Gradient underline on hover */}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/markalar"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-bold text-lg transition-colors group"
          >
            Tüm Markaları Gör
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

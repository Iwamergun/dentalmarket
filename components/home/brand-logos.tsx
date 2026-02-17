import Link from 'next/link'
import type { Brand } from '@/types/catalog.types'

interface BrandLogosProps {
  brands: Brand[]
}

export function BrandLogos({ brands }: BrandLogosProps) {
  // Use first 12 brands
  const displayBrands = brands.slice(0, 12)

  return (
    <section className="py-12 md:py-16 bg-background border-y border-border">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="section-title">Güvenilir Markalar</h2>
          <p className="section-subtitle">
            Dünya çapında tanınan markalarla çalışıyoruz
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {displayBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/markalar/${brand.slug}`}
              className="flex items-center justify-center p-6 bg-white rounded-lg border border-border hover:border-secondary hover:shadow-card transition-all duration-200 group"
            >
              <span className="text-sm font-semibold text-text-secondary group-hover:text-secondary transition-colors text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/markalar"
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary-dark font-medium transition-colors"
          >
            Tüm Markaları Gör
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

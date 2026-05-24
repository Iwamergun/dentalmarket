import Link from 'next/link'
import type { Brand } from '@/types/catalog.types'

interface BrandLogosProps {
  brands: Brand[]
}

export function BrandLogos({ brands }: BrandLogosProps) {
  // Use first 12 brands
  const displayBrands = brands.slice(0, 12)

  return (
    <section className="border-y border-border/50 bg-muted/60 py-12 md:py-14">
      <div className="container-main">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-text">Marka ağı</p>
          <h2 className="mt-3 text-3xl font-bold text-body-text md:text-4xl">Güvenilir Markalar</h2>
          <p className="mt-3 text-base text-secondary-text md:text-lg">Dünya çapında tanınan üreticilerle çalışıyoruz.</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {displayBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/markalar/${brand.slug}`}
              className="group relative flex items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-white/85 p-6 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-premium"
            >
              <span className="text-sm font-bold text-secondary-text group-hover:text-primary transition-colors text-center z-10 relative">
                {brand.name}
              </span>
              {/* Gradient underline on hover */}
              <span className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/markalar"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-secondary/30 hover:text-secondary"
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

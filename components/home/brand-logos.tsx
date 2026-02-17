import Link from 'next/link'
import { Award, Sparkles } from 'lucide-react'
import type { Brand } from '@/types/catalog.types'

interface BrandLogosProps {
  brands: Brand[]
}

export function BrandLogos({ brands }: BrandLogosProps) {
  // Use first 12 brands
  const displayBrands = brands.slice(0, 12)

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-white border-y-2 border-border">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple/10 to-teal/10 rounded-full mb-4">
            <Award className="w-5 h-5 text-purple" />
            <span className="text-sm font-bold text-purple">GÜVENİLİR MARKALAR</span>
          </div>
          <h2 className="section-title">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dünya Çapında Tanınan Markalar
            </span>
          </h2>
          <p className="section-subtitle">
            <span className="font-bold text-accent">500+</span> premium marka ile çalışıyoruz
          </p>
        </div>

        {/* Brand Grid with Animation */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {displayBrands.map((brand, index) => {
            return (
              <Link
                key={brand.id}
                href={`/markalar/${brand.slug}`}
                className="group relative flex items-center justify-center p-6 bg-white rounded-xl border-2 border-border hover:border-transparent transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Border Effect on Hover - cycles through colors */}
                <div className={`absolute inset-0 ${
                  index % 4 === 0 ? 'bg-gradient-to-br from-accent to-accent-light' :
                  index % 4 === 1 ? 'bg-gradient-to-br from-purple to-purple-light' :
                  index % 4 === 2 ? 'bg-gradient-to-br from-teal to-teal-light' :
                  'bg-gradient-to-br from-secondary to-secondary-light'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="absolute inset-[2px] bg-white rounded-[10px] z-10" />
                
                {/* Brand Name */}
                <div className="relative z-20 text-center">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-text-muted group-hover:text-accent transition-colors" />
                  <span className="text-sm font-bold text-text-secondary group-hover:text-accent transition-colors">
                    {brand.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/markalar"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple to-purple-light text-white font-bold rounded-xl hover:shadow-glow-purple transition-all duration-300 transform hover:scale-105"
          >
            <Award className="w-5 h-5" />
            <span>Tüm Markaları Keşfet</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

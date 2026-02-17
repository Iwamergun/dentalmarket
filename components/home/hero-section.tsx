import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>
      
      <div className="container-main relative py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-medium">Yeni Ürünler Geldi!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Diş Hekimleri İçin
              <span className="block text-accent">
                Premium Ekipman
              </span>
            </h1>
            
            <p className="text-lg text-gray-200 max-w-lg">
              Türkiye&apos;nin en güvenilir dental B2B platformunda binlerce ürün, 
              yüzlerce marka ve en uygun fiyatlar sizleri bekliyor.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/urunler" className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-all duration-200 shadow-lg hover:shadow-xl">
                Ürünleri Keşfet
              </Link>
              <Link href="/kategoriler" className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200">
                Kategorileri Gör
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold text-accent">500+</p>
                <p className="text-sm text-gray-300">Marka</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">10K+</p>
                <p className="text-sm text-gray-300">Ürün</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">5K+</p>
                <p className="text-sm text-gray-300">Klinik</p>
              </div>
            </div>
          </div>
          
          {/* Visual */}
          <div className="hidden lg:block relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
              <div className="absolute inset-8 border-2 border-accent/30 rounded-full" />
              <div className="absolute inset-16 border-2 border-white/30 rounded-full" />
              
              {/* Center content */}
              <div className="absolute inset-24 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <p className="text-4xl font-bold">DM</p>
                  <p className="text-xs mt-1 opacity-80">Premium B2B</p>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute top-10 right-0 bg-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                <p className="text-sm text-primary font-medium">🚚 Hızlı Teslimat</p>
              </div>
              <div className="absolute bottom-20 left-0 bg-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                <p className="text-sm text-primary font-medium">🔒 Güvenli Ödeme</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

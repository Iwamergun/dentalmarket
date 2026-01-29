import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background-deep via-background to-background-card">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container-main relative py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent text-sm font-medium">Yeni Ürünler Geldi!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
              Diş Hekimleri İçin
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Premium Ekipman
              </span>
            </h1>
            
            <p className="text-lg text-text-secondary max-w-lg">
              Türkiye&apos;nin en güvenilir dental B2B platformunda binlerce ürün, 
              yüzlerce marka ve en uygun fiyatlar sizleri bekliyor.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/urunler" className="btn-glow-primary">
                Ürünleri Keşfet
              </Link>
              <Link href="/kategoriler" className="btn-outline">
                Kategorileri Gör
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-border">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-text-muted">Marka</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">10K+</p>
                <p className="text-sm text-text-muted">Ürün</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-text-primary">5K+</p>
                <p className="text-sm text-text-muted">Klinik</p>
              </div>
            </div>
          </div>
          
          {/* Visual */}
          <div className="hidden lg:block relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 border-2 border-border rounded-full animate-pulse" />
              <div className="absolute inset-8 border-2 border-primary/30 rounded-full" />
              <div className="absolute inset-16 border-2 border-accent/30 rounded-full" />
              
              {/* Center content */}
              <div className="absolute inset-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center glow-primary">
                <div className="text-center text-white">
                  <p className="text-4xl font-bold">DM</p>
                  <p className="text-xs mt-1 opacity-80">Premium B2B</p>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute top-10 right-0 card-base px-4 py-2 animate-fade-in">
                <p className="text-sm text-text-primary font-medium">🚚 Hızlı Teslimat</p>
              </div>
              <div className="absolute bottom-20 left-0 card-base px-4 py-2 animate-fade-in">
                <p className="text-sm text-text-primary font-medium">🔒 Güvenli Ödeme</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

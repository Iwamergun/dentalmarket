import Link from 'next/link'
import { Sparkles, ShieldCheck, Truck, Award } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-warning text-white border-0 rounded-full shadow-lg animate-fade-in">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-sm">🎉 Yeni Ürünler Geldi - Özel Fırsatlar!</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Diş Hekimleri İçin
              <br />
              Premium B2B Platform
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-secondary-text max-w-2xl mx-auto">
            Türkiye&apos;nin en güvenilir dental ekipman tedarikçisi. Binlerce ürün, 
            yüzlerce marka ve en uygun fiyatlar sizleri bekliyor.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/urunler" 
              className="px-8 py-4 bg-gradient-to-r from-primary via-secondary to-primary text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
            >
              Ürünleri Keşfet
            </Link>
            <Link 
              href="/kategoriler" 
              className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
            >
              Kategoriler
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-border hover:border-primary/30 transition-all duration-200">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-body-text mb-2">Güvenli Ödeme</h3>
              <p className="text-sm text-secondary-text">256-bit SSL şifreleme</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-border hover:border-secondary/30 transition-all duration-200">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-body-text mb-2">Hızlı Teslimat</h3>
              <p className="text-sm text-secondary-text">2-5 iş günü kargo</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-border hover:border-accent/30 transition-all duration-200">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent to-warning flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-body-text mb-2">Kalite Garantisi</h3>
              <p className="text-sm text-secondary-text">Orijinal ürün garantisi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

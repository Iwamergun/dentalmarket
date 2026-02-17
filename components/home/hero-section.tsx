import Link from 'next/link'
import { Sparkles, Zap, TrendingUp, Award } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container-main relative py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 text-white z-10">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent-light rounded-full backdrop-blur-sm shadow-glow-accent">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <span className="text-white text-sm font-bold tracking-wide">YENİ ÜRÜNLER • %20 İNDİRİM!</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Diş Hekimleri İçin
              </span>
              <span className="block mt-2 bg-gradient-to-r from-accent via-accent-light to-purple bg-clip-text text-transparent">
                Premium Ekipman
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
              Türkiye&apos;nin <span className="font-bold text-accent-light">en güvenilir</span> dental B2B platformunda 
              <span className="font-bold text-accent-light"> 10,000+ ürün</span>, 
              <span className="font-bold text-accent-light"> 500+ marka</span> ve 
              <span className="font-bold text-accent-light"> en uygun fiyatlar</span> sizleri bekliyor!
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/urunler" 
                className="group px-8 py-4 bg-gradient-to-r from-accent to-accent-light text-white font-bold rounded-xl hover:shadow-glow-accent transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                <span>Ürünleri Keşfet</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/kategoriler" 
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-2"
              >
                <span>Kategoriler</span>
              </Link>
            </div>
            
            {/* Stats - Eye-catching */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-white/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 border-2 border-accent mb-2">
                  <TrendingUp className="w-6 h-6 text-accent-light" />
                </div>
                <p className="text-3xl font-extrabold text-accent-light">500+</p>
                <p className="text-sm text-gray-300 font-medium">Marka</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple/20 border-2 border-purple mb-2">
                  <Sparkles className="w-6 h-6 text-purple-light" />
                </div>
                <p className="text-3xl font-extrabold text-purple-light">10K+</p>
                <p className="text-sm text-gray-300 font-medium">Ürün</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal/20 border-2 border-teal mb-2">
                  <Award className="w-6 h-6 text-teal-light" />
                </div>
                <p className="text-3xl font-extrabold text-teal-light">5K+</p>
                <p className="text-sm text-gray-300 font-medium">Klinik</p>
              </div>
            </div>
          </div>
          
          {/* Visual - More Dynamic */}
          <div className="hidden lg:block relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Animated Decorative Circles */}
              <div className="absolute inset-0 border-2 border-accent/40 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-8 border-2 border-purple/40 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              <div className="absolute inset-16 border-2 border-teal/40 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
              
              {/* Center Content with Gradient */}
              <div className="absolute inset-24 bg-gradient-to-br from-accent via-purple to-teal rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <p className="text-5xl font-extrabold drop-shadow-lg">DM</p>
                  <p className="text-sm mt-2 font-bold tracking-wider opacity-90">PREMIUM B2B</p>
                </div>
              </div>
              
              {/* Floating Badges - More Colorful */}
              <div className="absolute top-10 -right-4 bg-gradient-to-r from-accent to-accent-light px-5 py-3 rounded-xl shadow-glow-accent animate-fade-in border-2 border-accent-light">
                <p className="text-sm text-white font-bold">🚚 Hızlı Teslimat</p>
              </div>
              <div className="absolute bottom-20 -left-4 bg-gradient-to-r from-purple to-purple-light px-5 py-3 rounded-xl shadow-glow-purple animate-fade-in border-2 border-purple-light" style={{ animationDelay: '0.3s' }}>
                <p className="text-sm text-white font-bold">🔒 Güvenli Ödeme</p>
              </div>
              <div className="absolute top-1/2 -left-8 bg-gradient-to-r from-teal to-teal-light px-5 py-3 rounded-xl shadow-glow-teal animate-fade-in border-2 border-teal-light" style={{ animationDelay: '0.6s' }}>
                <p className="text-sm text-white font-bold">✨ Premium Kalite</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

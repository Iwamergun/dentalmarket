import Link from 'next/link'
import { Sparkles, HeartPulse } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative py-16 md:py-24">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-warning text-white border-0 rounded-full shadow-lg animate-fade-in">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-sm" role="img" aria-label="Kutlama">🎉</span>
              <span className="font-bold text-sm">Yeni Ürünler Geldi - Özel Fırsatlar!</span>
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
            <p className="text-lg md:text-xl text-secondary-text max-w-2xl lg:max-w-none">
              Türkiye&apos;nin en güvenilir dental ekipman tedarikçisi. Binlerce ürün,
              yüzlerce marka ve en uygun fiyatlar sizleri bekliyor.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
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
          </div>

          {/* Right — SVG Illustration (desktop only) */}
          <div className="hidden lg:flex items-center justify-center relative" aria-hidden="true">
            {/* Background decorative circles */}
            <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse-slow top-0 -right-10" />
            <div className="absolute w-56 h-56 rounded-full bg-secondary/10 blur-3xl animate-pulse-slow bottom-0 -left-10" style={{ animationDelay: '1s' }} />
            <div className="absolute w-40 h-40 rounded-full bg-accent/8 blur-2xl animate-pulse-slow top-10 left-10" style={{ animationDelay: '2s' }} />

            {/* Scattered decorative elements */}
            <div className="absolute top-8 left-16 text-primary/30 text-2xl font-bold select-none">+</div>
            <div className="absolute bottom-16 right-8 text-secondary/30 text-xl font-bold select-none">+</div>
            <div className="absolute top-24 right-20 text-accent/30 text-lg font-bold select-none">+</div>
            <div className="absolute w-2 h-2 rounded-full bg-primary/30 top-20 right-32" />
            <div className="absolute w-3 h-3 rounded-full bg-secondary/20 bottom-28 left-20" />
            <div className="absolute w-2 h-2 rounded-full bg-accent/25 top-40 left-4" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-warning/30 bottom-10 right-28" />

            {/* Gradient ring behind tooth */}
            <div className="absolute w-64 h-64 rounded-full border-[3px] border-dashed border-primary/15 animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute w-80 h-80 rounded-full border-[2px] border-dashed border-secondary/10 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />

            {/* Main tooth SVG */}
            <div className="relative z-10 group">
              <svg
                width="200"
                height="240"
                viewBox="0 0 200 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
              >
                {/* Tooth glow */}
                <defs>
                  <radialGradient id="toothGlow" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="70%" stopColor="#f0f0ff" />
                    <stop offset="100%" stopColor="#e8e8f4" />
                  </radialGradient>
                  <linearGradient id="toothShine" x1="30%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#f5f5ff" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#e0e0f0" stopOpacity="0.4" />
                  </linearGradient>
                  <filter id="toothShadow" x="-20%" y="-10%" width="140%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.15" />
                  </filter>
                </defs>
                {/* Tooth body */}
                <path
                  d="M100 20 C65 20, 35 45, 35 80 C35 110, 50 125, 55 140 C58 150, 55 180, 60 210 C63 225, 72 230, 78 225 C84 218, 88 195, 95 180 C98 173, 102 173, 105 180 C112 195, 116 218, 122 225 C128 230, 137 225, 140 210 C145 180, 142 150, 145 140 C150 125, 165 110, 165 80 C165 45, 135 20, 100 20Z"
                  fill="url(#toothGlow)"
                  stroke="#d4d4e8"
                  strokeWidth="1.5"
                  filter="url(#toothShadow)"
                />
                {/* Shine highlight */}
                <path
                  d="M80 40 C72 50, 60 70, 62 90 C64 105, 75 95, 80 75 C85 55, 85 42, 80 40Z"
                  fill="white"
                  opacity="0.6"
                />
                {/* Small sparkle on tooth */}
                <circle cx="78" cy="50" r="3" fill="white" opacity="0.8" />
                <circle cx="82" cy="46" r="1.5" fill="white" opacity="0.5" />
                {/* Cross/plus on tooth center */}
                <g opacity="0.15">
                  <rect x="95" y="75" width="10" height="30" rx="3" fill="#6366f1" />
                  <rect x="85" y="85" width="30" height="10" rx="3" fill="#6366f1" />
                </g>
              </svg>

              {/* Heart pulse icon overlay */}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-destructive to-accent rounded-full flex items-center justify-center shadow-lg">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Floating badge cards */}
            {/* Card 1: 500+ Marka */}
            <div
              className="absolute top-4 -left-4 bg-white/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 animate-float z-20"
              style={{ animationDelay: '0s' }}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-success to-primary flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">500+ Marka</p>
                <p className="text-[11px] text-secondary-text mt-0.5">Güvenilir tedarikçiler</p>
              </div>
            </div>

            {/* Card 2: 10.000+ Ürün */}
            <div
              className="absolute -bottom-2 -left-8 bg-white/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 animate-float z-20"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">10.000+ Ürün</p>
                <p className="text-[11px] text-secondary-text mt-0.5">Geniş ürün yelpazesi</p>
              </div>
            </div>

            {/* Card 3: 4.9 Puan */}
            <div
              className="absolute top-1/2 -right-12 -translate-y-1/2 bg-white/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 animate-float z-20"
              style={{ animationDelay: '1s' }}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-warning to-accent flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">4.9 Puan</p>
                <p className="text-[11px] text-secondary-text mt-0.5">Müşteri memnuniyeti</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

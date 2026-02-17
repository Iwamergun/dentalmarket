'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Clock, Zap, Gift, Percent } from 'lucide-react'

export function CampaignBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // TODO: Fetch campaign end date from backend/database
    // For now, set to 7 days from now for demo purposes
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 7)

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        clearInterval(interval)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Vibrant Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent via-purple to-teal" />
      
      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-main relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          {/* Content */}
          <div className="space-y-4 text-center md:text-left flex-1">
            {/* Badge with Icons */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border-2 border-white/40 rounded-full text-sm backdrop-blur-sm shadow-lg">
                <Clock className="w-5 h-5 animate-pulse" />
                <span className="font-bold">SINIRLI SÜRE</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border-2 border-white/40 rounded-full text-sm backdrop-blur-sm shadow-lg">
                <Zap className="w-5 h-5" />
                <span className="font-bold">ÖZEL KAMPANYA</span>
              </div>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="block">Mega İndirim</span>
              <span className="block flex items-center justify-center md:justify-start gap-3 mt-2">
                <Percent className="w-10 h-10 md:w-12 md:h-12" />
                <span className="text-5xl md:text-6xl lg:text-7xl">20</span>
                <span className="text-3xl md:text-4xl">&apos;ye Varan</span>
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-xl text-white/90 max-w-lg font-medium">
              <Gift className="inline w-6 h-6 mr-2" />
              Seçili diş hekimliği ürünlerinde 
              <span className="font-bold"> kaçırılmayacak fırsatlar</span>. 
              Hemen inceleyin ve stoklardan tükenmesin!
            </p>

            {/* CTA Button */}
            <Link
              href="/kampanyalar"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-accent font-bold rounded-xl hover:bg-white/95 transition-all duration-300 shadow-2xl hover:shadow-glow-accent transform hover:scale-105"
            >
              <Zap className="w-6 h-6" />
              <span>Kampanyaları Keşfet</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Countdown Timer - Premium Design */}
          <div className="flex gap-3 md:gap-4">
            {[
              { label: 'Gün', value: timeLeft.days },
              { label: 'Saat', value: timeLeft.hours },
              { label: 'Dakika', value: timeLeft.minutes },
              { label: 'Saniye', value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl" />
                  
                  {/* Timer Box */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl border-4 border-white shadow-2xl mb-2">
                    <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-br from-accent to-purple bg-clip-text text-transparent">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-bold text-white/90 tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

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
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-gradient-start via-secondary to-gradient-end rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
            {/* Content */}
            <div className="space-y-4 text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-warning rounded-full text-sm font-bold shadow-lg">
                <Clock className="w-4 h-4" />
                <span>SINIRLI SÜRE</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                Özel Kampanya
                <span className="block text-accent mt-2">%20&apos;ye Varan İndirim!</span>
              </h2>
              
              <p className="text-white/90 text-lg max-w-lg">
                Seçili diş hekimliği ürünlerinde kaçırılmayacak fırsatlar. 
                Hemen inceleyin!
              </p>

              <Link
                href="/kampanyalar"
                className="inline-block px-8 py-4 bg-gradient-to-r from-accent to-warning text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 mt-4"
              >
                Kampanyaları Gör →
              </Link>
            </div>

            {/* Countdown Timer */}
            <div className="flex gap-3 md:gap-4">
              {[
                { label: 'Gün', value: timeLeft.days },
                { label: 'Saat', value: timeLeft.hours },
                { label: 'Dakika', value: timeLeft.minutes },
                { label: 'Saniye', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-white/20 backdrop-blur rounded-2xl border-2 border-white/30 mb-2 shadow-lg">
                    <span className="text-2xl md:text-4xl font-extrabold">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-white/80 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

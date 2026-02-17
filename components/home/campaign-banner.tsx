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
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary via-secondary to-primary">
      <div className="container-main">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          {/* Content */}
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/30 rounded-full text-sm backdrop-blur-sm">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-accent font-medium">Sınırlı Süre</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Özel Kampanya
              <span className="block text-accent">%20&apos;ye Varan İndirim!</span>
            </h2>
            
            <p className="text-gray-200 max-w-lg">
              Seçili diş hekimliği ürünlerinde kaçırılmayacak fırsatlar. 
              Hemen inceleyin!
            </p>

            <Link
              href="/kampanyalar"
              className="inline-block px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Kampanyaları Gör
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className="flex gap-4">
            {[
              { label: 'Gün', value: timeLeft.days },
              { label: 'Saat', value: timeLeft.hours },
              { label: 'Dakika', value: timeLeft.minutes },
              { label: 'Saniye', value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 mb-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-gray-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

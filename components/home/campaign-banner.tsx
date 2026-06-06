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
    <section>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.45)] md:p-10">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            {/* Content */}
            <div className="space-y-4 text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                <Clock className="w-4 h-4" />
                <span>SINIRLI SÜRE</span>
              </div>
              
              <h2 className="text-3xl font-bold leading-tight text-slate-950 md:text-4xl lg:text-[2.8rem]">
                Özel Kampanya
                <span className="mt-2 block text-slate-700">%20&apos;ye Varan İndirim!</span>
              </h2>
              
              <p className="max-w-lg text-base text-slate-600 md:text-lg">
                Seçili diş hekimliği ürünlerinde kaçırılmayacak fırsatlar. 
                Hemen inceleyin!
              </p>

              <Link
                href="/kampanyalar"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
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
                  <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 md:h-24 md:w-24">
                    <span className="text-2xl font-bold text-slate-950 md:text-4xl">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 md:text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
    </section>
  )
}

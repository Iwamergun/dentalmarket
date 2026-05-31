'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Campaign } from '@/lib/supabase/queries/campaigns'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface HeroCampaignCarouselProps {
  campaigns: Campaign[]
  showFallbackTag?: boolean
}

const gradients = [
  'bg-gradient-to-br from-primary via-primary/85 to-secondary',
  'bg-gradient-to-br from-secondary via-secondary/85 to-accent',
  'bg-gradient-to-br from-accent via-accent/85 to-primary',
  'bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/60',
]

export function HeroCampaignCarousel({ campaigns, showFallbackTag = false }: HeroCampaignCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % campaigns.length)
  }, [campaigns.length])

  useEffect(() => {
    if (paused || campaigns.length <= 1) return
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [paused, next, campaigns.length])

  if (campaigns.length === 0) return null

  return (
    <div
      className="overflow-hidden rounded-[2rem] border border-border/60 bg-white/80 shadow-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Öne çıkan kampanyalar</p>
          <p className="mt-0.5 text-sm text-secondary-text">İlk ekranda görünen fırsatlar</p>
        </div>
        {showFallbackTag && (
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
            Demo kartlar
          </span>
        )}
      </div>

      {/* Slides */}
      <div className="relative aspect-[4/3]">
        {campaigns.map((campaign, index) => (
          <div
            key={campaign.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === current ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
            }`}
          >
            <Link
              href={campaign.href || '/kampanyalar'}
              className="group flex h-full flex-col"
              tabIndex={index !== current ? -1 : 0}
            >
              <div className="relative flex-1 overflow-hidden">
                {campaign.image_path ? (
                  <Image
                    src={getImageUrl(campaign.image_path)}
                    alt={campaign.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-end p-6 text-white ${gradients[index % gradients.length]}`}
                  >
                    <span className="rounded-xl bg-black/20 px-4 py-2 text-xl font-bold backdrop-blur">
                      {campaign.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Kampanya
                  </span>
                  {showFallbackTag && (
                    <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
                      Hazır
                    </span>
                  )}
                </div>
                <p className="text-base font-semibold text-foreground">{campaign.title}</p>
                <p className="line-clamp-2 text-sm leading-6 text-secondary-text">
                  {campaign.description || 'Aktif kampanyaları görüntüleyin ve teklif detaylarını inceleyin.'}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      {campaigns.length > 1 && (
        <div className="flex items-center justify-center gap-2 pb-4 pt-1">
          {campaigns.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Slayt ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-primary/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

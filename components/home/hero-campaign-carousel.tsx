'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Campaign } from '@/lib/supabase/queries/campaigns'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface HeroCampaignCarouselProps {
  campaigns: Campaign[]
  showFallbackTag?: boolean
}

const fallbackCampaignThemes = [
  { accent: 'bg-slate-800', label: 'text-slate-700 bg-white border-slate-200' },
  { accent: 'bg-slate-500', label: 'text-slate-700 bg-white border-slate-200' },
  { accent: 'bg-slate-700', label: 'text-slate-700 bg-white border-slate-200' },
  { accent: 'bg-slate-700', label: 'text-slate-700 bg-slate-100 border-slate-200' },
]

export function HeroCampaignCarousel({ campaigns, showFallbackTag = false }: HeroCampaignCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const dragStartX = useRef<number | null>(null)
  const didDragRef = useRef(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % campaigns.length)
  }, [campaigns.length])

  const previous = useCallback(() => {
    setCurrent((prev) => (prev - 1 + campaigns.length) % campaigns.length)
  }, [campaigns.length])

  const goTo = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX
    didDragRef.current = false
    setPaused(true)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return

    const dragDistance = event.clientX - dragStartX.current
    dragStartX.current = null

    if (Math.abs(dragDistance) > 48 && campaigns.length > 1) {
      didDragRef.current = true
      if (dragDistance < 0) {
        next()
      } else {
        previous()
      }
    }

    setPaused(false)
  }

  const handlePointerCancel = () => {
    dragStartX.current = null
    setPaused(false)
  }

  useEffect(() => {
    if (paused || campaigns.length <= 1) return
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [paused, next, campaigns.length])

  if (campaigns.length === 0) return null

  return (
    <div
      className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Öne çıkan kampanyalar</p>
          {showFallbackTag && (
            <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Demo kartlar
            </span>
          )}
        </div>
        {campaigns.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Önceki kampanya"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Sonraki kampanya"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Slides */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-white touch-pan-y cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerCancel}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {campaigns.map((campaign, index) => (
            <Link
              key={campaign.id}
              href={campaign.href || '/kampanyalar'}
              className="group flex h-full min-w-full flex-col p-4"
              tabIndex={index !== current ? -1 : 0}
              draggable={false}
              onClickCapture={(event) => {
                if (!didDragRef.current) return
                event.preventDefault()
                event.stopPropagation()
                didDragRef.current = false
              }}
            >
              <div className="relative flex-1 overflow-hidden rounded-[1.75rem] bg-[#F8FAFC] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)]">
                {campaign.image_path ? (
                  <Image
                    src={getImageUrl(campaign.image_path)}
                    alt={campaign.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="grid h-full w-full grid-cols-[1fr_0.82fr] gap-5 bg-[#F8FAFC] p-6">
                    <div className="flex min-w-0 flex-col justify-between">
                      <span
                        className={`w-fit rounded-md border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${fallbackCampaignThemes[index % fallbackCampaignThemes.length].label}`}
                      >
                        Kampanya
                      </span>

                      <div>
                        <p className="max-w-sm text-3xl font-bold leading-tight text-slate-950">
                          {campaign.title}
                        </p>
                        <p className="mt-3 line-clamp-2 max-w-sm text-sm leading-6 text-slate-600">
                          {campaign.description || 'Klinik ihtiyaçları için seçili fırsatları inceleyin.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-end gap-3" aria-hidden="true">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_30px_-28px_rgba(15,23,42,0.55)]">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="h-2.5 w-20 rounded-full bg-slate-200" />
                          <span className={`h-2.5 w-2.5 rounded-full ${fallbackCampaignThemes[index % fallbackCampaignThemes.length].accent}`} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="h-14 rounded-xl bg-slate-100" />
                          <span className="h-14 rounded-xl bg-slate-100" />
                          <span className="h-14 rounded-xl bg-slate-100" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <span className="h-20 rounded-2xl border border-slate-200 bg-white" />
                        <span className="h-20 rounded-2xl border border-slate-200 bg-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 px-1 pb-1 pt-4 sm:px-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Kampanya
                  </span>
                  {showFallbackTag && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
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
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      {campaigns.length > 1 && (
        <div className="flex items-center justify-center gap-2 pb-4 pt-1">
          {campaigns.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`${index === current ? 'Geçerli slayt' : 'Git'} ${index + 1} / ${campaigns.length}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? 'w-6 bg-slate-800' : 'w-2 bg-slate-200 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

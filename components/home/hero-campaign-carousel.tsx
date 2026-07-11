'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Layers3 } from 'lucide-react'
import type { Campaign } from '@/lib/supabase/queries/campaigns'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface HeroCampaignCarouselProps {
  campaigns: Campaign[]
  showFallbackTag?: boolean
}

const fallbackHighlights = [
  ['Klinik sarf ürünleri', 'Sterilizasyon çözümleri', 'Günlük tüketimler'],
  ['Fiyat avantajlı ürünler', 'Toplu siparişe uygun seçkiler', 'Kategori bazlı keşif'],
  ['Tekrarlanan alımlar', 'Seçili ürün grupları', 'Marka ve kategori geçişi'],
]

function formatCampaignDateLabel(campaign: Campaign) {
  if (!campaign.starts_at && !campaign.ends_at) return null

  const formatter = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
  })

  if (campaign.starts_at && campaign.ends_at) {
    return `${formatter.format(new Date(campaign.starts_at))} – ${formatter.format(new Date(campaign.ends_at))}`
  }

  if (campaign.ends_at) {
    return `${formatter.format(new Date(campaign.ends_at))} tarihine kadar`
  }

  return `${formatter.format(new Date(campaign.starts_at!))} itibarıyla aktif`
}

export function HeroCampaignCarousel({ campaigns, showFallbackTag = false }: HeroCampaignCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
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
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setPrefersReducedMotion(media.matches)

    syncPreference()
    media.addEventListener('change', syncPreference)
    return () => media.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    const shouldAutoRotateCampaigns = !showFallbackTag && !prefersReducedMotion && !paused && campaigns.length > 1
    if (!shouldAutoRotateCampaigns) return

    const timer = setInterval(next, 7000)
    return () => clearInterval(timer)
  }, [campaigns.length, next, paused, prefersReducedMotion, showFallbackTag])

  if (campaigns.length === 0) return null

  return (
    <div
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Öne çıkan kampanyalar</p>
          {showFallbackTag && (
            <span className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Hazır vitrin
            </span>
          )}
        </div>

        {campaigns.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Önceki kampanya"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-primary/20 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Sonraki kampanya"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-primary/20 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden bg-white touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerCancel}
      >
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform motion-reduce:transition-none"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {campaigns.map((campaign, index) => {
            const dateLabel = formatCampaignDateLabel(campaign)
            const highlights = fallbackHighlights[index % fallbackHighlights.length]

            return (
              <Link
                key={campaign.id}
                href={campaign.href || '/kampanyalar'}
                className="min-w-full p-5 md:p-6"
                tabIndex={index !== current ? -1 : 0}
                draggable={false}
                onClickCapture={(event) => {
                  if (!didDragRef.current) return
                  event.preventDefault()
                  event.stopPropagation()
                  didDragRef.current = false
                }}
              >
                <div className="grid min-h-[360px] gap-6 rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-6 md:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] lg:items-center">
                  <div className="flex min-w-0 flex-col justify-between gap-6">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                          {showFallbackTag ? 'Kampanya vitrini' : 'Kampanya'}
                        </span>
                        {dateLabel && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {dateLabel}
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
                          {campaign.title}
                        </h2>
                        <p className="max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                          {campaign.description || 'Klinik ihtiyaçlarınız için seçili ürünleri ve kampanyaları sade bir vitrinden inceleyin.'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2.5" aria-hidden="true">
                        {highlights.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_-18px_rgba(37,99,235,0.7)]">
                        Kampanyayı İncele
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-slate-600">Tüm kampanyalar ve ilgili ürünler için tıklayın</span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/90 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
                    {campaign.image_path ? (
                      <div className="relative min-h-[280px]">
                        <Image
                          src={getImageUrl(campaign.image_path)}
                          alt={campaign.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      </div>
                    ) : (
                      <div className="grid min-h-[280px] gap-3 p-4 sm:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                          <div className="flex h-full flex-col justify-between">
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 shadow-sm">
                              <Layers3 className="h-3.5 w-3.5 text-primary" />
                              Seçili koleksiyon
                            </span>
                            <div className="grid gap-2">
                              {highlights.map((item, itemIndex) => (
                                <div
                                  key={item}
                                  className={[
                                    'rounded-2xl border px-3 py-3 text-sm font-medium',
                                    itemIndex === 0
                                      ? 'border-primary/10 bg-primary/[0.05] text-slate-900'
                                      : 'border-slate-200 bg-white text-slate-600',
                                  ].join(' ')}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          <div className="rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Profesyonel seçim</p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">Düzenli satın alınan ürünler</p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              Gerçek kampanya verisi geldiğinde aynı alan görsel ve yönlendirme ile otomatik doldurulur.
                            </p>
                          </div>
                          <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Kurgu yerine netlik</p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              Boş placeholder bloklar yerine sade, dürüst ve tekrar kullanılabilir bir vitrin düzeni sunulur.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {campaigns.length > 1 && (
        <div className="flex items-center justify-center gap-2 pb-5 pt-1">
          {campaigns.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`${index === current ? 'Geçerli slayt' : 'Git'} ${index + 1} / ${campaigns.length}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? 'w-6 bg-primary' : 'w-2 bg-slate-200 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

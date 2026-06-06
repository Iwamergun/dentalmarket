import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils/imageHelper'
import type { Campaign } from '@/lib/supabase/queries/campaigns'
import { Megaphone, Sparkles } from 'lucide-react'

interface CampaignSidebarProps {
  campaigns: Campaign[]
}

const fallbackCampaigns: Campaign[] = [
  {
    id: 'fallback-1',
    title: 'Yaz Fırsatları',
    description: 'Seçili ürünlerde avantajlı fiyatları keşfedin.',
    image_path: '',
    href: '/kampanyalar',
    sort_order: 0,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-2',
    title: 'Yeni Üye Avantajı',
    description: 'İlk siparişe özel kampanyaları inceleyin.',
    image_path: '',
    href: '/kampanyalar',
    sort_order: 1,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-3',
    title: 'Toplu Alım İndirimi',
    description: 'Toplu alımlarda ek indirim fırsatlarını kaçırmayın.',
    image_path: '',
    href: '/kampanyalar',
    sort_order: 2,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '',
    updated_at: '',
  },
]

export function CampaignSidebar({ campaigns }: CampaignSidebarProps) {
  const displayCampaigns = campaigns.length > 0 ? campaigns : fallbackCampaigns
  const showFallbackTag = campaigns.length === 0
  const getFallbackGradientClass = (index: number) =>
    index % 2 === 0
      ? 'border-slate-200 bg-slate-50 text-slate-800'
      : 'border-slate-200 bg-white text-slate-800'

  return (
    <>
      <div className="lg:hidden">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Kampanyalar</p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {displayCampaigns.map((campaign, index) => (
              <Link
                key={campaign.id}
                href={campaign.href || '/kampanyalar'}
                className="relative block h-28 min-w-[180px] overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm"
              >
                {campaign.image_path ? (
                  <Image
                    src={getImageUrl(campaign.image_path)}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-end border p-3 text-sm font-semibold ${getFallbackGradientClass(index)}`}
                  >
                    <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{campaign.title}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="rounded-[28px] border border-primary/10 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Kampanyalar</p>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 max-h-[460px] space-y-3 overflow-y-auto pr-1">
            {displayCampaigns.map((campaign, index) => (
              <Link
                key={campaign.id}
                href={campaign.href || '/kampanyalar'}
                className="group block overflow-hidden rounded-2xl border border-border bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {campaign.image_path ? (
                    <Image
                      src={getImageUrl(campaign.image_path)}
                      alt={campaign.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="320px"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-end border p-3 text-sm font-semibold ${getFallbackGradientClass(index)}`}
                    >
                      <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{campaign.title}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-border/70 px-3 py-2">
                  <span className="line-clamp-1 text-sm font-semibold text-primary">{campaign.title}</span>
                  <div className="flex items-center gap-1.5">
                    {showFallbackTag && (
                      <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary">
                        Öne Çıkan
                      </span>
                    )}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition group-hover:bg-secondary group-hover:text-white">
                      <Megaphone className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

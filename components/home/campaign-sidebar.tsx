import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils/imageHelper'
import type { Campaign } from '@/lib/supabase/queries/campaigns'

interface CampaignSidebarProps {
  campaigns: Campaign[]
}

export function CampaignSidebar({ campaigns }: CampaignSidebarProps) {
  if (campaigns.length === 0) {
    return null
  }

  return (
    <>
      <div className="lg:hidden">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Kampanyalar</p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={campaign.href || '/kampanyalar'}
                className="relative block h-28 min-w-[180px] overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm"
              >
                <Image
                  src={getImageUrl(campaign.image_path)}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="rounded-[28px] border border-primary/10 bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Kampanyalar</p>
          <div className="mt-4 max-h-[460px] space-y-3 overflow-y-auto pr-1">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={campaign.href || '/kampanyalar'}
                className="group block overflow-hidden rounded-2xl border border-border bg-white"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={getImageUrl(campaign.image_path)}
                    alt={campaign.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="320px"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'
import { getActiveCampaigns } from '@/lib/supabase/queries/campaigns'
import { getImageUrl } from '@/lib/utils/imageHelper'

export const metadata: Metadata = {
  title: 'Kampanyalar - Dent Alışveriş',
  description: 'Dent Alışveriş güncel kampanyaları ve özel fırsatları',
}

export default async function KampanyalarPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Kampanyalar', href: '/kampanyalar' },
  ]
  const campaigns = await getActiveCampaigns()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Kampanyalar</h1>
        <p className="mt-2 text-gray-600">Aktif kampanyalar ve özel fırsatlardan yararlanın</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">Aktif kampanyalar yakında burada!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={getImageUrl(campaign.image_path)}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{campaign.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{campaign.description ?? 'Özel kampanyayı inceleyin.'}</p>
                <Link
                  href={campaign.href || '/kampanyalar'}
                  className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Kampanyayı İncele
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

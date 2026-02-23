import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kampanyalar - DentalMarket',
  description: 'DentalMarket güncel kampanyaları ve özel fırsatları',
}

const mockCampaigns = [
  {
    id: 1,
    title: 'Yaz Sezonu İndirimi',
    description: 'Tüm implant ürünlerinde geçerli özel indirim fırsatı.',
    discount: 20,
    endDate: '2026-08-31',
    href: '/urunler',
  },
  {
    id: 2,
    title: 'Toplu Alım Avantajı',
    description: '500₺ ve üzeri alışverişlerde ekstra indirim kazanın.',
    discount: 15,
    endDate: '2026-07-15',
    href: '/urunler',
  },
  {
    id: 3,
    title: 'Yeni Üye Kampanyası',
    description: 'İlk alışverişinizde özel hoş geldiniz indirimi.',
    discount: 10,
    endDate: '2026-12-31',
    href: '/kayit',
  },
  {
    id: 4,
    title: 'Kargo Bedava',
    description: '300₺ ve üzeri siparişlerde ücretsiz kargo.',
    discount: 0,
    endDate: '2026-09-30',
    href: '/urunler',
  },
]

export default function KampanyalarPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Kampanyalar', href: '/kampanyalar' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Kampanyalar</h1>
        <p className="mt-2 text-gray-600">Aktif kampanyalar ve özel fırsatlardan yararlanın</p>
      </div>

      {mockCampaigns.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">Aktif kampanyalar yakında burada!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col"
            >
              {campaign.discount > 0 && (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 font-bold text-xl mb-4">
                  %{campaign.discount}
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{campaign.title}</h3>
              <p className="text-sm text-gray-600 flex-1 mb-4">{campaign.description}</p>
              <p className="text-xs text-gray-400 mb-4">
                Son geçerlilik: {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
              </p>
              <Link
                href={campaign.href}
                className="w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Hemen Al
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

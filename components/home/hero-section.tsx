import type { Campaign } from '@/lib/supabase/queries/campaigns'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'
import Image from 'next/image'
import { HeroCampaignCarousel } from './hero-campaign-carousel'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface HeroSectionProps {
  campaigns?: Campaign[]
  products?: BestOfferProduct[]
}

const categoryTags = ['İmplant', 'Endodonti', 'Hijyen']

const fallbackCampaigns: Campaign[] = [
  {
    id: 'hero-fallback-1',
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
    id: 'hero-fallback-2',
    title: 'Yeni Üye Avantajı',
    description: 'İlk siparişe özel kampanyaları hemen inceleyin.',
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
    id: 'hero-fallback-3',
    title: 'Toplu Alım İndirimi',
    description: 'Toplu siparişlerde ek indirim fırsatlarını kaçırmayın.',
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

export function HeroSection({ campaigns = [], products = [] }: HeroSectionProps) {
  const displayCampaigns = (campaigns.length > 0 ? campaigns : fallbackCampaigns).slice(0, 5)
  const showFallbackTag = campaigns.length === 0
  const visualProducts = [
    ...products.filter((product) => product.primary_image),
    ...products.filter((product) => !product.primary_image),
  ].slice(0, 3)
  const [mainProduct, firstSideProduct, secondSideProduct] = visualProducts

  return (
    <section className="relative overflow-hidden border-b border-slate-300 bg-white">
      <div className="container-main relative py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Left column: auto-sliding campaign carousel */}
          <HeroCampaignCarousel campaigns={displayCampaigns} showFallbackTag={showFallbackTag} />

          {/* Right column: visual product shelf */}
          <div className="hidden lg:block">
            <div className="rounded-[1.75rem] border border-slate-200 bg-[#F8FAFC] p-4 shadow-[0_24px_55px_-42px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-2 pb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Ürün vitrini</p>
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                </div>
              </div>

              <div className="mt-4 grid min-h-[430px] grid-cols-[1.35fr_0.85fr] gap-4">
                <div className="flex flex-col overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white">
                  <div className="relative min-h-[330px] flex-1 bg-white">
                    <Image
                      src={getImageUrl(mainProduct?.primary_image)}
                      alt={mainProduct?.name ?? 'Dental ürün seçkisi'}
                      fill
                      className="object-contain p-9"
                      sizes="(max-width: 1024px) 0px, 430px"
                    />
                  </div>
                  <div className="border-t border-slate-100 bg-white px-5 py-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {categoryTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                      {mainProduct?.name ?? 'Dental ürün seçkisi'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-rows-2 gap-4">
                  {[
                    { label: 'Çok satanlar', product: firstSideProduct ?? mainProduct },
                    { label: 'Yeni gelenler', product: secondSideProduct ?? mainProduct },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white"
                    >
                      <div className="relative flex-1 bg-white">
                        <Image
                          src={getImageUrl(item.product?.primary_image)}
                          alt={item.product?.name ?? item.label}
                          fill
                          className="object-contain p-5"
                          sizes="(max-width: 1024px) 0px, 220px"
                        />
                      </div>
                      <div className="border-t border-slate-100 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-900">
                          {item.product?.name ?? 'Dental ürün'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

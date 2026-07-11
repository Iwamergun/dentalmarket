import type { Campaign } from '@/lib/supabase/queries/campaigns'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Package, Sparkles } from 'lucide-react'
import { HeroCampaignCarousel } from './hero-campaign-carousel'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface HeroSectionProps {
  campaigns?: Campaign[]
  products?: BestOfferProduct[]
}

const fallbackCampaigns: Campaign[] = [
  {
    id: 'hero-fallback-1',
    title: 'Kliniğinizi Yenileyin',
    description: 'Muayenehane ve laboratuvar için günlük ihtiyaçlara uygun seçkileri tek ekranda keşfedin.',
    image_path: '',
    href: '/kategoriler',
    sort_order: 0,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'hero-fallback-2',
    title: 'Haftanın Fırsatları',
    description: 'Öne çıkan ürünleri ve fiyat avantajı sunan kategorileri sade bir kampanya vitriniyle inceleyin.',
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
    title: 'Çok Al, Avantajlı Al',
    description: 'Sık kullanılan sarf malzemeleri için toplu alıma uygun koleksiyonları karşılaştırın.',
    image_path: '',
    href: '/urunler',
    sort_order: 2,
    is_active: true,
    starts_at: null,
    ends_at: null,
    created_at: '',
    updated_at: '',
  },
]

const fallbackShowcaseItems = [
  {
    title: 'Yeni Gelenler',
    description: 'Son eklenen ürünleri ve kategorileri hızlıca gözden geçirin.',
    href: '/urunler?sort=newest',
  },
  {
    title: 'Marka Günleri',
    description: 'Markalara göre ilerleyip ihtiyaç duyduğunuz ürünleri daha hızlı bulun.',
    href: '/markalar',
  },
  {
    title: 'Hızlı Katalog',
    description: 'Klinik ihtiyaçlarınıza uygun ürünleri filtreleyerek doğrudan listeye geçin.',
    href: '/urunler',
  },
]

export function HeroSection({ campaigns = [], products = [] }: HeroSectionProps) {
  const displayCampaigns = (campaigns.length > 0 ? campaigns : fallbackCampaigns).slice(0, 5)
  const showFallbackTag = campaigns.length === 0
  const showcaseProducts = [
    ...products.filter((product) => product.primary_image),
    ...products.filter((product) => !product.primary_image),
  ].slice(0, 3)

  const showcaseItems = showcaseProducts.length > 0
    ? showcaseProducts.map((product) => ({
        title: product.name,
        description: product.brand_name ?? 'Öne çıkan ürün seçkisi',
        href: `/urunler/${product.slug}`,
        imagePath: product.primary_image,
      }))
    : fallbackShowcaseItems

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-sky-50 via-white to-transparent" aria-hidden="true" />
      <div className="container-main relative py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_340px] xl:gap-8">
          <HeroCampaignCarousel campaigns={displayCampaigns} showFallbackTag={showFallbackTag} />

          <aside className="hidden lg:block">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 shadow-[0_24px_55px_-42px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hızlı keşif</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">Öne çıkan seçki</h2>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-primary shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {showcaseItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-[1.35rem] border border-slate-200 bg-white p-3.5 transition-colors hover:border-primary/20 hover:bg-primary/[0.02]"
                  >
                    {'imagePath' in item && item.imagePath ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                        <Image
                          src={getImageUrl(item.imagePath)}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-contain p-2.5"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-primary">
                        <Package className="h-5 w-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{item.description}</p>
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
                  </Link>
                ))}
              </div>

              <Link
                href="/urunler"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-blue-700"
              >
                Tüm ürünleri keşfet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

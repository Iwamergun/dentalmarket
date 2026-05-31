import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Stethoscope, Zap } from 'lucide-react'
import type { Campaign } from '@/lib/supabase/queries/campaigns'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface HeroSectionProps {
  campaigns?: Campaign[]
}

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

export function HeroSection({ campaigns = [] }: HeroSectionProps) {
  const displayCampaigns = (campaigns.length > 0 ? campaigns : fallbackCampaigns).slice(0, 4)
  const showFallbackTag = campaigns.length === 0
  const getFallbackGradientClass = (index: number) =>
    index % 2 === 0
      ? 'bg-gradient-to-br from-primary via-primary/85 to-secondary'
      : 'bg-gradient-to-br from-secondary via-secondary/85 to-accent'

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,245,250,0.96))]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      <div className="container-main relative py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center rounded-full border border-secondary/15 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                DentalmarketTR
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/10 bg-white px-3 py-1 text-xs font-medium text-secondary-text">
                Gerçek kampanyalar ilk bakışta görünüyor
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-5xl lg:text-[3.25rem]">
              Diş hekimleri için daha temiz, daha hızlı ve daha güvenilir bir satın alma akışı.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-secondary-text md:text-lg">
              Binlerce dental ürün, güvenilir tedarikçiler ve klinik satın alma ekipleri için sade bir keşif akışı.
              Aşağıdaki kampanya kartlarıyla güncel fırsatları ilk ekranda görün.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/urunler"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-semibold text-white shadow-premium transition-all duration-200 hover:bg-primary/90"
              >
                Ürünleri Keşfet
              </Link>
              <Link
                href="/kategoriler"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-white px-8 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-secondary/30 hover:text-secondary"
              >
                Kategoriler
              </Link>
            </div>

            <div className="rounded-[2rem] border border-primary/10 bg-white/80 p-4 shadow-card backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Öne çıkan kampanyalar</p>
                  <p className="mt-1 text-sm text-secondary-text">İlk ekranda görünen fırsatlar</p>
                </div>
                {showFallbackTag && (
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
                    Demo kartlar
                  </span>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0">
                {displayCampaigns.map((campaign, index) => (
                  <Link
                    key={campaign.id}
                    href={campaign.href || '/kampanyalar'}
                    className="group min-w-[240px] overflow-hidden rounded-[1.5rem] border border-border/70 bg-white text-left shadow-subtle transition-transform duration-200 hover:-translate-y-1 hover:shadow-card lg:min-w-0"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {campaign.image_path ? (
                        <Image
                          src={getImageUrl(campaign.image_path)}
                          alt={campaign.title}
                          width={640}
                          height={360}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 1024px) 240px, 320px"
                        />
                      ) : (
                        <div className={`flex h-full w-full items-end p-4 text-white ${getFallbackGradientClass(index)}`}>
                          <span className="rounded-xl bg-black/15 px-3 py-1.5 text-sm font-semibold backdrop-blur">
                            {campaign.title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 px-4 py-3">
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
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">{campaign.title}</p>
                      <p className="line-clamp-2 text-sm leading-6 text-secondary-text">
                        {campaign.description || 'Aktif kampanyaları görüntüleyin ve teklif detaylarını inceleyin.'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-white/80 px-4 py-4 shadow-subtle">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">Güvenilir tedarik</p>
                <p className="mt-1 text-sm text-secondary-text">Doğrulanmış satıcı ve net sipariş akışı.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-white/80 px-4 py-4 shadow-subtle">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">Klinik odaklı seçim</p>
                <p className="mt-1 text-sm text-secondary-text">Muayenehane ve laboratuvar için hızlı keşif.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-white/80 px-4 py-4 shadow-subtle">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">Sade deneyim</p>
                <p className="mt-1 text-sm text-secondary-text">Daha az gürültü, daha net karar alanı.</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-border/60 bg-white/80 p-6 shadow-premium backdrop-blur-sm">
              <div className="rounded-[1.5rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,250,0.95))] p-8">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-text">Hızlı Özet</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">Klinik satın alma paneli</p>
                  </div>
                  <div className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                    B2B
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-secondary-text">Öne çıkan avantaj</p>
                    <p className="mt-2 text-base font-semibold text-foreground">Tek yüzeyde teklif, stok ve sipariş kontrolü</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-secondary-text">Ürün Havuzu</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">10.000+</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-secondary-text">Marka</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">500+</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-secondary/20 bg-gradient-to-r from-secondary/10 to-accent/10 p-4">
                    <p className="text-sm font-medium text-body-text">
                      Daha sakin görsel dil, daha net ürün keşfi ve daha az dikkat dağınıklığı.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import type { Campaign } from '@/lib/supabase/queries/campaigns'
import { HeroCampaignCarousel } from './hero-campaign-carousel'

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
  const displayCampaigns = (campaigns.length > 0 ? campaigns : fallbackCampaigns).slice(0, 5)
  const showFallbackTag = campaigns.length === 0

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,245,250,0.96))]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      <div className="container-main relative py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Left column: auto-sliding campaign carousel */}
          <HeroCampaignCarousel campaigns={displayCampaigns} showFallbackTag={showFallbackTag} />

          {/* Right column: Klinik satın alma paneli */}
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

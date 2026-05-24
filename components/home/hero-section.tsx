import Link from 'next/link'
import { Sparkles, ShieldCheck, Stethoscope } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,245,250,0.96))]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      <div className="container-main relative py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-white/80 px-4 py-2 text-sm font-semibold text-secondary shadow-subtle">
              <Sparkles className="h-4 w-4" />
              Spark seçkisi, daha sade bir ana sayfa deneyimi
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Diş hekimleri için daha temiz, daha hızlı ve daha güvenilir bir satın alma akışı.
            </h1>

            <p className="max-w-2xl text-base leading-8 text-secondary-text md:text-lg">
              Binlerce dental ürün, güvenilir tedarikçiler ve iş akışını yormayan sade bir arayüz.
              İhtiyacınız olan ekipmana hızlıca ulaşın, teklifleri karşılaştırın ve siparişi güvenle tamamlayın.
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
                  <Sparkles className="h-5 w-5" />
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

import type { Metadata } from 'next'
import { SearchCheck, Truck, PackageCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kargo Takibi',
  description: 'Sipariş kargo durumunuzu kolayca takip edin.',
}

export default function KargoTakibiPage() {
  return (
    <div className="container-main py-10 md:py-14">
      <div className="rounded-[32px] border border-primary/10 bg-white/95 p-6 shadow-[0_24px_48px_-36px_rgba(15,23,42,0.65)] backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Sipariş</p>
        <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">Kargo Takibi</h1>
        <p className="mt-3 max-w-2xl text-sm text-text-secondary md:text-base">
          Sipariş numaranız ile kargonuzun hazırlık, dağıtım ve teslimat adımlarını bu sayfadan hızlıca takip
          edebilirsiniz.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-4">
            <SearchCheck className="h-5 w-5 text-secondary" />
            <p className="mt-2 text-sm font-semibold text-primary">Sipariş Numaranızı Hazırlayın</p>
            <p className="mt-1 text-xs text-text-secondary">Siparişlerim sayfasındaki numarayı kopyalayın.</p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-4">
            <Truck className="h-5 w-5 text-secondary" />
            <p className="mt-2 text-sm font-semibold text-primary">Anlık Durumu Görün</p>
            <p className="mt-1 text-xs text-text-secondary">Hazırlanıyor, yolda veya teslim edildi adımlarını izleyin.</p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-4">
            <PackageCheck className="h-5 w-5 text-secondary" />
            <p className="mt-2 text-sm font-semibold text-primary">Teslimat Bilgisi</p>
            <p className="mt-1 text-xs text-text-secondary">Teslimat tamamlandığında sipariş kaydınız güncellenir.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

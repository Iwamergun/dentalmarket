import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          Dental Market&apos;e Hoş Geldiniz
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Diş hekimliği ürünleri ve ekipmanları için önde gelen B2B e-ticaret platformu
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/urunler">
            <Button size="lg">Ürünleri Keşfet</Button>
          </Link>
          <Link href="/kategoriler">
            <Button variant="outline" size="lg">
              Kategorileri Gör
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900">Neden Dental Market?</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Geniş Ürün Yelpazesi</h3>
            <p className="mt-2 text-gray-600">
              Diş hekimliği için ihtiyacınız olan tüm ürünler tek bir platformda
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Güvenilir Tedarikçiler</h3>
            <p className="mt-2 text-gray-600">
              Sertifikalı ve güvenilir tedarikçilerden en iyi fiyatlar
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold">Hızlı Teslimat</h3>
            <p className="mt-2 text-gray-600">
              Siparişlerinizi en kısa sürede teslim alın
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

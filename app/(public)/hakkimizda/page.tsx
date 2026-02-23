import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { Users, Target, Eye, TrendingUp, Shield, Heart, Star, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakkımızda - DentalMarket',
  description: 'DentalMarket hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz.',
}

const stats = [
  { value: '500+', label: 'Marka' },
  { value: '10.000+', label: 'Ürün' },
  { value: '5.000+', label: 'Klinik' },
  { value: '15+', label: 'Yıl Deneyim' },
]

const values = [
  { icon: Shield, title: 'Güvenilirlik', description: 'Tüm ürünlerimiz orijinal ve sertifikalıdır.' },
  { icon: Heart, title: 'Müşteri Odaklılık', description: 'Müşteri memnuniyeti her zaman önceliğimizdir.' },
  { icon: Star, title: 'Kalite', description: 'En yüksek kalite standartlarıyla hizmet veriyoruz.' },
  { icon: Clock, title: 'Hız', description: 'Hızlı teslimat ve sürekli stok garantisi.' },
]

export default function HakkimizdaPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Hakkımızda', href: '/hakkimizda' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Hakkımızda</h1>
      </div>

      {/* Biz Kimiz */}
      <section className="mb-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Biz Kimiz</h2>
            <p className="text-gray-600 leading-relaxed">
              DentalMarket, Türkiye&apos;nin önde gelen dental B2B e-ticaret platformudur. 
              Diş hekimleri, klinikler ve dental laboratuvarlar için kapsamlı ürün yelpazesi 
              sunan platformumuz, sektörün ihtiyaçlarını en iyi şekilde karşılamak amacıyla kurulmuştur.
              2010 yılından bu yana güvenilir bir tedarik ortağı olarak sektörde hizmet vermekteyiz.
            </p>
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Misyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Dental sektöründeki profesyonellere en kaliteli ürünleri, en uygun fiyatlarla 
                ve en hızlı şekilde ulaştırarak onların başarısına katkıda bulunmak.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Vizyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Türkiye&apos;nin ve bölgenin en büyük dental tedarik platformu olmak; 
                teknoloji ve inovasyon ile sektörü dönüştürmek.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Rakamlarla Biz */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Rakamlarla Biz</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Değerlerimiz */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Değerlerimiz</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div key={value.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="p-3 bg-primary/10 rounded-xl inline-flex mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

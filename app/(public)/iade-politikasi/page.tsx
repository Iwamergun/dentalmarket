import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'İade ve Değişim Politikası - DentalMarket',
  description: 'DentalMarket iade ve değişim koşulları, süreci ve prosedürü hakkında bilgi alın.',
}

const policies = [
  {
    title: 'İade Koşulları',
    items: [
      'Ürünün satın alma tarihinden itibaren 14 gün içinde iade talebi oluşturulmalıdır.',
      'Ürün, orijinal ambalajında, kullanılmamış ve hasar görmemiş olmalıdır.',
      'Fatura veya fiş ibrazı zorunludur.',
      'Hijyen ürünleri, steril malzemeler ve özel sipariş ürünleri iade kabul edilmez.',
      'İndirimli ve kampanyalı ürünlerde iade koşulları geçerli olmayabilir.',
    ],
  },
  {
    title: 'İade Süreci',
    items: [
      'İade talebi için hesabınızdan "Siparişlerim" bölümünden ilgili siparişi seçin.',
      '"İade Talebi Oluştur" butonuna tıklayın ve iade nedenini belirtin.',
      'Talebiniz 1-2 iş günü içinde incelenir ve size bildirim gönderilir.',
      'Onaylanan iade kargosunu anlaşmalı kargo firması ile gönderin.',
      'Ürün tarafımıza ulaştıktan sonra 3-5 iş günü içinde inceleme yapılır.',
    ],
  },
  {
    title: 'Para İadesi',
    items: [
      'İade onaylandıktan sonra ödeme yönteminize göre geri ödeme gerçekleştirilir.',
      'Kredi kartı ödemelerinde iade 3-10 iş günü içinde hesabınıza yansır.',
      'Banka havalesi ile yapılan ödemeler 2-5 iş günü içinde iade edilir.',
      'İade kargo ücreti müşteri tarafından karşılanır (ürün hatalı veya hasarlı ise kargo ücretsizdir).',
    ],
  },
  {
    title: 'Değişim Koşulları',
    items: [
      'Ürün değişimi, iade koşullarının karşılanması durumunda gerçekleştirilir.',
      'Değişim talebi 14 gün içinde oluşturulmalıdır.',
      'Stokta bulunmayan ürünler için değişim yerine iade yapılır.',
      'Değişim kargo ücretleri taraflarca eşit paylaşılır.',
    ],
  },
]

export default function IadePolitikasiPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'İade Politikası', href: '/iade-politikasi' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">İade ve Değişim Politikası</h1>
        <p className="mt-2 text-gray-600">Alışveriş güvenceniz için iade ve değişim koşullarımız</p>
      </div>

      <div className="space-y-6">
        {policies.map((policy) => (
          <div key={policy.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{policy.title}</h2>
            <ul className="space-y-3">
              {policy.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

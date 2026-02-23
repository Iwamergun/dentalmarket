import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { FaqAccordion } from '@/components/sss/FaqAccordion'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular - DentalMarket',
  description: 'DentalMarket hakkında merak ettiğiniz her şey. Kargo, iade, ödeme ve üyelik sorularının yanıtları.',
}

const faqItems = [
  {
    question: 'DentalMarket\'e nasıl üye olabilirim?',
    answer:
      'Sağ üst köşedeki "Üye Ol" butonuna tıklayarak ad, soyad, e-posta ve şifre bilgilerinizle kolayca üye olabilirsiniz. Üyelik tamamen ücretsizdir.',
  },
  {
    question: 'Kargo süresi ne kadar?',
    answer:
      'Siparişleriniz onaylandıktan sonra genellikle 1-3 iş günü içinde kargoya verilir. Teslimat süreleri bulunduğunuz bölgeye göre değişmekle birlikte ortalama 2-5 iş günüdür.',
  },
  {
    question: 'Kargo ücreti ne kadar?',
    answer:
      '300₺ ve üzeri siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde sabit kargo ücreti uygulanır.',
  },
  {
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer:
      'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm kredi kartı ödemelerinde taksit imkânı mevcuttur.',
  },
  {
    question: 'Ürünü iade edebilir miyim?',
    answer:
      'Satın alma tarihinden itibaren 14 gün içinde, orijinal ambalajında ve kullanılmamış olan ürünleri iade edebilirsiniz. Hijyen ürünleri ve steril malzemelerde iade kabul edilmemektedir. Detaylar için İade Politikası sayfamızı inceleyebilirsiniz.',
  },
  {
    question: 'Fatura kesiliyor mu?',
    answer:
      'Evet, tüm siparişleriniz için e-fatura düzenlenmektedir. Faturanız sipariş onayından sonra e-posta adresinize gönderilir.',
  },
  {
    question: 'Siparişimin durumunu nasıl takip edebilirim?',
    answer:
      'Hesabınıza giriş yaparak "Siparişlerim" bölümünden siparişlerinizin durumunu anlık olarak takip edebilirsiniz. Ayrıca kargo durumu için size SMS ve e-posta bildirimi gönderilir.',
  },
  {
    question: 'Ürün stoğu tükenmişse ne yapabilirim?',
    answer:
      'Ürün sayfasındaki "Stok Bildirimi Al" butonunu kullanarak ürün tekrar stoka girdiğinde e-posta bildirimi alabilirsiniz.',
  },
  {
    question: 'Tedarikçi olarak nasıl başvurabilirim?',
    answer:
      'Tedarikçi başvurusu için info@dentalmarket.com adresine e-posta göndererek veya iletişim formumuzu doldurarak başvurabilirsiniz. Ekibimiz en kısa sürede sizinle iletişime geçecektir.',
  },
  {
    question: 'Toplu alım indirimi var mı?',
    answer:
      'Evet, belirli miktarların üzerindeki alımlarda özel fiyatlar sunulmaktadır. Toplu alım teklifleri için satış ekibimizle iletişime geçebilirsiniz.',
  },
]

export default function SSSPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Sıkça Sorulan Sorular', href: '/sss' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Sıkça Sorulan Sorular</h1>
        <p className="mt-2 text-gray-600">Merak ettiğiniz her şeyin yanıtı burada</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <FaqAccordion items={faqItems} />
      </div>
    </div>
  )
}

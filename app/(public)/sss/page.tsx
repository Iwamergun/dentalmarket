import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import Link from 'next/link'
import { FaqAccordion, type FaqCategory } from './faq-accordion'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular - DentalMarket',
  description: 'DentalMarket hakkında merak ettiğiniz her şey. Sipariş, kargo, iade, ödeme ve hesap güvenliği sorularının yanıtları.',
}

const faqCategories: FaqCategory[] = [
  {
    title: 'Genel',
    icon: 'HelpCircle',
    items: [
      {
        question: 'DentalMarket nedir?',
        answer:
          'DentalMarket, diş hekimleri, klinikler ve dental laboratuvarlar için özel olarak tasarlanmış bir B2B (işletmeden işletmeye) e-ticaret platformudur. Dental sarf malzemelerinden ekipmanlara kadar geniş bir ürün yelpazesini tek bir çatı altında sunmaktadır.',
      },
      {
        question: 'Kimler DentalMarket\'e üye olabilir?',
        answer:
          'Diş hekimleri, ağız ve diş sağlığı klinikleri, dental laboratuvarlar, eczaneler ve dental sektörde faaliyet gösteren tüm sağlık profesyonelleri ve işletmeleri platformumuza üye olabilir.',
      },
      {
        question: 'B2B platform ne demektir?',
        answer:
          'B2B (Business to Business), işletmeden işletmeye satış modelidir. DentalMarket, bireysel tüketicilere değil, dental sektörde faaliyet gösteren profesyonellere ve işletmelere toptan ve perakende ürün satışı yapmaktadır. Bu sayede sektöre özel fiyatlandırma ve fatura avantajları sunulmaktadır.',
      },
    ],
  },
  {
    title: 'Sipariş & Ödeme',
    icon: 'CreditCard',
    items: [
      {
        question: 'Nasıl sipariş verebilirim?',
        answer:
          'Hesabınıza giriş yaptıktan sonra istediğiniz ürünleri sepetinize ekleyin, teslimat adresinizi seçin ve ödeme yönteminizi belirleyerek siparişinizi tamamlayın. Sipariş onayı e-posta adresinize gönderilecektir.',
      },
      {
        question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        answer:
          'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Kredi kartı ödemelerinde taksit seçenekleri mevcuttur. Tüm ödemeler güvenli altyapı üzerinden gerçekleştirilmektedir.',
      },
      {
        question: 'Fatura kesiliyor mu?',
        answer:
          'Evet, tüm siparişleriniz için e-fatura düzenlenmektedir. Faturanız, sipariş onayından sonra kayıtlı e-posta adresinize otomatik olarak gönderilir. Kurumsal fatura bilgilerinizi hesap ayarlarınızdan güncelleyebilirsiniz.',
      },
      {
        question: 'Minimum sipariş tutarı var mı?',
        answer:
          'Hayır, minimum sipariş tutarı bulunmamaktadır. Ancak 500₺ ve üzeri siparişlerde ücretsiz kargo avantajından yararlanabilirsiniz.',
      },
    ],
  },
  {
    title: 'Kargo & Teslimat',
    icon: 'Truck',
    items: [
      {
        question: 'Kargo süresi ne kadar?',
        answer:
          'Siparişleriniz onaylandıktan sonra genellikle 1-3 iş günü içinde kargoya verilir. Teslimat süresi bulunduğunuz bölgeye göre değişmekle birlikte ortalama 2-5 iş günüdür.',
      },
      {
        question: 'Ücretsiz kargo limiti nedir?',
        answer:
          '500₺ ve üzeri siparişlerde kargo tamamen ücretsizdir. Bu tutarın altındaki siparişlerde standart kargo ücreti uygulanmaktadır.',
      },
      {
        question: 'Kargo takibi nasıl yapılır?',
        answer:
          'Siparişiniz kargoya verildiğinde kargo takip numarası SMS ve e-posta ile tarafınıza iletilir. Ayrıca hesabınızdaki "Siparişlerim" bölümünden kargo durumunu anlık olarak takip edebilirsiniz.',
      },
    ],
  },
  {
    title: 'İade & Değişim',
    icon: 'RefreshCw',
    items: [
      {
        question: 'İade süresi ne kadar?',
        answer:
          'Satın alma tarihinden itibaren 14 gün içinde iade talebinde bulunabilirsiniz. Ürünün orijinal ambalajında, kullanılmamış ve hasarsız olması gerekmektedir. Hijyen ürünleri ve steril ambalajı açılmış malzemeler iade kapsamı dışındadır.',
      },
      {
        question: 'Nasıl iade edebilirim?',
        answer:
          'Hesabınızdaki "Siparişlerim" bölümünden ilgili sipariş için iade talebi oluşturabilirsiniz. Talebiniz onaylandıktan sonra ürünü kargo ile tarafımıza gönderebilirsiniz. Detaylı bilgi için İade Politikası sayfamızı inceleyebilirsiniz.',
        link: { href: '/iade-politikasi', label: 'İade Politikası' },
      },
    ],
  },
  {
    title: 'Hesap & Güvenlik',
    icon: 'Shield',
    items: [
      {
        question: 'Şifremi unuttum, nasıl sıfırlayabilirim?',
        answer:
          'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz. Bağlantı üzerinden yeni şifrenizi belirleyebilirsiniz.',
      },
      {
        question: 'KVKK kapsamındaki haklarımı nasıl kullanabilirim?',
        answer:
          '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinize erişim, düzeltme ve silme haklarınız bulunmaktadır. Detaylı bilgi ve başvuru için KVKK Aydınlatma Metni sayfamızı ziyaret edebilirsiniz.',
        link: { href: '/kvkk', label: 'KVKK Aydınlatma Metni' },
      },
    ],
  },
]

export default function SSSPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'SSS', href: '/sss' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Sıkça Sorulan Sorular</h1>
        <p className="mt-2 text-gray-600">Merak ettiğiniz her şeyin yanıtı burada</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <FaqAccordion categories={faqCategories} />
      </div>

      <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Aradığınız cevabı bulamadınız mı?</h2>
        <p className="text-gray-600 mb-4">
          Size yardımcı olmaktan memnuniyet duyarız. Aşağıdaki sayfalarımızı ziyaret edebilir veya bizimle iletişime geçebilirsiniz.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/iletisim"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Bize Ulaşın
          </Link>
          <Link
            href="/kvkk"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            KVKK Aydınlatma
          </Link>
          <Link
            href="/iade-politikasi"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            İade Politikası
          </Link>
        </div>
      </div>
    </div>
  )
}

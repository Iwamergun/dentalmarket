import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - DentalMarket',
  description: 'DentalMarket Gizlilik Politikası - Kişisel verilerinizin nasıl toplandığı ve kullanıldığı hakkında bilgi edinin.',
}

export default function GizlilikPolitikasiPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Gizlilik Politikası</h1>
        <p className="mt-2 text-gray-500 text-sm">Son güncelleme: Ocak 2025</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Gizlilik Politikası Hakkında</h2>
          <p className="text-gray-600 leading-relaxed">
            DentalMarket olarak kişisel verilerinizin gizliliğine büyük önem vermekteyiz. Bu Gizlilik Politikası,
            platformumuzu kullandığınızda hangi kişisel verileri topladığımızı, bu verileri nasıl kullandığımızı
            ve koruduğumuzu açıklamaktadır. Sitemizi kullanarak bu politikayı kabul etmiş sayılırsınız.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Toplanan Kişisel Veriler</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Hizmetlerimizi sunabilmek amacıyla aşağıdaki kişisel veriler toplanmaktadır:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Ad ve soyad</li>
            <li>E-posta adresi</li>
            <li>Telefon numarası</li>
            <li>Fatura ve teslimat adresi</li>
            <li>Sipariş ve ödeme bilgileri</li>
            <li>Çerez verileri ve tarayıcı bilgileri</li>
            <li>IP adresi ve oturum bilgileri</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Verilerin Kullanım Amaçları</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Topladığımız kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Sipariş ve teslimat süreçlerinin yönetilmesi</li>
            <li>Müşteri hizmetleri ve destek taleplerinin karşılanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Pazarlama ve kampanya bildirimlerinin iletilmesi (açık rızanız dahilinde)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Çerez Politikası</h2>
          <p className="text-gray-600 leading-relaxed">
            Sitemizde kullanıcı deneyimini iyileştirmek amacıyla çeşitli çerezler kullanılmaktadır:
            oturum çerezleri (siz tarayıcıyı kapattığınızda silinen geçici çerezler),
            analiz çerezleri (site kullanımını anlamamıza yardımcı olan çerezler) ve
            tercih çerezleri (dil ve bölge gibi ayarlarınızı hatırlayan çerezler).
            Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda
            bazı özellikler düzgün çalışmayabilir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Veri Güvenliği</h2>
          <p className="text-gray-600 leading-relaxed">
            Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri
            uygulanmaktadır: SSL/TLS şifreleme ile veri iletimi korunmakta, veriler güvenli
            sunucularda depolanmakta ve yetkisiz erişimi önlemek için katı erişim kontrolleri
            uygulanmaktadır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Üçüncü Taraf Paylaşımları</h2>
          <p className="text-gray-600 leading-relaxed">
            Kişisel verileriniz; siparişlerinizin teslim edilebilmesi amacıyla kargo firmaları,
            ödeme işlemlerinin gerçekleştirilebilmesi amacıyla ödeme sağlayıcıları ve
            yasal zorunluluklar kapsamında yetkili kamu kurum ve kuruluşları ile paylaşılabilir.
            Verileriniz bu amaçların dışında üçüncü taraflarla paylaşılmaz veya satılmaz.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Kullanıcı Hakları</h2>
          <p className="text-gray-600 leading-relaxed">
            Kişisel verileriniz üzerinde veriye erişim, yanlış verilerin düzeltilmesini talep etme
            ve belirli koşullar altında verilerinizin silinmesini isteme haklarına sahipsiniz.
            Bu haklarınızı kullanmak için aşağıdaki iletişim bilgilerinden bize ulaşabilirsiniz.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Politika Değişiklikleri</h2>
          <p className="text-gray-600 leading-relaxed">
            Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler yapılması
            halinde kayıtlı e-posta adresinize bildirim gönderilecek ve güncel politika bu sayfada
            yayımlanacaktır. Politikanın en güncel halini düzenli olarak incelemenizi öneririz.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. İletişim</h2>
          <p className="text-gray-600 leading-relaxed">
            Gizlilik politikamıza ilişkin sorularınız veya talepleriniz için{' '}
            <strong>gizlilik@dentalmarket.com</strong> adresine e-posta gönderebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}

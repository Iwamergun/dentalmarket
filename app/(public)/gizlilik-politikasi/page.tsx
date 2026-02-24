import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - DentalMarket',
  description: 'DentalMarket gizlilik politikası. Kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu öğrenin.',
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
            Bu Gizlilik Politikası, DentalMarket A.Ş. tarafından işletilen dentalmarket.com platformunda
            kişisel verilerinizin nasıl toplandığını, hangi amaçlarla kullanıldığını, kimlerle
            paylaşıldığını ve nasıl korunduğunu açıklamaktadır. Dental sektörüne yönelik B2B e-ticaret
            platformumuzda gizliliğinize büyük önem veriyoruz.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            Platformumuzu kullanarak bu Gizlilik Politikası&apos;nda belirtilen uygulamaları kabul etmiş
            sayılırsınız. Politikamız, web sitemizi ziyaret ettiğinizde, üyelik oluşturduğunuzda ve
            hizmetlerimizden yararlandığınızda geçerlidir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Toplanan Kişisel Veriler</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Hizmetlerimizi sunabilmek amacıyla aşağıdaki kişisel verileriniz toplanmaktadır:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası (fatura işlemleri için)</li>
            <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası</li>
            <li><strong>Adres Bilgileri:</strong> Teslimat adresi, fatura adresi</li>
            <li><strong>Sipariş Bilgileri:</strong> Sipariş geçmişi, sepet içeriği, ürün tercihleri</li>
            <li><strong>Ödeme Bilgileri:</strong> Ödeme yöntemi tercihi (kart bilgileri platformumuzda saklanmaz)</li>
            <li><strong>Firma Bilgileri:</strong> Şirket unvanı, vergi dairesi, vergi numarası</li>
            <li><strong>Çerez Verileri:</strong> Tarayıcı türü, cihaz bilgileri, oturum verileri</li>
            <li><strong>IP Adresi:</strong> Bağlantı bilgileri, ziyaret edilen sayfalar, erişim zamanları</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Verilerin Kullanım Amaçları</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Toplanan kişisel verileriniz aşağıdaki amaçlarla kullanılmaktadır:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Sipariş Yönetimi:</strong> Siparişlerinizin alınması, işlenmesi, kargoya verilmesi ve teslimat süreçlerinin yürütülmesi</li>
            <li><strong>Müşteri Hizmetleri:</strong> Destek taleplerinizin karşılanması, şikâyet ve önerilerinizin değerlendirilmesi</li>
            <li><strong>Hesap Yönetimi:</strong> Üyelik hesabınızın oluşturulması, güncellenmesi ve güvenliğinin sağlanması</li>
            <li><strong>Yasal Yükümlülükler:</strong> Fatura düzenleme, vergi mevzuatı ve diğer yasal gerekliliklerin yerine getirilmesi</li>
            <li><strong>Pazarlama (Açık Rıza Dahilinde):</strong> Kampanya, indirim ve yeni ürün bilgilendirmeleri yalnızca onayınız dahilinde gönderilir</li>
            <li><strong>Platform İyileştirme:</strong> Kullanıcı deneyiminin analizi ve hizmet kalitesinin artırılması</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Çerez Politikası</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Web sitemizde kullanıcı deneyimini geliştirmek ve hizmetlerimizi optimize etmek amacıyla
            çeşitli çerezler kullanılmaktadır:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Oturum Çerezleri:</strong> Giriş durumunuzun ve sepet bilgilerinizin korunması için zorunlu çerezlerdir. Oturum sonlandığında otomatik olarak silinir.</li>
            <li><strong>Analiz Çerezleri:</strong> Google Analytics ve benzeri araçlar aracılığıyla ziyaretçi istatistiklerinin toplanması ve platform performansının ölçülmesi için kullanılır.</li>
            <li><strong>Tercih Çerezleri:</strong> Dil, bölge ve görüntüleme tercihlerinizin hatırlanarak sonraki ziyaretlerinizde kişiselleştirilmiş deneyim sunulması için kullanılır.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            Tarayıcı ayarlarınızdan çerezleri yönetebilir veya devre dışı bırakabilirsiniz. Ancak
            zorunlu oturum çerezlerinin devre dışı bırakılması platformun işlevselliğini olumsuz
            etkileyebilir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Veri Güvenliği</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Kişisel verilerinizin güvenliği bizim için önceliklidir. Verilerinizi korumak amacıyla
            aşağıdaki teknik ve idari önlemleri uygulamaktayız:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>SSL/TLS Şifreleme:</strong> Tüm veri iletişimleri 256-bit SSL/TLS sertifikası ile uçtan uca şifrelenmektedir</li>
            <li><strong>Güvenli Sunucu Altyapısı:</strong> Verileriniz yüksek güvenlikli ve sertifikalı veri merkezlerinde barındırılmaktadır</li>
            <li><strong>Düzenli Güvenlik Testleri:</strong> Sistemlerimiz periyodik olarak güvenlik taramalarından ve sızma testlerinden geçirilmektedir</li>
            <li><strong>Erişim Kontrolü:</strong> Kişisel verilere yalnızca yetkili personel erişebilir; tüm erişimler kayıt altına alınmaktadır</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Üçüncü Taraf Paylaşımları</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Kişisel verileriniz, hizmetlerimizin sunulabilmesi ve yasal yükümlülüklerin yerine
            getirilmesi amacıyla aşağıdaki üçüncü taraflarla paylaşılabilmektedir:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Kargo Firmaları:</strong> Siparişlerinizin teslimatı için ad, adres ve telefon bilgileriniz anlaşmalı kargo firmalarıyla paylaşılmaktadır</li>
            <li><strong>Ödeme Sağlayıcıları:</strong> Güvenli ödeme işlemlerinin gerçekleştirilmesi için ödeme bilgileriniz lisanslı ödeme kuruluşlarına iletilmektedir</li>
            <li><strong>Kamu Kurumları:</strong> Mahkeme kararları, savcılık talepleri veya yasal düzenlemeler gereği yetkili kamu kurum ve kuruluşlarıyla bilgi paylaşımı yapılabilmektedir</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            Üçüncü taraflarla yalnızca hizmetin gerektirdiği kadar veri paylaşılmakta olup
            verileriniz pazarlama amacıyla üçüncü kişilere satılmamakta veya kiralanmamaktadır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Kullanıcı Hakları</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            6698 sayılı KVKK ve ilgili mevzuat kapsamında aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenen verilerinize erişim talep etme</li>
            <li>Eksik veya yanlış işlenmiş kişisel verilerinizin düzeltilmesini isteme</li>
            <li>Kişisel verilerinizin silinmesini veya yok edilmesini talep etme</li>
            <li>Verilerinizin aktarıldığı üçüncü kişiler hakkında bilgilendirilme</li>
            <li>Otomatik sistemler aracılığıyla analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            Bu haklarınızı kullanmak için <strong>gizlilik@dentalmarket.com</strong> adresine
            e-posta göndererek başvuruda bulunabilirsiniz. Başvurularınız en geç 30 gün içinde
            değerlendirilerek yanıtlanacaktır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Politika Değişiklikleri</h2>
          <p className="text-gray-600 leading-relaxed">
            DentalMarket, bu Gizlilik Politikası&apos;nı herhangi bir zamanda güncelleme hakkını saklı
            tutar. Yapılan değişiklikler platformda yayınlandığı tarihten itibaren geçerli olur.
            Önemli değişiklikler konusunda kayıtlı e-posta adresinize bilgilendirme yapılabilir.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            Kullanıcıların bu sayfayı düzenli olarak ziyaret ederek güncel politikamızı takip
            etmeleri tavsiye edilir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. İletişim</h2>
          <p className="text-gray-600 leading-relaxed">
            Gizlilik politikamız hakkında sorularınız, talepleriniz veya kişisel verilerinize ilişkin
            başvurularınız için{' '}
            <strong>gizlilik@dentalmarket.com</strong> adresine e-posta gönderebilir veya
            İstanbul, Türkiye adresimize yazılı olarak başvurabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}

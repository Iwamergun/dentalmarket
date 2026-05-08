import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları - Dent Alışveriş',
  description: 'Dent Alışveriş Kullanım Koşulları - Platformumuzu kullanırken geçerli olan kural ve koşullar.',
}

export default function KullanimSartlariPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Kullanım Koşulları', href: '/kullanim-sartlari' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Kullanım Koşulları</h1>
        <p className="mt-2 text-gray-500 text-sm">Son güncelleme: Mart 2026</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Genel Hükümler</h2>
          <p className="text-gray-600 leading-relaxed">
            Bu Kullanım Koşulları, Dent Alışveriş platformunu (&quot;Platform&quot;) kullanan tüm ziyaretçi ve
            üyeler (&quot;Kullanıcı&quot;) için geçerlidir. Platformu kullanmaya devam etmekle bu koşulları
            okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. Platform; diş kliniği
            ekipmanları, sarf malzemeleri ve ilgili ürünlerin alım-satımına aracılık eden elektronik
            ticaret hizmetini sunar.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Tanımlar</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Platform:</strong> Dent Alışveriş web sitesi ve mobil uygulaması</li>
            <li><strong>Alıcı:</strong> Platform üzerinden ürün satın alan gerçek veya tüzel kişi</li>
            <li><strong>Satıcı:</strong> Platform üzerinden ürün satan yetkili tedarikçi</li>
            <li><strong>Ürün:</strong> Platform üzerinde listelenen diş kliniği ekipman ve sarf malzemeleri</li>
            <li><strong>Sipariş:</strong> Alıcının Platform üzerinden oluşturduğu satın alma talebi</li>
            <li><strong>Sözleşme:</strong> Alıcı ile Satıcı arasında kurulan mesafeli satış sözleşmesi</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Üyelik ve Hesap Güvenliği</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Platform&apos;a üye olmak için 18 yaşını doldurmuş olmanız ve geçerli bir e-posta adresine
            sahip olmanız gerekmektedir. Üyelik sırasında verdiğiniz bilgilerin doğru ve güncel olduğunu
            beyan edersiniz.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Hesap güvenliğiniz sizin sorumluluğunuzdadır. Şifrenizi kimseyle paylaşmamalı, güçlü ve
            benzersiz bir şifre kullanmalısınız. Hesabınızda yetkisiz erişim tespit etmeniz halinde
            derhal Dent Alışveriş&apos;i bilgilendirmelisiniz.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Sipariş ve Satış Koşulları</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Platform üzerinden verilen siparişler, Satıcı tarafından onaylandığında bağlayıcı hale
            gelir. Sipariş onayı e-posta yoluyla bildirilir. Dent Alışveriş, herhangi bir sipariş
            talebini makul gerekçelerle reddetme hakkını saklı tutar.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Ürün bilgileri, fiyatlar ve stok durumu anlık olarak güncellenmektedir. Sipariş
            tamamlandıktan sonra stok tükenmesi veya teknik hatalar durumunda Dent Alışveriş,
            siparişi iptal edip ödemeyi iade etme hakkına sahiptir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Fiyatlandırma ve Ödeme</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Platform&apos;da belirtilen tüm fiyatlar Türk Lirası (TRY) cinsinden olup KDV dahildir.
            Kargo ücreti, sipariş tutarına ve teslimat adresine göre ayrıca hesaplanır. Ödeme;
            kredi kartı, banka kartı veya havale/EFT yöntemiyle yapılabilir.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Fiyatlar önceden haber verilmeksizin değiştirilebilir. Sipariş anındaki fiyat geçerlidir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Teslimat ve Kargo</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Siparişler, ödeme onayından sonra belirtilen iş günü içinde kargoya verilir. Teslimat
            süreleri ürün stok durumuna ve teslimat adresine göre değişiklik gösterebilir.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Teslimat sırasında ürün paketinde hasar olduğu görülürse, kargo görevlisi huzurunda tutanak
            tutulmalı ve ürün teslim alınmamalıdır. Bu durumda Dent Alışveriş derhal bilgilendirilmelidir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. İade ve İptal Koşulları</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, teslim tarihinden itibaren
            <strong> 14 gün</strong> içinde herhangi bir gerekçe göstermeksizin cayma hakkını
            kullanabilirsiniz. Cayma hakkı kapsamındaki ürünler; orijinal ambalajında, kullanılmamış
            ve hasarsız olmalıdır.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Aşağıdaki durumlarda cayma hakkı kullanılamaz:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-3">
            <li>Ambalajı açılmış, kullanılmış veya sterilizasyon koşulları bozulmuş ürünler</li>
            <li>Kullanıcı tarafından özel olarak üretilen veya kişiselleştirilen ürünler</li>
            <li>Hızlı bozulabilir veya son kullanma tarihi geçmiş ürünler</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            İade taleplerinde kargo ücreti alıcıya aittir. Onaylanan iadeler için ödeme, iadenin
            alınmasından itibaren 14 iş günü içinde iade edilir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Garanti Koşulları</h2>
          <p className="text-gray-600 leading-relaxed">
            Platform&apos;da satışa sunulan ürünler, üretici firmanın sunduğu garanti kapsamındadır.
            Garanti süresi ve koşulları ürün sayfasında belirtilmektedir. Garanti kapsamındaki arızalar
            için Satıcı veya yetkili servis ile iletişime geçilmelidir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Fikri Mülkiyet Hakları</h2>
          <p className="text-gray-600 leading-relaxed">
            Platform&apos;da yer alan tüm içerik, tasarım, logo, metin, görsel ve yazılım unsurları
            Dent Alışveriş&apos;e aittir ve telif hakkı yasaları ile korunmaktadır. Bu içeriklerin
            önceden yazılı izin alınmaksızın kopyalanması, çoğaltılması veya dağıtılması yasaktır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Sorumluluk Sınırları</h2>
          <p className="text-gray-600 leading-relaxed">
            Dent Alışveriş, Platform&apos;da yer alan üçüncü taraf satıcı ürünlerinin kalitesi ve
            uygunluğu konusunda aracı konumundadır. Teknik arızalar, internet kesintileri veya
            mücbir sebepler nedeniyle oluşan zararlardan Dent Alışveriş sorumlu tutulamaz.
            Platform&apos;un azami sorumluluğu, ilgili sipariş tutarı ile sınırlıdır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">11. Uyuşmazlık Çözümü</h2>
          <p className="text-gray-600 leading-relaxed">
            Bu Kullanım Koşulları&apos;ndan doğan anlaşmazlıklarda Türkiye Cumhuriyeti hukuku
            uygulanır. Uyuşmazlıkların çözümünde İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            Tüketici uyuşmazlıklarında ilgili Tüketici Hakem Heyeti ve Tüketici Mahkemeleri de
            yetkilidir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">12. Değişiklik Hakkı</h2>
          <p className="text-gray-600 leading-relaxed">
            Dent Alışveriş, bu Kullanım Koşulları&apos;nı önceden haber vermeksizin güncelleme
            hakkını saklı tutar. Güncel koşullar Platform&apos;da yayımlanır. Değişikliklerden
            sonra Platform&apos;u kullanmaya devam etmeniz, güncel koşulları kabul ettiğiniz
            anlamına gelir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">13. İletişim</h2>
          <p className="text-gray-600 leading-relaxed">
            Kullanım Koşulları hakkındaki sorularınız için{' '}
            <strong>info@dentalisveris.com</strong> adresine e-posta gönderebilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}

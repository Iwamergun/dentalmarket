import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Kullanım Şartları - DentalMarket',
  description: 'DentalMarket kullanım şartları ve koşulları. Platform kullanımına ilişkin kurallar ve yükümlülükler.',
}

export default function KullanimSartlariPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Kullanım Şartları', href: '/kullanim-sartlari' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Kullanım Şartları</h1>
        <p className="mt-2 text-gray-500 text-sm">Son güncelleme: Ocak 2025</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Genel Hükümler</h2>
          <p className="text-gray-600 leading-relaxed">
            Bu Kullanım Şartları, DentalMarket A.Ş. tarafından işletilen dentalmarket.com web sitesi
            ve ilgili tüm hizmetlerin kullanımını düzenlemektedir. Platformumuzu ziyaret ederek,
            üyelik oluşturarak veya herhangi bir hizmetimizden yararlanarak bu şartları okuduğunuzu,
            anladığınızı ve kabul ettiğinizi beyan etmiş sayılırsınız.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            DentalMarket, dental sektörde faaliyet gösteren profesyonellere ve işletmelere yönelik
            bir B2B e-ticaret platformudur. Platform üzerinden sunulan tüm hizmetler bu şartlara tabidir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Üyelik Koşulları</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Platformumuza üye olabilmek ve hizmetlerimizden yararlanabilmek için aşağıdaki koşulların
            sağlanması gerekmektedir:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>18 yaşını doldurmuş ve tam ehliyetli gerçek kişi olmak veya tüzel kişi adına yetkili olmak</li>
            <li>Kayıt sırasında doğru, güncel ve eksiksiz bilgi vermek</li>
            <li>Hesap bilgilerinin gizliliğini korumak ve üçüncü kişilerle paylaşmamak</li>
            <li>Hesap üzerinden gerçekleştirilen tüm işlemlerden şahsen sorumlu olmak</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            DentalMarket, herhangi bir gerekçe göstermeksizin üyelik başvurularını reddetme veya
            mevcut üyelikleri askıya alma ya da sonlandırma hakkını saklı tutar.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Sipariş ve Ödeme</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Platform üzerinden verilen siparişlere ilişkin aşağıdaki koşullar geçerlidir:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Siparişler, ödeme onayının alınmasının ardından işleme alınır ve sipariş onayı e-posta ile bildirilir</li>
            <li>Ürün fiyatları önceden haber verilmeksizin değiştirilebilir; sipariş anındaki fiyat geçerlidir</li>
            <li>Ödeme; kredi kartı, banka kartı veya havale/EFT yöntemleriyle yapılabilir</li>
            <li>Stok durumuna bağlı olarak sipariş kısmen veya tamamen iptal edilebilir; bu durumda ödeme iade edilir</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            Tüm ödemeler, güvenli ödeme altyapısı üzerinden gerçekleştirilmektedir. Ödeme bilgileriniz
            şifrelenerek korunmakta olup DentalMarket tarafından saklanmamaktadır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Ürün Bilgileri</h2>
          <p className="text-gray-600 leading-relaxed">
            Platformumuzda yer alan ürün görselleri temsili niteliktedir ve gerçek ürünle renk, boyut
            veya ambalaj açısından farklılık gösterebilir. Ürün teknik özellikleri, açıklamaları ve
            kullanım bilgileri üretici firma tarafından sağlanan verilere dayanmaktadır.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            DentalMarket, ürün bilgilerinin doğruluğu konusunda azami özeni göstermekle birlikte,
            üretici kaynaklı bilgi değişikliklerinden sorumlu tutulamaz. Güncel ve detaylı teknik
            bilgiler için üretici firmanın resmi kaynaklarına başvurulması tavsiye edilir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Fikri Mülkiyet Hakları</h2>
          <p className="text-gray-600 leading-relaxed">
            DentalMarket platformunda yer alan tüm içerikler — logo, tasarım, metin, görsel, grafik,
            yazılım, veri tabanı yapısı ve diğer materyaller dahil olmak üzere — DentalMarket A.Ş.&apos;nin
            mülkiyetindedir ve Türkiye Cumhuriyeti fikri mülkiyet mevzuatı kapsamında korunmaktadır.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            Bu içeriklerin DentalMarket&apos;in yazılı izni olmaksızın kopyalanması, çoğaltılması,
            dağıtılması, yeniden yayınlanması veya ticari amaçla kullanılması yasaktır.
            İhlal durumunda yasal işlem başlatılma hakkı saklıdır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Sorumluluk Sınırlaması</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            DentalMarket, aşağıdaki durumlardan kaynaklanan doğrudan veya dolaylı zararlardan
            sorumlu tutulamaz:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Teknik bakım, güncelleme veya mücbir sebepler nedeniyle oluşan platform kesintileri</li>
            <li>Üçüncü taraf hizmet sağlayıcılarının (kargo, ödeme sistemi vb.) neden olduğu aksaklıklar</li>
            <li>Kullanıcının hesap bilgilerini koruyamamasından kaynaklanan yetkisiz erişimler</li>
            <li>İnternet bağlantısı, tarayıcı uyumsuzluğu veya kullanıcı kaynaklı teknik sorunlar</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            DentalMarket, platformun kesintisiz ve hatasız çalışacağını garanti etmez. Planlı bakım
            çalışmaları mümkün olduğunca önceden duyurulur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Değişiklikler</h2>
          <p className="text-gray-600 leading-relaxed">
            DentalMarket, bu Kullanım Şartları&apos;nı herhangi bir zamanda, önceden bildirimde
            bulunmaksızın güncelleme ve değiştirme hakkını saklı tutar. Yapılan değişiklikler,
            platformda yayınlandığı tarihten itibaren geçerli olur.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            Kullanıcıların, Kullanım Şartları&apos;nı düzenli olarak gözden geçirmesi tavsiye edilir.
            Değişiklik sonrasında platformu kullanmaya devam etmeniz, güncellenmiş şartları
            kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Uygulanacak Hukuk</h2>
          <p className="text-gray-600 leading-relaxed">
            Bu Kullanım Şartları, Türkiye Cumhuriyeti kanunlarına tabi olup bu şartlardan doğan
            veya bu şartlarla ilgili her türlü uyuşmazlığın çözümünde İstanbul Mahkemeleri ve
            İcra Daireleri yetkilidir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. İletişim</h2>
          <p className="text-gray-600 leading-relaxed">
            Kullanım Şartları hakkında sorularınız veya talepleriniz için{' '}
            <strong>info@dentalmarket.com</strong> adresine e-posta gönderebilir veya{' '}
            İstanbul adresimize yazılı olarak başvurabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}

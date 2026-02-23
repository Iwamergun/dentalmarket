import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni - DentalMarket',
  description: 'DentalMarket KVKK (Kişisel Verilerin Korunması Kanunu) Aydınlatma Metni',
}

export default function KvkkPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'KVKK', href: '/kvkk' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">KVKK Aydınlatma Metni</h1>
        <p className="mt-2 text-gray-500 text-sm">Son güncelleme: Ocak 2025</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Veri Sorumlusu</h2>
          <p className="text-gray-600 leading-relaxed">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz;
            veri sorumlusu sıfatıyla DentalMarket A.Ş. tarafından aşağıda açıklanan kapsamda
            işlenebilecektir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Kişisel Verilerin İşlenme Amacı</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Üyelik işlemlerinin gerçekleştirilmesi ve üyelik hesabının yönetilmesi</li>
            <li>Sipariş, ödeme ve teslimat süreçlerinin yönetilmesi</li>
            <li>Müşteri hizmetleri ve destek taleplerinin karşılanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Güvenlik ve dolandırıcılık önleme faaliyetleri</li>
            <li>Pazarlama ve reklam faaliyetleri (açık rızanız dahilinde)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Kişisel Verilerin Aktarılması</h2>
          <p className="text-gray-600 leading-relaxed">
            Kişisel verileriniz; hizmetlerin sunulabilmesi amacıyla iş ortaklarımıza, tedarikçilerimize,
            kargo firmalarına ve yasal zorunluluklar kapsamında kamu kurum ve kuruluşlarına aktarılabilir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
          <p className="text-gray-600 leading-relaxed">
            Kişisel verileriniz; web sitesi, mobil uygulama, çağrı merkezi ve benzeri kanallar aracılığıyla
            sözleşmenin ifası, yasal yükümlülüklerin yerine getirilmesi ve meşru menfaat hukuki
            sebeplerine dayanılarak toplanmaktadır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Veri Sahibinin Hakları</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
            <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkması halinde buna itiraz etme</li>
            <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. İletişim</h2>
          <p className="text-gray-600 leading-relaxed">
            KVKK kapsamındaki haklarınızı kullanmak için{' '}
            <strong>kvkk@dentalmarket.com</strong> adresine e-posta gönderebilir veya{' '}
            İstanbul adresimize yazılı olarak başvurabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  )
}

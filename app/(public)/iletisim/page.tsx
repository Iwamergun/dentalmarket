import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { IletisimForm } from '@/components/iletisim/IletisimForm'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'İletişim - DentalMarket',
  description: 'DentalMarket ile iletişime geçin. Sorularınızı yanıtlamak için buradayız.',
}

export default function IletisimPage() {
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'İletişim', href: '/iletisim' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">İletişim</h1>
        <p className="mt-2 text-gray-600">Bizimle iletişime geçin, en kısa sürede yanıt verelim.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Mesaj Gönderin</h2>
          <IletisimForm />
        </div>

        {/* İletişim Bilgileri */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">E-posta</p>
                <p className="text-sm text-gray-600">info@dentalmarket.com</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Telefon</p>
                <p className="text-sm text-gray-600">+90 (850) 123 45 67</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Adres</p>
                <p className="text-sm text-gray-600">İstanbul, Türkiye</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Çalışma Saatleri</p>
                <p className="text-sm text-gray-600">Pazartesi - Cuma: 09:00 - 18:00</p>
                <p className="text-sm text-gray-600">Cumartesi: 10:00 - 14:00</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontrol Paneli - Dental Market',
  description: 'Dental Market kontrol paneli',
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Kontrol Paneli</h1>
      <p className="mt-2 text-gray-600">
        Hesabınızı ve siparişlerinizi yönetin
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-xl font-semibold">Siparişlerim</h3>
          <p className="mt-2 text-gray-600">
            Aktif ve geçmiş siparişlerinizi görüntüleyin
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-xl font-semibold">Favorilerim</h3>
          <p className="mt-2 text-gray-600">
            Favori ürünlerinizi yönetin
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-xl font-semibold">Hesap Ayarları</h3>
          <p className="mt-2 text-gray-600">
            Profil ve şirket bilgilerinizi güncelleyin
          </p>
        </div>
      </div>
    </div>
  )
}

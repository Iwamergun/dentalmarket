export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="mt-1 text-sm text-gray-500">
          Yönetim paneli ayarları için temel başlangıç görünümü.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Genel Ayarlar</h2>
        <p className="mt-2 text-sm text-gray-600">
          Bildirimler, panel tercihleri ve gelişmiş ayarlar bu alanda konumlandırılacaktır.
        </p>
      </div>
    </div>
  )
}

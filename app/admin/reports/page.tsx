const reportCards = [
  {
    title: 'Aylık Ciro',
    value: '₺145.320,00',
    change: '+6.2%',
  },
  {
    title: 'Ortalama Sipariş Tutarı',
    value: '₺2.184,00',
    change: '+2.1%',
  },
  {
    title: 'İptal Oranı',
    value: '%1.8',
    change: '-0.4%',
  },
]

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
        <p className="mt-1 text-sm text-gray-500">
          Yönetim paneli rapor görünümü için geçici metrik kartları.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportCards.map((report) => (
          <div key={report.title} className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{report.title}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{report.value}</p>
            <p className="mt-2 text-sm text-emerald-600">{report.change}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

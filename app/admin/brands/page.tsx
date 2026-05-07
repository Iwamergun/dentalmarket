import { adminBrandsMock } from '@/lib/admin/mock-data'

export default function AdminBrandsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Markalar</h1>
        <p className="mt-1 text-sm text-gray-500">
          Yönetim arayüzü için geçici marka özeti.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Marka</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Ürün Sayısı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {adminBrandsMock.map((brand) => (
              <tr key={brand.id}>
                <td className="px-4 py-3 text-gray-900 font-medium">{brand.name}</td>
                <td className="px-4 py-3 text-right text-gray-700">{brand.productCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

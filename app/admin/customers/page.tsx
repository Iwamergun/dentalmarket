import { adminCustomersMock } from '@/lib/admin/mock-data'

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
        <p className="mt-1 text-sm text-gray-500">
          Yönetim arayüzü için geçici müşteri listesi.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Firma</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">E-posta</th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">Toplam Sipariş</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Son Sipariş</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {adminCustomersMock.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3 text-gray-900 font-medium">{customer.companyName}</td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3 text-center text-gray-700">{customer.totalOrders}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {new Date(customer.lastOrderDate).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

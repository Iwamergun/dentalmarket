'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  total: string
  status: string
  created_at: string
  profiles?: { company_name: string | null }
}

interface RecentOrdersProps {
  orders: Order[]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Ödendi', className: 'bg-green-100 text-green-800' },
  shipped: { label: 'Kargoda', className: 'bg-blue-100 text-blue-800' },
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">Henüz sipariş yok</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="px-6 py-3 font-medium">Sipariş No</th>
              <th className="px-6 py-3 font-medium">Müşteri</th>
              <th className="px-6 py-3 font-medium">Toplam</th>
              <th className="px-6 py-3 font-medium">Durum</th>
              <th className="px-6 py-3 font-medium">Tarih</th>
              <th className="px-6 py-3 font-medium">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? {
                label: order.status,
                className: 'bg-gray-100 text-gray-800',
              }

              return (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.profiles?.company_name ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {parseFloat(order.total).toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Görüntüle
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

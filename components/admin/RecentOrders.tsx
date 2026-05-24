'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export interface RecentOrder {
  id: string
  order_number: string
  total: string | number | null
  status: string
  created_at: string
  profiles?: { company_name: string | null }
}

interface RecentOrdersProps {
  orders: RecentOrder[]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Ödendi', className: 'bg-green-100 text-green-800' },
  shipped: { label: 'Kargoda', className: 'bg-blue-100 text-blue-800' },
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-premium backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-secondary/10 via-background to-accent/10 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-text">
            Sipariş Akışı
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Son Siparişler</h2>
        </div>
        <div className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-secondary-text">
          {orders.length} kayıt
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="px-6 py-12 text-center text-secondary-text">Henüz sipariş yok</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-[0.18em] text-secondary-text">
                <th className="px-6 py-4 font-semibold">Sipariş No</th>
                <th className="px-6 py-4 font-semibold">Müşteri</th>
                <th className="px-6 py-4 font-semibold">Toplam</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 font-semibold">Tarih</th>
                <th className="px-6 py-4 font-semibold">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? {
                label: order.status.replace('_', ' '),
                className: 'bg-muted text-foreground',
              }

              return (
                <tr key={order.id} className="border-b border-border/40 transition-colors hover:bg-secondary/5">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    <div className="inline-flex rounded-full border border-border/60 bg-background px-3 py-1 font-mono text-xs text-secondary">
                      {order.order_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-body-text">
                    {order.profiles?.company_name ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {Number(order.total ?? 0).toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-text">
                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-white"
                    >
                      Görüntüle
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

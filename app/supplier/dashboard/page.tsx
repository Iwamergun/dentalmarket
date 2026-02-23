import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import StatsCard from '@/components/admin/StatsCard'

export default async function SupplierDashboardPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const supplierId = session?.user.id

  // Get supplier's product IDs
  const { data: supplierProducts } = await supabase
    .from('catalog_products')
    .select('id')
    .eq('supplier_id', supplierId!)

  const productIds = (supplierProducts ?? []).map((p) => p.id)
  const productsCount = productIds.length

  // Get orders for supplier's products
  const { data: supplierOrderItems } = productIds.length > 0
    ? await supabase
        .from('order_items')
        .select('order_id, quantity, unit_price, total_price, orders!inner(id, status, total, created_at, order_number)')
        .in('product_id', productIds)
    : { data: [] }

  const { data: recentOrderItems } = productIds.length > 0
    ? await supabase
        .from('order_items')
        .select('order_id, quantity, unit_price, total_price, orders!inner(id, status, total, created_at, order_number)')
        .in('product_id', productIds)
        .order('created_at', { referencedTable: 'orders', ascending: false })
        .limit(5)
    : { data: [] }

  const activeOrders = new Set(
    (supplierOrderItems ?? []).filter((item) => {
      const order = item.orders as { status: string } | null
      return order && !['delivered', 'cancelled'].includes(order.status)
    }).map((item) => item.order_id)
  ).size

  const pendingOrders = new Set(
    (supplierOrderItems ?? []).filter((item) => {
      const order = item.orders as { status: string } | null
      return order && order.status === 'pending'
    }).map((item) => item.order_id)
  ).size

  const totalRevenue = (supplierOrderItems ?? []).reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  )

  const statusLabels: Record<string, string> = {
    pending: 'Bekliyor',
    processing: 'İşleniyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Toplam Ürün"
          value={productsCount ?? 0}
          icon="Package"
        />
        <StatsCard
          title="Aktif Sipariş"
          value={activeOrders}
          icon="ShoppingCart"
        />
        <StatsCard
          title="Toplam Gelir"
          value={`₺${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          icon="TrendingUp"
        />
        <StatsCard
          title="Bekleyen Sipariş"
          value={pendingOrders}
          icon="ShoppingCart"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(recentOrderItems ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Henüz sipariş yok
                  </td>
                </tr>
              ) : (
                (recentOrderItems ?? []).map((item, index) => {
                  const order = item.orders as {
                    id: string
                    status: string
                    total: number
                    created_at: string
                    order_number: string
                  } | null
                  if (!order) return null
                  return (
                    <tr key={`${order.id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{order.order_number}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-600">
                        ₺{Number(item.total_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

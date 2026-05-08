import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { requireAdminAccess } from '@/lib/auth/require-admin'

export const metadata = { title: 'Raporlar | Admin' }

// ─── Helper ─────────────────────────────────────────────────────────────────
function currency(value: number) {
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺'
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'blue',
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ComponentType<{ className?: string }>
  accent?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colors[accent]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default async function AdminReportsPage() {
  await requireAdminAccess()

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
          } catch {
            // Server Component
          }
        },
      },
    }
  )

  // Date boundaries
  const now = new Date()

  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  weekStart.setHours(0, 0, 0, 0)

  const monthStart = new Date(now)
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [
    { data: allOrders },
    { data: todayOrdersData },
    { data: weekOrdersData },
    { data: monthOrdersData },
    { count: cancelledCount },
    { data: topItemsData },
  ] = await Promise.all([
    // All orders for overall stats
    supabase.from('orders').select('total, status, created_at').order('created_at', { ascending: false }),
    // Today's orders
    supabase.from('orders').select('total, status').gte('created_at', todayStart.toISOString()),
    // Last 7 days
    supabase.from('orders').select('total, status').gte('created_at', weekStart.toISOString()),
    // This month
    supabase.from('orders').select('total, status').gte('created_at', monthStart.toISOString()),
    // Cancelled orders
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    // Top selling products (by order item count)
    supabase
      .from('order_items')
      .select('product_id, quantity, total_price, catalog_products(name, sku)')
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  // ── Revenue calculations ──────────────────────────────────────────────────
  const sumRevenue = (orders: { total: string | number }[] | null) =>
    (orders ?? []).reduce((s, o) => s + parseFloat(String(o.total)), 0)

  const totalRevenue = sumRevenue(allOrders)
  const todayRevenue = sumRevenue(todayOrdersData)
  const weekRevenue = sumRevenue(weekOrdersData)
  const monthRevenue = sumRevenue(monthOrdersData)

  // ── Order status breakdown ────────────────────────────────────────────────
  const statusCount = (status: string) =>
    (allOrders ?? []).filter((o) => o.status === status).length

  const totalOrders = (allOrders ?? []).length
  const pendingOrders = statusCount('pending')
  const shippedOrders = statusCount('shipped')
  const deliveredOrders = statusCount('delivered')

  // ── Top products ─────────────────────────────────────────────────────────
  interface TopItemRow {
    product_id: string
    quantity: number
    total_price: string | number
    catalog_products: { name: string; sku: string } | null
  }

  const productMap = new Map<
    string,
    { name: string; sku: string; quantity: number; revenue: number }
  >()

  ;(topItemsData as unknown as TopItemRow[] ?? []).forEach((item) => {
    const pid = item.product_id
    const product = item.catalog_products
    const name = product?.name ?? pid
    const sku = product?.sku ?? '-'
    const existing = productMap.get(pid)
    if (existing) {
      existing.quantity += item.quantity
      existing.revenue += parseFloat(String(item.total_price))
    } else {
      productMap.set(pid, {
        name,
        sku,
        quantity: item.quantity,
        revenue: parseFloat(String(item.total_price)),
      })
    }
  })

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)

  // ── Last 30 days daily revenue (mini trend) ───────────────────────────────
  const last30Start = new Date(now)
  last30Start.setDate(now.getDate() - 29)
  last30Start.setHours(0, 0, 0, 0)

  const recentOrders = (allOrders ?? []).filter(
    (o) => new Date(o.created_at) >= last30Start
  )

  const dailyMap = new Map<string, number>()
  recentOrders.forEach((o) => {
    const day = o.created_at.slice(0, 10)
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + parseFloat(String(o.total)))
  })

  const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(last30Start)
    d.setDate(last30Start.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    return { date: key, revenue: dailyMap.get(key) ?? 0 }
  })

  const maxDailyRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 1)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>

      {/* ── Revenue Summary ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ciro Özeti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Toplam Ciro"
            value={currency(totalRevenue)}
            sub={`${totalOrders} sipariş`}
            icon={TrendingUp}
            accent="blue"
          />
          <MetricCard
            label="Bugünkü Ciro"
            value={currency(todayRevenue)}
            sub={`${(todayOrdersData ?? []).length} sipariş`}
            icon={ShoppingCart}
            accent="green"
          />
          <MetricCard
            label="Bu Hafta"
            value={currency(weekRevenue)}
            sub={`${(weekOrdersData ?? []).length} sipariş`}
            icon={ShoppingCart}
            accent="blue"
          />
          <MetricCard
            label="Bu Ay"
            value={currency(monthRevenue)}
            sub={`${(monthOrdersData ?? []).length} sipariş`}
            icon={TrendingUp}
            accent="green"
          />
        </div>
      </section>

      {/* ── Order Status Breakdown ────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sipariş Durumu</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard label="Beklemede" value={pendingOrders} icon={Clock} accent="yellow" />
          <MetricCard label="Kargoda" value={shippedOrders} icon={Truck} accent="blue" />
          <MetricCard label="Teslim Edildi" value={deliveredOrders} icon={CheckCircle} accent="green" />
          <MetricCard label="İptal Edildi" value={cancelledCount ?? 0} icon={XCircle} accent="red" />
          <MetricCard label="Toplam" value={totalOrders} icon={Package} accent="gray" />
        </div>
      </section>

      {/* ── 30-day Revenue Bar Chart ──────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Son 30 Günlük Ciro Trendi</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-end gap-1 h-32">
            {dailyRevenue.map((d) => {
              const heightPct = maxDailyRevenue > 0 ? (d.revenue / maxDailyRevenue) * 100 : 0
              return (
                <div
                  key={d.date}
                  className="flex-1 group relative"
                  title={`${d.date}: ${currency(d.revenue)}`}
                >
                  <div
                    className="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                    {d.date.slice(5)}: {currency(d.revenue)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{dailyRevenue[0]?.date.slice(5)}</span>
            <span>{dailyRevenue[dailyRevenue.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      </section>

      {/* ── Top Products ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">En Çok Satan Ürünler (Top 10)</h2>
        {topProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            Henüz satış verisi yok
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">#</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Ürün</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">SKU</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Satış Adedi</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Toplam Ciro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-900">{p.quantity}</td>
                    <td className="px-6 py-3 text-right text-blue-600 font-semibold">
                      {currency(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

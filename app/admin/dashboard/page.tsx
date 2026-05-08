import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import StatsCard from '@/components/admin/StatsCard'
import RecentOrders from '@/components/admin/RecentOrders'
import type { RecentOrder } from '@/components/admin/RecentOrders'

export default async function AdminDashboardPage() {
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

  const [
    { count: ordersCount },
    { count: productsCount },
    { count: customersCount },
    { data: allOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('catalog_products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'clinic'),
    supabase.from('orders').select('total'),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at, profiles(company_name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const totalRevenue = (allOrders ?? []).reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0
  )

  const normalizedRecentOrders: RecentOrder[] = (recentOrders ?? []).map((order) => {
    const rawProfile: unknown = order.profiles

    return {
      id: order.id,
      order_number: order.order_number,
      total: order.total,
      status: order.status,
      created_at: order.created_at,
      profiles:
        rawProfile &&
        typeof rawProfile === 'object' &&
        'company_name' in rawProfile
          ? {
              company_name:
                typeof rawProfile.company_name === 'string' ? rawProfile.company_name : null,
            }
          : undefined,
    }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Toplam Sipariş"
          value={ordersCount ?? 0}
          icon="ShoppingCart"
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Toplam Gelir"
          value={`₺${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          icon="TrendingUp"
          trend="+8%"
          trendUp={true}
        />
        <StatsCard
          title="Ürünler"
          value={productsCount ?? 0}
          icon="Package"
        />
        <StatsCard
          title="Müşteriler"
          value={customersCount ?? 0}
          icon="Users"
        />
      </div>

      <RecentOrders orders={normalizedRecentOrders} />
    </div>
  )
}

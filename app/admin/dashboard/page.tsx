import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import StatsCard from '@/components/admin/StatsCard'
import RecentOrders from '@/components/admin/RecentOrders'
import type { RecentOrder } from '@/components/admin/RecentOrders'
import { ArrowUpRight, Sparkles, ShieldCheck, Layers3 } from 'lucide-react'

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

  const averageOrderValue =
    (ordersCount ?? 0) > 0 ? totalRevenue / Number(ordersCount ?? 1) : 0

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
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-foreground via-slate-900 to-secondary px-6 py-8 text-white shadow-premium md:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              <Sparkles className="h-4 w-4" />
              Spark Admin Experience
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Yönetim paneliniz artık daha hızlı okunuyor.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
              Sipariş, gelir ve müşteri akışını tek bakışta takip edin. Spark görsel diliyle
              metrikleri, aksiyon alanlarını ve son siparişleri daha belirgin hale getirdik.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Ortalama Sepet</p>
              <p className="mt-2 text-2xl font-semibold">
                ₺{averageOrderValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Sipariş Sağlığı</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Akış aktif
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Odak</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white">
                <Layers3 className="h-4 w-4" />
                Dashboard görünümü
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <RecentOrders orders={normalizedRecentOrders} />

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-premium">
          <div className="border-b border-border/60 bg-gradient-to-r from-accent/10 via-background to-secondary/10 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-text">
              Hızlı Özet
            </p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">Bugünün odak noktaları</h2>
          </div>

          <div className="space-y-4 px-6 py-6">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary-text">Gelir Momentumu</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-semibold text-foreground">Toplam ciro güçlü ilerliyor</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
                  <ArrowUpRight className="h-4 w-4" />
                  +8%
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary-text">Sipariş Hacmi</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {Number(ordersCount ?? 0).toLocaleString('tr-TR')} sipariş takipte
              </p>
              <p className="mt-1 text-sm text-secondary-text">
                Son siparişler aşağıdaki akış kartında detaylı görünüyor.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/10 to-accent/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary-text">Operasyon Notu</p>
              <p className="mt-3 text-sm leading-7 text-body-text">
                Dashboard artık Spark stilinde daha kontrastlı kartlar, premium yüzeyler ve daha okunaklı
                aksiyon alanları kullanıyor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Eye, Truck, CheckCircle, Clock, XCircle, Loader2, ShoppingBag, RefreshCw } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  shipping_cost: number
  total: number
  created_at: string
  updated_at: string
  items_count?: number
}

const statusConfig: Record<string, { label: string; color: 'default' | 'secondary' | 'success' | 'warning' | 'danger'; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Beklemede', color: 'warning', icon: Clock },
  awaiting_payment: { label: 'Ödeme Bekleniyor', color: 'warning', icon: Clock },
  confirmed: { label: 'Onaylandı', color: 'success', icon: CheckCircle },
  processing: { label: 'Hazırlanıyor', color: 'secondary', icon: Package },
  shipped: { label: 'Kargoda', color: 'default', icon: Truck },
  delivered: { label: 'Teslim Edildi', color: 'success', icon: CheckCircle },
  cancelled: { label: 'İptal Edildi', color: 'danger', icon: XCircle },
}

const paymentMethodLabels: Record<string, string> = {
  credit_card: 'Kredi Kartı',
  bank_transfer: 'Havale/EFT',
  cash_on_delivery: 'Kapıda Ödeme',
}

export default function SiparislerimPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: fetchError } = await (supabase as any)
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          payment_status,
          payment_method,
          subtotal,
          shipping_cost,
          total,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        // Tablo yoksa boş liste göster
        if (fetchError.message?.includes('does not exist')) {
          setOrders([])
        } else {
          throw fetchError
        }
      } else {
        // Her sipariş için ürün sayısını al
        const ordersWithCount = await Promise.all(
          (data || []).map(async (order: Order) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { count } = await (supabase as any)
              .from('order_items')
              .select('*', { count: 'exact', head: true })
              .eq('order_id', order.id)
            
            return { ...order, items_count: count || 0 }
          })
        )
        setOrders(ordersWithCount)
      }
    } catch (err) {
      console.error('Siparişler yüklenirken hata:', err)
      setError('Siparişler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  // Loading skeleton
  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 bg-background-card rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-background-card rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background-card rounded-xl border border-border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-background-deep rounded animate-pulse" />
                  <div className="h-4 w-32 bg-background-deep rounded animate-pulse" />
                  <div className="h-4 w-24 bg-background-deep rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-24 bg-background-deep rounded animate-pulse" />
                  <div className="h-10 w-20 bg-background-deep rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Siparişlerim</h1>
          <p className="text-text-secondary">Tüm siparişlerinizi görüntüleyin ve takip edin</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchOrders} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Siparişlerim</h1>
          <p className="text-text-secondary">Tüm siparişlerinizi görüntüleyin ve takip edin</p>
        </div>
        {orders.length > 0 && (
          <Button onClick={fetchOrders} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-background-card rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-deep flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Henüz siparişiniz yok</h2>
          <p className="text-text-secondary mb-6">
            Ürünlerimize göz atarak ilk siparişinizi verebilirsiniz.
          </p>
          <Link href="/urunler">
            <Button>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Alışverişe Başla
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = status.icon
            
            return (
              <div 
                key={order.id} 
                className="bg-background-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-semibold text-text-primary">{order.order_number}</span>
                      <Badge variant={status.color} className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: tr })}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span>{order.items_count || 0} ürün</span>
                      <span>•</span>
                      <span>{paymentMethodLabels[order.payment_method] || order.payment_method}</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-text-muted">Toplam</p>
                      <p className="text-xl font-bold text-primary">
                        {new Intl.NumberFormat('tr-TR', { 
                          style: 'currency', 
                          currency: 'TRY' 
                        }).format(order.total)}
                      </p>
                    </div>
                    <Link href={`/profil/siparislerim/${order.order_number}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Detay
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

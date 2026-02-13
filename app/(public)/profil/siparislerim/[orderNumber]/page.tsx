'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin, 
  CreditCard,
  RefreshCw,
  ShoppingCart,
  Copy,
  Check
} from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface OrderItem {
  id: string
  product_id: string
  variant_id: string | null
  quantity: number
  unit_price: number
  total_price: number
  product?: {
    name: string
    slug: string
    primary_image: string | null
  }
}

interface ShippingAddress {
  first_name: string
  last_name: string
  phone: string
  email: string
  address: string
  city: string
  district: string
  postal_code: string
  notes?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: string
  notes: string | null
  created_at: string
  updated_at: string
}

const statusConfig: Record<string, { 
  label: string
  color: 'default' | 'secondary' | 'success' | 'warning' | 'danger'
  icon: React.ComponentType<{ className?: string }>
  description: string
}> = {
  pending: { 
    label: 'Beklemede', 
    color: 'warning', 
    icon: Clock,
    description: 'Siparişiniz alındı ve işleme alınmayı bekliyor.'
  },
  awaiting_payment: { 
    label: 'Ödeme Bekleniyor', 
    color: 'warning', 
    icon: Clock,
    description: 'Ödemeniz bekleniyor. Ödeme onaylandıktan sonra siparişiniz işleme alınacak.'
  },
  confirmed: { 
    label: 'Onaylandı', 
    color: 'success', 
    icon: CheckCircle,
    description: 'Siparişiniz onaylandı ve hazırlanmak üzere sıraya alındı.'
  },
  processing: { 
    label: 'Hazırlanıyor', 
    color: 'secondary', 
    icon: Package,
    description: 'Siparişiniz şu anda hazırlanıyor.'
  },
  shipped: { 
    label: 'Kargoda', 
    color: 'default', 
    icon: Truck,
    description: 'Siparişiniz kargoya verildi ve yolda.'
  },
  delivered: { 
    label: 'Teslim Edildi', 
    color: 'success', 
    icon: CheckCircle,
    description: 'Siparişiniz başarıyla teslim edildi.'
  },
  cancelled: { 
    label: 'İptal Edildi', 
    color: 'danger', 
    icon: XCircle,
    description: 'Siparişiniz iptal edildi.'
  },
}

const paymentMethodLabels: Record<string, string> = {
  credit_card: 'Kredi Kartı',
  bank_transfer: 'Havale/EFT',
  cash_on_delivery: 'Kapıda Ödeme',
}

const paymentStatusLabels: Record<string, { label: string; color: 'success' | 'warning' | 'danger' }> = {
  pending: { label: 'Bekliyor', color: 'warning' },
  paid: { label: 'Ödendi', color: 'success' },
  failed: { label: 'Başarısız', color: 'danger' },
  refunded: { label: 'İade Edildi', color: 'warning' },
}

export default function SiparisDetayPage({ 
  params 
}: { 
  params: Promise<{ orderNumber: string }> 
}) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    params.then(p => setOrderNumber(p.orderNumber))
  }, [params])

  const fetchOrderDetails = async () => {
    if (!user || !orderNumber) return

    setLoading(true)
    setError(null)

    try {
      // Sipariş bilgisini al
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: orderData, error: orderError } = await (supabase as any)
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .eq('user_id', user.id)
        .single()

      if (orderError) {
        if (orderError.code === 'PGRST116') {
          setError('Sipariş bulunamadı veya bu siparişe erişim yetkiniz yok.')
        } else if (orderError.message?.includes('does not exist')) {
          setError('Sipariş sistemi henüz kurulmamış.')
        } else {
          throw orderError
        }
        return
      }

      setOrder(orderData)

      // Sipariş kalemlerini al
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: itemsData, error: itemsError } = await (supabase as any)
        .from('order_items')
        .select(`
          id,
          product_id,
          variant_id,
          quantity,
          unit_price,
          total_price
        `)
        .eq('order_id', orderData.id)

      if (itemsError && !itemsError.message?.includes('does not exist')) {
        console.error('Order items error:', itemsError)
      }

      // Ürün bilgilerini al
      if (itemsData && itemsData.length > 0) {
        const productIds = itemsData.map((item: OrderItem) => item.product_id)
        const { data: productsData } = await supabase
          .from('catalog_products')
          .select('id, name, slug, primary_image')
          .in('id', productIds)

        const productsMap = new Map(
          (productsData || []).map((p: { id: string; name: string; slug: string; primary_image: string | null }) => [p.id, p])
        )

        const itemsWithProducts = itemsData.map((item: OrderItem) => ({
          ...item,
          product: productsMap.get(item.product_id) || null
        }))

        setOrderItems(itemsWithProducts)
      } else {
        setOrderItems([])
      }
    } catch (err) {
      console.error('Sipariş detayları yüklenirken hata:', err)
      setError('Sipariş detayları yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user && orderNumber) {
      fetchOrderDetails()
    } else if (!authLoading && !user) {
      router.push('/giris')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, orderNumber])

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.order_number)
      setCopied(true)
      toast.success('Sipariş numarası kopyalandı')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const parseShippingAddress = (addressJson: string): ShippingAddress | null => {
    try {
      return JSON.parse(addressJson)
    } catch {
      return null
    }
  }

  // Loading skeleton
  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-background-card rounded animate-pulse" />
          <div className="h-8 w-64 bg-background-card rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background-card rounded-xl border border-border p-6 h-48 animate-pulse" />
            <div className="bg-background-card rounded-xl border border-border p-6 h-64 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="bg-background-card rounded-xl border border-border p-6 h-40 animate-pulse" />
            <div className="bg-background-card rounded-xl border border-border p-6 h-48 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Link 
          href="/profil/siparislerim"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Siparişlerime Dön
        </Link>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-400 mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push('/profil/siparislerim')} variant="outline">
              Siparişlerime Dön
            </Button>
            <Button onClick={fetchOrderDetails}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tekrar Dene
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!order) return null

  const status = statusConfig[order.status] || statusConfig.pending
  const StatusIcon = status.icon
  const shippingAddress = parseShippingAddress(order.shipping_address)
  const paymentStatus = paymentStatusLabels[order.payment_status] || paymentStatusLabels.pending

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link 
            href="/profil/siparislerim"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Siparişlerime Dön
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-text-primary">
              Sipariş #{order.order_number}
            </h1>
            <button
              onClick={copyOrderNumber}
              className="p-1.5 rounded-lg hover:bg-background-deep transition-colors"
              title="Sipariş numarasını kopyala"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-text-muted" />
              )}
            </button>
          </div>
          <p className="text-text-secondary">
            {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: tr })}
          </p>
        </div>
        <Badge variant={status.color} className="gap-2 text-sm px-4 py-2">
          <StatusIcon className="w-4 h-4" />
          {status.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Info */}
          <div className="bg-background-card rounded-xl border border-border p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                status.color === 'success' ? 'bg-green-500/10 text-green-500' :
                status.color === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                status.color === 'danger' ? 'bg-red-500/10 text-red-500' :
                'bg-primary/10 text-primary'
              }`}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">{status.label}</h3>
                <p className="text-text-secondary text-sm">{status.description}</p>
                <p className="text-text-muted text-xs mt-2">
                  Son güncelleme: {format(new Date(order.updated_at), "d MMMM yyyy, HH:mm", { locale: tr })}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-background-card rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-text-primary">Sipariş Kalemleri ({orderItems.length})</h2>
            </div>
            <div className="divide-y divide-border">
              {orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg bg-background-deep flex-shrink-0 overflow-hidden relative">
                      {item.product?.primary_image ? (
                        <Image 
                          src={item.product.primary_image} 
                          alt={item.product?.name || 'Ürün'}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-text-muted" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      {item.product ? (
                        <Link 
                          href={`/urunler/${item.product.slug}`}
                          className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                      ) : (
                        <span className="font-medium text-text-muted">Ürün bilgisi bulunamadı</span>
                      )}
                      <p className="text-sm text-text-secondary mt-1">
                        Birim Fiyat: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.unit_price)}
                      </p>
                      <p className="text-sm text-text-muted">
                        Adet: {item.quantity}
                      </p>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.total_price)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-text-muted">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Sipariş kalemleri yüklenemedi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary & Address */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-background-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text-primary mb-4">Sipariş Özeti</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Ara Toplam</span>
                <span className="text-text-primary">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Kargo</span>
                <span className="text-text-primary">
                  {order.shipping_cost > 0 
                    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.shipping_cost)
                    : 'Ücretsiz'
                  }
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-text-primary">Toplam</span>
                <span className="font-bold text-lg text-primary">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-background-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Ödeme Bilgisi
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Ödeme Yöntemi</span>
                <span className="text-text-primary">
                  {paymentMethodLabels[order.payment_method] || order.payment_method}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-text-secondary">Ödeme Durumu</span>
                <Badge variant={paymentStatus.color}>
                  {paymentStatus.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="bg-background-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Teslimat Adresi
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-text-primary">
                  {shippingAddress.first_name} {shippingAddress.last_name}
                </p>
                <p className="text-text-secondary">{shippingAddress.phone}</p>
                <p className="text-text-secondary">{shippingAddress.email}</p>
                <p className="text-text-secondary mt-2">
                  {shippingAddress.address}
                </p>
                <p className="text-text-secondary">
                  {shippingAddress.district}, {shippingAddress.city} {shippingAddress.postal_code}
                </p>
                {shippingAddress.notes && (
                  <p className="text-text-muted mt-2 italic">
                    Not: {shippingAddress.notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-background-card rounded-xl border border-border p-6">
              <h2 className="font-semibold text-text-primary mb-2">Sipariş Notu</h2>
              <p className="text-text-secondary text-sm">{order.notes}</p>
            </div>
          )}

          {/* Reorder Button */}
          <Button 
            className="w-full" 
            onClick={() => toast.info('Tekrar sipariş özelliği yakında aktif olacak')}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Tekrar Sipariş Ver
          </Button>
        </div>
      </div>
    </div>
  )
}

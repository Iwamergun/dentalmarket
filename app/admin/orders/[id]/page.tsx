'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Package,
  User,
  CreditCard,
  MapPin,
  FileText,
  Printer,
  Edit,
} from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'

interface Address {
  full_name?: string
  company_name?: string
  address?: string
  district?: string
  city?: string
  postal_code?: string
  phone?: string
  type?: 'individual' | 'corporate'
  tax_number?: string
  tax_office?: string
}

interface OrderProduct {
  id: string
  name: string
  sku: string
  primary_image: string | null
}

interface OrderItem {
  id: string
  unit_price: string
  quantity: number
  discount_amount: string
  product_name: string
  catalog_products: OrderProduct | null
}

interface OrderProfile {
  company_name: string | null
  phone: string | null
  tax_number: string | null
}

interface Order {
  id: string
  order_number: string
  created_at: string
  status: string
  payment_status: string
  customer_email: string | null
  subtotal: string | number
  discount_amount: string | number
  shipping_cost: string | number
  tax_amount: string | number
  total: string | number
  shipping_address: Address | null
  billing_address: Address | null
  customer_note: string | null
  profiles: OrderProfile | null
  items: OrderItem[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/orders/${id}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Sipariş bulunamadı')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Sipariş yüklenemedi')
        }

        setOrder(result.data.order)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Siparişlere Dön
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Sipariş bulunamadı</p>
      </div>
    )
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sipariş Detayı
            </h1>
            <p className="text-sm text-gray-500">{order.order_number}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Yazdır
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Edit className="w-4 h-4" />
            Durumu Güncelle
          </button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sipariş Bilgileri */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Sipariş Bilgileri</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Sipariş No:</span>
              <p className="font-medium text-gray-900">{order.order_number}</p>
            </div>
            <div>
              <span className="text-gray-500">Tarih:</span>
              <p className="font-medium text-gray-900">{orderDate}</p>
            </div>
            <div>
              <span className="text-gray-500">Durum:</span>
              <div className="mt-1">
                <StatusBadge status={order.status} type="order" />
              </div>
            </div>
            <div>
              <span className="text-gray-500">Ödeme Durumu:</span>
              <div className="mt-1">
                <StatusBadge status={order.payment_status} type="payment" />
              </div>
            </div>
          </div>
        </div>

        {/* Müşteri Bilgileri */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Müşteri Bilgileri</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Firma:</span>
              <p className="font-medium text-gray-900">
                {order.profiles?.company_name || '-'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium text-gray-900">
                {order.customer_email || '-'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Telefon:</span>
              <p className="font-medium text-gray-900">
                {order.profiles?.phone || '-'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Vergi No:</span>
              <p className="font-medium text-gray-900">
                {order.profiles?.tax_number || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Ödeme Bilgileri */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Ödeme Özeti</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Ara Toplam:</span>
              <span className="font-medium">
                {Number(order.subtotal).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                })}{' '}
                ₺
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">İndirim:</span>
              <span className="font-medium text-red-600">
                -
                {Number(order.discount_amount || 0).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                })}{' '}
                ₺
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kargo:</span>
              <span className="font-medium">
                {Number(order.shipping_cost).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                })}{' '}
                ₺
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">KDV:</span>
              <span className="font-medium">
                {Number(order.tax_amount).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                })}{' '}
                ₺
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="font-semibold text-gray-900">Toplam:</span>
              <span className="font-bold text-lg text-blue-600">
                {Number(order.total).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                })}{' '}
                ₺
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-gray-900">Sipariş Ürünleri</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Birim Fiyat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Adet
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  İndirim
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Toplam
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item: OrderItem) => {
                const itemTotal =
                  parseFloat(item.unit_price || '0') * item.quantity -
                  parseFloat(item.discount_amount || '0')

                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.catalog_products?.primary_image && (
                          <Image
                            src={item.catalog_products.primary_image}
                            alt={item.catalog_products.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {item.catalog_products?.name || item.product_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.catalog_products?.sku || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {Number(item.unit_price).toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      ₺
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-red-600">
                      -
                      {Number(item.discount_amount || 0).toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      ₺
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {itemTotal.toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      ₺
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teslimat Adresi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Teslimat Adresi</h2>
          </div>
          {order.shipping_address && (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {order.shipping_address.full_name}
              </p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.district},{' '}
                {order.shipping_address.city}
              </p>
              <p>{order.shipping_address.postal_code}</p>
              <p>{order.shipping_address.phone}</p>
            </div>
          )}
        </div>

        {/* Fatura Adresi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Fatura Adresi</h2>
          </div>
          {order.billing_address && (
            <div className="text-sm text-gray-600 space-y-1">
              {order.billing_address.type === 'individual' ? (
                <p className="font-medium text-gray-900">Bireysel</p>
              ) : (
                <>
                  <p className="font-medium text-gray-900">
                    {order.billing_address.company_name}
                  </p>
                  <p>Vergi No: {order.billing_address.tax_number}</p>
                  <p>Vergi Dairesi: {order.billing_address.tax_office}</p>
                </>
              )}
              <p>{order.billing_address.address}</p>
              <p>
                {order.billing_address.district},{' '}
                {order.billing_address.city}
              </p>
              <p>{order.billing_address.postal_code}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {order.customer_note && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Müşteri Notu:</h3>
          <p className="text-sm text-gray-700">{order.customer_note}</p>
        </div>
      )}
    </div>
  )
}

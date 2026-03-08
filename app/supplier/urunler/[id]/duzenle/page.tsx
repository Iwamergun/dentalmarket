'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { formatPrice } from '@/lib/utils/format'

const PAYMENT_OPTIONS = [
  { value: 'havale', label: 'Havale/EFT' },
  { value: 'kredi_karti', label: 'Kredi Kartı' },
  { value: 'vade_30', label: '30 Gün Vade' },
  { value: 'vade_60', label: '60 Gün Vade' },
  { value: 'vade_90', label: '90 Gün Vade' },
] as const

type ProductInfo = {
  name: string
  sku: string | null
  primary_image: string | null
  short_description: string | null
}

export default function TeklifDuzenlePage() {
  const router = useRouter()
  const { id: offerId } = useParams<{ id: string }>()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [product, setProduct] = useState<ProductInfo | null>(null)

  const [form, setForm] = useState({
    price: '',
    vat_rate: '20',
    stock_quantity: '',
    min_order_quantity: '1',
    lead_time_days: '',
    shipping_cost: '',
    free_shipping_threshold: '',
    payment_options: [] as string[],
    notes: '',
    is_active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/giris'); return }

      // Fetch the offer (id param is now the offer id)
      const { data: offer } = await supabase
        .from('offers')
        .select('id, product_id, price, vat_rate, stock_quantity, min_order_quantity, lead_time_days, shipping_cost, free_shipping_threshold, payment_options, notes, is_active')
        .eq('id', offerId)
        .eq('supplier_id', user.id)
        .maybeSingle()

      if (!offer) {
        toast.error('Teklif bulunamadı veya yetkiniz yok')
        router.push('/supplier/urunler')
        return
      }

      // Fetch product info (readonly)
      const { data: prod } = await supabase
        .from('catalog_products')
        .select('name, sku, primary_image, short_description')
        .eq('id', offer.product_id)
        .single()

      setProduct(prod ?? null)

      setForm({
        price: String(offer.price ?? ''),
        vat_rate: String(offer.vat_rate ?? 20),
        stock_quantity: String(offer.stock_quantity ?? ''),
        min_order_quantity: String(offer.min_order_quantity ?? 1),
        lead_time_days: String(offer.lead_time_days ?? ''),
        shipping_cost: String(offer.shipping_cost ?? ''),
        free_shipping_threshold: String(offer.free_shipping_threshold ?? ''),
        payment_options: (offer.payment_options as string[]) ?? [],
        notes: offer.notes ?? '',
        is_active: offer.is_active ?? true,
      })
      setInitialLoading(false)
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const togglePayment = (val: string) => {
    setForm((prev) => ({
      ...prev,
      payment_options: prev.payment_options.includes(val)
        ? prev.payment_options.filter((v) => v !== val)
        : [...prev.payment_options, val],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.price) { toast.error('Fiyat zorunludur'); return }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('offers')
        .update({
          price: parseFloat(form.price),
          vat_rate: parseInt(form.vat_rate) || 20,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          min_order_quantity: parseInt(form.min_order_quantity) || 1,
          lead_time_days: form.lead_time_days ? parseInt(form.lead_time_days) : null,
          shipping_cost: form.shipping_cost ? parseFloat(form.shipping_cost) : null,
          free_shipping_threshold: form.free_shipping_threshold ? parseFloat(form.free_shipping_threshold) : null,
          payment_options: form.payment_options.length > 0 ? form.payment_options : null,
          notes: form.notes || null,
          is_active: form.is_active,
        })
        .eq('id', offerId)

      if (error) throw error

      toast.success('Teklif başarıyla güncellendi')
      router.push('/supplier/urunler')
    } catch (error) {
      console.error('Offer update error:', error)
      toast.error('Teklif güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId)

      if (error) throw error

      toast.success('Teklif başarıyla silindi')
      router.push('/supplier/urunler')
    } catch (error) {
      console.error('Offer deletion error:', error)
      toast.error('Teklif silinirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Teklif Düzenle</h1>

      {/* Readonly Product Info */}
      {product && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6 flex items-center gap-4">
          <img
            src={getImageUrl(product.primary_image)}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover bg-white border"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{product.name}</h2>
            {product.sku && <p className="text-sm text-gray-500">SKU: {product.sku}</p>}
            {product.short_description && (
              <p className="text-sm text-gray-600 mt-0.5">{product.short_description}</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat (₺) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KDV Oranı (%)</label>
              <input
                type="number"
                name="vat_rate"
                value={form.vat_rate}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Miktarı</label>
              <input
                type="number"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. Sipariş Adedi</label>
              <input
                type="number"
                name="min_order_quantity"
                value={form.min_order_quantity}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Delivery & Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Süresi (gün)</label>
              <input
                type="number"
                name="lead_time_days"
                value={form.lead_time_days}
                onChange={handleChange}
                min="0"
                placeholder="0 = Aynı gün"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kargo Ücreti (₺)</label>
              <input
                type="number"
                name="shipping_cost"
                value={form.shipping_cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0 = Ücretsiz"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ücretsiz Kargo Alt Limiti (₺)</label>
              <input
                type="number"
                name="free_shipping_threshold"
                value={form.free_shipping_threshold}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="Boş = yok"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Seçenekleri</label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_OPTIONS.map((opt) => {
                const selected = form.payment_options.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => togglePayment(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selected
                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Ek bilgiler, özel koşullar..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Aktif</label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                İptal
              </button>
            </div>

            {!deleteConfirm ? (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-sm font-medium"
              >
                Teklifi Sil
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">Emin misiniz?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                >
                  Evet, Sil
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

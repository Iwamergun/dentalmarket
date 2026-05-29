'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'
import { getImageUrl } from '@/lib/utils/imageHelper'
import {
  buildOfferPayload,
  buildSupplierProductFormState,
  defaultSupplierProductFormState,
  type CatalogProductSelection,
  type SupplierProductFormState,
} from '@/lib/products/supplierProductForm'

type OfferRecord = {
  id: string
  product_id: string
  supplier_sku: string | null
  description: string | null
  expiry_date: string | null
  price: number | null
  vat_rate: number | null
  stock_quantity: number | null
  min_order_quantity: number | null
  lead_time_days: number | null
  shipping_cost: number | null
  free_shipping_threshold: number | null
  payment_options: string[] | null
  notes: string | null
  is_active: boolean | null
}

type ExistingProductRecord = CatalogProductSelection

const PAYMENT_OPTIONS = [
  { value: 'havale', label: 'Havale/EFT' },
  { value: 'kredi_karti', label: 'Kredi Kartı' },
  { value: 'vade_30', label: '30 Gün Vade' },
  { value: 'vade_60', label: '60 Gün Vade' },
  { value: 'vade_90', label: '90 Gün Vade' },
]

export default function UrunDuzenlePage() {
  const router = useRouter()
  const { id: offerId } = useParams<{ id: string }>()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [currentProductId, setCurrentProductId] = useState<string | null>(null)
  const [catalogDescription, setCatalogDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [form, setForm] = useState<SupplierProductFormState>(defaultSupplierProductFormState)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/giris')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: offer } = await (supabase.from('offers') as any)
        .select('id, product_id, supplier_sku, description, expiry_date, price, vat_rate, stock_quantity, min_order_quantity, lead_time_days, shipping_cost, free_shipping_threshold, payment_options, notes, is_active')
        .eq('id', offerId)
        .eq('supplier_id', user.id)
        .maybeSingle()

      const typedOffer = offer as OfferRecord | null

      if (!typedOffer) {
        toast.error('Ürün bulunamadı')
        router.push('/supplier/urunler')
        return
      }

      const [{ data: cats }, { data: brs }, { data: product }] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true).order('name'),
        supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
        supabase
          .from('catalog_products')
          .select('id, name, slug, sku, barcode, short_description, description, primary_category_id, brand_id, primary_image, compare_at_price')
          .eq('id', typedOffer.product_id)
          .single(),
      ])

      const typedProduct = product as ExistingProductRecord | null

      if (!typedProduct) {
        toast.error('Ürün bulunamadı')
        router.push('/supplier/urunler')
        return
      }

      setCategories(cats ?? [])
      setBrands(brs ?? [])
      setCurrentProductId(typedProduct.id)
      setCatalogDescription(typedProduct.description ?? '')
      setForm(buildSupplierProductFormState({
        product: typedProduct,
        supplierSku: typedOffer.supplier_sku,
        description: typedOffer.description,
        expiryDate: typedOffer.expiry_date,
        price: typedOffer.price,
        vatRate: typedOffer.vat_rate,
        stockQuantity: typedOffer.stock_quantity,
        minOrderQuantity: typedOffer.min_order_quantity,
        leadTimeDays: typedOffer.lead_time_days,
        shippingCost: typedOffer.shipping_cost,
        freeShippingThreshold: typedOffer.free_shipping_threshold,
        paymentOptions: typedOffer.payment_options,
        notes: typedOffer.notes,
        isActive: typedOffer.is_active,
      }))
      setInitialLoading(false)
    }

    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const togglePaymentOption = (opt: string) => {
    setForm((prev) => ({
      ...prev,
      payment_options: prev.payment_options.includes(opt)
        ? prev.payment_options.filter((item) => item !== opt)
        : [...prev.payment_options, opt],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentProductId || !form.sku || !form.price) {
      toast.error('Stok kodu (SKU) ve fiyat zorunludur')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Oturum bulunamadı')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: offerError } = await (supabase.from('offers') as any)
        .update(buildOfferPayload(form, user.id, currentProductId))
        .eq('id', offerId)
        .eq('supplier_id', user.id)

      if (offerError) {
        throw offerError
      }

      toast.success('Ürün başarıyla güncellendi')
      router.push('/supplier/urunler')
    } catch (error) {
      console.error('Supplier product update error:', error)
      toast.error('Ürün güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Oturum bulunamadı')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: offerError } = await (supabase.from('offers') as any)
        .delete()
        .eq('id', offerId)
        .eq('supplier_id', user.id)

      if (offerError) {
        throw offerError
      }

      toast.success('Teklif başarıyla silindi')
      router.push('/supplier/urunler')
    } catch (error) {
      console.error('Supplier product delete error:', error)
      toast.error('Teklif silinirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const categoryName = categories.find((item) => item.id === form.primary_category_id)?.name ?? ''
  const brandName = brands.find((item) => item.id === form.brand_id)?.name ?? ''

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ürün Düzenle</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Katalog Bilgileri (Salt Okunur)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                <input
                  type="text"
                  value={form.name}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barkod</label>
                <input
                  type="text"
                  value={form.barcode}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input
                  type="text"
                  value={categoryName}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
                <input
                  type="text"
                  value={brandName}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Karşılaştırma Fiyatı (₺)</label>
                <input
                  type="text"
                  value={form.compare_at_price}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
              <input
                type="text"
                value={form.short_description}
                readOnly
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Master Açıklama</label>
              <textarea
                value={catalogDescription}
                readOnly
                rows={4}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
              />
            </div>

            {form.primary_image && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Master Görsel</label>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(form.primary_image)}
                  alt={form.name}
                  className="h-40 w-40 rounded-lg border border-gray-200 object-cover bg-gray-50"
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-t pt-6">Teklif Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Kodu (SKU) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Süresi (gün)</label>
                <input
                  type="number"
                  name="lead_time_days"
                  value={form.lead_time_days}
                  onChange={handleChange}
                  min="0"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ücretsiz Kargo Eşiği (₺)</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi (SKT)</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={form.expiry_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Açıklaması (Depo)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Seçenekleri</label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => togglePaymentOption(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    form.payment_options.includes(option.value)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Aktif
            </label>
          </div>

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

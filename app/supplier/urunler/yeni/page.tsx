'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { Search, Package } from 'lucide-react'
import type { Database } from '@/types/database.types'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface CatalogProduct {
  id: string
  name: string
  slug: string
  sku: string | null
  barcode: string | null
  primary_image: string | null
  short_description: string | null
  description: string | null
  category?: { name: string | null } | null
  brand?: { name: string | null } | null
}

function mapCatalogProducts(data: unknown): CatalogProduct[] {
  if (!Array.isArray(data)) {
    return []
  }

  return data.filter((item): item is CatalogProduct => {
    if (typeof item !== 'object' || item === null) {
      return false
    }

    const record = item as Record<string, unknown>
    return (
      typeof record.id === 'string' &&
      typeof record.name === 'string' &&
      typeof record.slug === 'string' &&
      'sku' in record &&
      'barcode' in record &&
      'primary_image' in record &&
      'short_description' in record &&
      'description' in record
    )
  })
}

export default function YeniTeklifPage() {
  const router = useRouter()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [search, setSearch] = useState('')
  const [results, setResults] = useState<CatalogProduct[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    price: '',
    vat_rate: '20',
    stock_quantity: '',
    min_order_quantity: '1',
    lead_time_days: '0',
    shipping_cost: '0',
    free_shipping_threshold: '',
    payment_options: [] as string[],
    notes: '',
  })

  const navigateToSuggestionForm = () => {
    router.push(`/supplier/urun-oner${search ? `?query=${encodeURIComponent(search)}` : ''}`)
  }

  const searchProducts = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const { data } = await supabase
        .from('catalog_products')
        .select(`
          id,
          name,
          slug,
          sku,
          barcode,
          primary_image,
          short_description,
          description,
          brand:brands (
            name
          ),
          category:categories!catalog_products_primary_category_id_fkey (
            name
          )
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%`)
        .order('name')
        .limit(20)

      setResults(mapCatalogProducts(data))
    } catch {
      console.error('Search error')
    } finally {
      setSearching(false)
    }
  }, [supabase])

  useEffect(() => {
    const timer = setTimeout(() => searchProducts(search), 300)
    return () => clearTimeout(timer)
  }, [search, searchProducts])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const togglePaymentOption = (opt: string) => {
    setForm((prev) => ({
      ...prev,
      payment_options: prev.payment_options.includes(opt)
        ? prev.payment_options.filter((o) => o !== opt)
        : [...prev.payment_options, opt],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) {
      toast.error('Lütfen bir ürün seçin')
      return
    }
    if (!form.price) {
      toast.error('Fiyat zorunludur')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Oturum bulunamadı')
        return
      }

      // Check if supplier already has an offer for this product
      const { data: existing } = await supabase
        .from('offers')
        .select('id')
        .eq('supplier_id', user.id)
        .eq('product_id', selectedProduct.id)
        .eq('is_active', true)
        .maybeSingle()

      if (existing) {
        toast.error('Bu ürün için zaten aktif bir teklifiniz var')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: offerError } = await (supabase.from('offers') as any)
        .insert({
          supplier_id: user.id,
          product_id: selectedProduct.id,
          price: parseFloat(form.price),
          vat_rate: parseInt(form.vat_rate) || 20,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          min_order_quantity: parseInt(form.min_order_quantity) || 1,
          lead_time_days: parseInt(form.lead_time_days) || 0,
          shipping_cost: parseFloat(form.shipping_cost) || 0,
          free_shipping_threshold: form.free_shipping_threshold ? parseFloat(form.free_shipping_threshold) : null,
          payment_options: form.payment_options.length > 0 ? form.payment_options : null,
          notes: form.notes || null,
          currency: 'TRY',
          is_active: true,
        })

      if (offerError) throw offerError

      toast.success('Teklif başarıyla oluşturuldu')
      router.push('/supplier/urunler')
    } catch (error) {
      console.error('Offer creation error:', error)
      toast.error('Teklif oluşturulurken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const PAYMENT_OPTIONS = [
    { value: 'havale', label: 'Havale/EFT' },
    { value: 'kredi_karti', label: 'Kredi Kartı' },
    { value: 'vade_30', label: '30 Gün Vade' },
    { value: 'vade_60', label: '60 Gün Vade' },
    { value: 'vade_90', label: '90 Gün Vade' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Katalogdan Ürün Seç ve Teklif Ver</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Step 1: Product search */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Ürün Seçin</h2>

          {selectedProduct ? (
            <div className="flex items-center gap-4 p-4 border border-primary/30 bg-primary/5 rounded-lg">
              <Image
                src={getImageUrl(selectedProduct.primary_image)}
                alt={selectedProduct.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded object-cover bg-gray-100"
                unoptimized
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5 text-sm text-gray-500">
                  {selectedProduct.sku && <p>SKU: {selectedProduct.sku}</p>}
                  {selectedProduct.barcode && <p>Barkod: {selectedProduct.barcode}</p>}
                  {selectedProduct.category?.name && <p>Kategori: {selectedProduct.category.name}</p>}
                  {selectedProduct.brand?.name && <p>Marka: {selectedProduct.brand.name}</p>}
                </div>
                {selectedProduct.short_description && (
                  <p className="text-sm text-gray-600 mt-0.5">{selectedProduct.short_description}</p>
                )}
                {selectedProduct.description && (
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{selectedProduct.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => { setSelectedProduct(null); setSearch('') }}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Değiştir
              </button>
            </div>
          ) : (
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ürün adı veya SKU ile arayın..."
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {searching && <p className="text-sm text-gray-500 mt-2">Aranıyor...</p>}

              {results.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedProduct(p); setResults([]) }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      {p.primary_image ? (
                        <Image src={getImageUrl(p.primary_image)} alt="" width={40} height={40} className="w-10 h-10 rounded object-cover bg-gray-100" unoptimized />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        {p.sku && <p className="text-xs text-gray-500">SKU: {p.sku}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {search.length >= 2 && !searching && results.length === 0 && (
                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm text-amber-900">Sonuç bulunamadı. Ürün kataloğumuzda yoksa öneri gönderebilirsiniz.</p>
                  <button
                    type="button"
                    onClick={navigateToSuggestionForm}
                    className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    + Ürün Öner
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 -mt-3">
          <button
            type="button"
            onClick={navigateToSuggestionForm}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            + Ürün Öner
          </button>
        </div>

        {/* Step 2: Offer details */}
        {selectedProduct && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-t pt-6">2. Teklif Bilgileri</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat (₺) <span className="text-red-500">*</span>
                </label>
                <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KDV Oranı (%)</label>
                <input type="number" name="vat_rate" value={form.vat_rate} onChange={handleChange} min="0" max="100" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stok Miktarı</label>
                <input type="number" name="stock_quantity" value={form.stock_quantity} onChange={handleChange} min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min. Sipariş Adedi</label>
                <input type="number" name="min_order_quantity" value={form.min_order_quantity} onChange={handleChange} min="1" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Süresi (iş günü)</label>
                <input type="number" name="lead_time_days" value={form.lead_time_days} onChange={handleChange} min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kargo Ücreti (₺)</label>
                <input type="number" name="shipping_cost" value={form.shipping_cost} onChange={handleChange} step="0.01" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ücretsiz Kargo Eşiği (₺)</label>
                <input type="number" name="free_shipping_threshold" value={form.free_shipping_threshold} onChange={handleChange} step="0.01" min="0" placeholder="Boş = yok" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Payment options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Seçenekleri</label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => togglePaymentOption(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      form.payment_options.includes(opt.value)
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Ek bilgi, kampanya detayı vb." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex items-center gap-4 border-t pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                {loading ? 'Oluşturuluyor...' : 'Teklif Oluştur'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                İptal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

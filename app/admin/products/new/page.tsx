'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'
import ImageUploader from '@/components/admin/ImageUploader'
import CatalogProductNameSelect from '@/components/supplier/CatalogProductNameSelect'
import type { CatalogProductSelection } from '@/lib/products/supplierProductForm'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminNewProductPage() {
  const router = useRouter()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [nameSearch, setNameSearch] = useState('')
  const [results, setResults] = useState<CatalogProductSelection[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedCatalogProductId, setSelectedCatalogProductId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    barcode: '',
    short_description: '',
    description: '',
    primary_category_id: '',
    brand_id: '',
    is_active: true,
    primary_image: '',
    // Offer fields
    price: '',
    vat_rate: '20',
    stock_quantity: '',
    min_order_quantity: '1',
  })

  const searchProducts = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setSearching(true)
    try {
      const { data } = await supabase
        .from('catalog_products')
        .select('id, name, slug, sku, barcode, short_description, description, primary_category_id, brand_id, primary_image, compare_at_price')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%`)
        .order('name')
        .limit(20)

      setResults((data ?? []) as CatalogProductSelection[])
    } catch (error) {
      console.error('Catalog product search error:', error)
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [supabase])

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: cats }, { data: brs }] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true).order('name'),
        supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
      ])
      setCategories(cats ?? [])
      setBrands(brs ?? [])
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(nameSearch)
    }, 300)

    return () => clearTimeout(timer)
  }, [nameSearch, searchProducts])

  const handleCatalogSearchChange = (value: string) => {
    setNameSearch(value)
    setSelectedCatalogProductId(null)
  }

  const handleCatalogSelect = (productId: string) => {
    const selectedProduct = results.find((product) => product.id === productId)
    if (!selectedProduct) {
      return
    }

    setSelectedCatalogProductId(selectedProduct.id)
    setNameSearch(selectedProduct.name)
    setResults([])
    setForm((prev) => ({
      ...prev,
      name: selectedProduct.name,
      slug: selectedProduct.slug || slugify(selectedProduct.name),
      sku: selectedProduct.sku ?? '',
      barcode: selectedProduct.barcode ?? '',
      short_description: selectedProduct.short_description ?? '',
      description: selectedProduct.description ?? '',
      primary_category_id: selectedProduct.primary_category_id ?? '',
      brand_id: selectedProduct.brand_id ?? '',
      primary_image: selectedProduct.primary_image ?? '',
    }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCatalogProductId) {
      toast.error('Ürün adı için katalogdan seçim yapın')
      return
    }

    if (!form.name || !form.sku || !form.price) {
      toast.error('Ürün adı, SKU ve fiyat zorunludur')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Oturum bulunamadı')
        return
      }

      // 1. Insert product into catalog_products
      const { data: product, error: productError } = await supabase
        .from('catalog_products')
        .insert({
          name: form.name,
          slug: form.slug || slugify(form.name),
          sku: form.sku,
          barcode: form.barcode || null,
          description: form.description || null,
          short_description: form.short_description || null,
          primary_category_id: form.primary_category_id || null,
          brand_id: form.brand_id || null,
          is_active: form.is_active,
          primary_image: form.primary_image || null,
        })
        .select('id')
        .single()

      if (productError || !product) throw productError

      // 2. Insert offer
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .insert({
          supplier_id: user.id,
          product_id: product.id,
          price: parseFloat(form.price),
          vat_rate: parseInt(form.vat_rate) || 20,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          min_order_quantity: parseInt(form.min_order_quantity) || 1,
          currency: 'TRY',
          lead_time_days: 0,
          is_active: true,
        })
        .select('id')
        .single()

      if (offerError || !offer) throw offerError

      // 3. Update product with default_offer_id
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('catalog_products')
        .update({ default_offer_id: offer.id })
        .eq('id', product.id)

      toast.success('Ürün başarıyla eklendi')
      router.push('/admin/products')
    } catch (error) {
      console.error('Product creation error:', error)
      toast.error('Ürün eklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Ürün Ekle</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CatalogProductNameSelect
              value={nameSearch}
              searching={searching}
              results={results.map((product) => ({
                id: product.id,
                name: product.name,
                sku: product.sku,
              }))}
              selectedProductId={selectedCatalogProductId}
              onValueChange={handleCatalogSearchChange}
              onSelect={handleCatalogSelect}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-red-500">*</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Barkod</label>
              <input
                type="text"
                name="barcode"
                value={form.barcode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                name="primary_category_id"
                value={form.primary_category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
              <select
                name="brand_id"
                value={form.brand_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Marka seçin</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
            <input
              type="text"
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image */}
          <ImageUploader
            currentImage={form.primary_image || null}
            onUpload={(path) => setForm((prev) => ({ ...prev, primary_image: path }))}
          />

          {/* Pricing & Stock */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-t pt-6">Fiyat & Stok</h2>
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
          </div>

          {/* Active */}
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
          <div className="flex items-center gap-4 border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

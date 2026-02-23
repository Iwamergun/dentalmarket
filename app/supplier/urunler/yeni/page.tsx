'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'

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

export default function YeniUrunPage() {
  const router = useRouter()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    short_description: '',
    price: '',
    compare_at_price: '',
    stock_quantity: '',
    primary_category_id: '',
    brand_id: '',
    is_active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: cats }, { data: brs }] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true),
        supabase.from('brands').select('id, name').eq('is_active', true),
      ])
      setCategories(cats ?? [])
      setBrands(brs ?? [])
    }
    fetchData()
  }, [supabase])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }))
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
    if (!form.name || !form.sku || !form.price) {
      toast.error('Ürün adı, SKU ve fiyat zorunludur')
      return
    }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { error } = await supabase.from('catalog_products').insert({
        name: form.name,
        slug: form.slug || slugify(form.name),
        sku: form.sku,
        description: form.description || null,
        short_description: form.short_description || null,
        price: parseFloat(form.price),
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        stock_quantity: form.stock_quantity ? parseInt(form.stock_quantity) : 0,
        primary_category_id: form.primary_category_id || null,
        brand_id: form.brand_id || null,
        is_active: form.is_active,
        supplier_id: session!.user.id,
      })

      if (error) throw error

      toast.success('Ürün başarıyla eklendi')
      router.push('/supplier/urunler')
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Karşılaştırma Fiyatı (₺)
              </label>
              <input
                type="number"
                name="compare_at_price"
                value={form.compare_at_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok Miktarı
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marka
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kısa Açıklama
            </label>
            <input
              type="text"
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
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
        </form>
      </div>
    </div>
  )
}

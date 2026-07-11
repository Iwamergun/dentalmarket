'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'
import MultiImageUploader, { type UploadedImage } from '@/components/admin/MultiImageUploader'

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
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newBrandName, setNewBrandName] = useState('')
  const [loading, setLoading] = useState(false)
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [creatingBrand, setCreatingBrand] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [primaryIndex, setPrimaryIndex] = useState(0)
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
  })

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setForm((prev) => ({ ...prev, name, slug: prev.slug ? prev.slug : slugify(name) }))
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

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) {
      toast.error('Kategori adı girin')
      return
    }

    setCreatingCategory(true)
    try {
      const slug = slugify(name)
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name,
          slug,
          path: slug,
          depth: 0,
          sort_order: 0,
          is_active: true,
        })
        .select('id, name')
        .single()

      if (error || !data) throw error

      setCategories((current) => [...current, data].sort((left, right) => left.name.localeCompare(right.name, 'tr')))
      setForm((current) => ({ ...current, primary_category_id: data.id }))
      setNewCategoryName('')
      toast.success('Kategori eklendi')
    } catch (error) {
      console.error('Category create error:', error)
      toast.error('Kategori eklenemedi')
    } finally {
      setCreatingCategory(false)
    }
  }

  const handleCreateBrand = async () => {
    const name = newBrandName.trim()
    if (!name) {
      toast.error('Marka adı girin')
      return
    }

    setCreatingBrand(true)
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert({
          name,
          slug: slugify(name),
          is_active: true,
        })
        .select('id, name')
        .single()

      if (error || !data) throw error

      setBrands((current) => [...current, data].sort((left, right) => left.name.localeCompare(right.name, 'tr')))
      setForm((current) => ({ ...current, brand_id: data.id }))
      setNewBrandName('')
      toast.success('Marka eklendi')
    } catch (error) {
      console.error('Brand create error:', error)
      toast.error('Marka eklenemedi')
    } finally {
      setCreatingBrand(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.sku) {
      toast.error('Ürün adı ve SKU zorunludur')
      return
    }

    const stillUploading = images.some((img) => img.uploading)
    if (stillUploading) {
      toast.error('Lütfen görsellerin yüklenmesini bekleyin')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Oturum bulunamadı')
        return
      }

      const primaryImage = images[primaryIndex]?.path || null

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
          primary_image: primaryImage,
        })
        .select('id')
        .single()

      if (productError || !product) throw productError

      // Insert catalog_product_images for all uploaded images that have a media_asset
      const imageRows = images
        .filter((img) => img.mediaAssetId && img.path)
        .map((img, i) => ({
          product_id: product.id,
          media_id: img.mediaAssetId!,
          sort_order: i,
          is_primary: i === primaryIndex,
        }))

      if (imageRows.length > 0) {
        const { error: imgError } = await supabase
          .from('catalog_product_images')
          .insert(imageRows)

        if (imgError) {
          console.warn('catalog_product_images insert warning:', imgError.message)
        }
      }

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
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
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
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="Yeni kategori adı"
                  className="min-w-0 flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                  className="shrink-0 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
                >
                  {creatingCategory ? 'Ekleniyor' : 'Ekle'}
                </button>
              </div>
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
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(event) => setNewBrandName(event.target.value)}
                  placeholder="Yeni marka adı"
                  className="min-w-0 flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCreateBrand}
                  disabled={creatingBrand}
                  className="shrink-0 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
                >
                  {creatingBrand ? 'Ekleniyor' : 'Ekle'}
                </button>
              </div>
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

          {/* Images */}
          <MultiImageUploader
            images={images}
            onChange={setImages}
            primaryIndex={primaryIndex}
            onPrimaryChange={setPrimaryIndex}
          />

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

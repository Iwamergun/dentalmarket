'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'
import MultiImageUploader, { type UploadedImage } from '@/components/admin/MultiImageUploader'
import { getAuthMetadata, hasAdminAccess } from '@/lib/auth/access'

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

export default function AdminEditProductPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [offerId, setOfferId] = useState<string | null>(null)
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
    // Offer fields
    price: '',
    vat_rate: '20',
    stock_quantity: '',
    min_order_quantity: '1',
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/giris')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!hasAdminAccess(profile?.role, getAuthMetadata(user))) {
        router.push('/')
        return
      }

      const [{ data: cats }, { data: brs }, { data: product }, { data: offer }] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true).order('name'),
        supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
        supabase
          .from('catalog_products')
          .select('id, name, slug, sku, barcode, short_description, description, primary_category_id, brand_id, is_active, primary_image')
          .eq('id', id)
          .single(),
        supabase
          .from('offers')
          .select('id, price, vat_rate, stock_quantity, min_order_quantity')
          .eq('product_id', id)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle(),
      ])

      setCategories(cats ?? [])
      setBrands(brs ?? [])

      if (!product) {
        toast.error('Ürün bulunamadı')
        router.push('/admin/products')
        return
      }

      setOfferId(offer?.id ?? null)
      setForm({
        name: product.name ?? '',
        slug: product.slug ?? '',
        sku: product.sku ?? '',
        barcode: product.barcode ?? '',
        short_description: product.short_description ?? '',
        description: product.description ?? '',
        primary_category_id: product.primary_category_id ?? '',
        brand_id: product.brand_id ?? '',
        is_active: product.is_active ?? true,
        price: offer ? String(offer.price) : '',
        vat_rate: offer ? String(offer.vat_rate) : '20',
        stock_quantity: offer ? String(offer.stock_quantity) : '',
        min_order_quantity: offer ? String(offer.min_order_quantity) : '1',
      })

      // Load existing product images from catalog_product_images -> media_assets
      const { data: productImages } = await supabase
        .from('catalog_product_images')
        .select('id, media_id, is_primary, sort_order')
        .eq('product_id', id)
        .order('sort_order', { ascending: true })

      if (productImages && productImages.length > 0) {
        const mediaIds = productImages.map((img) => img.media_id)
        const { data: mediaData } = await supabase
          .from('media_assets')
          .select('id, object_path, public_url')
          .in('id', mediaIds)

        type MediaRow = { id: string; object_path: string | null; public_url: string | null }
        const mediaMap = new Map(
          ((mediaData ?? []) as MediaRow[]).map((m) => [
            m.id,
            m.object_path || m.public_url || '',
          ])
        )

        const loadedImages: UploadedImage[] = productImages.map((img) => ({
          path: mediaMap.get(img.media_id) ?? '',
          mediaAssetId: img.media_id,
          uploading: false,
        }))

        const primaryIdx = productImages.findIndex((img) => img.is_primary)
        setImages(loadedImages.filter((img) => img.path))
        setPrimaryIndex(Math.max(0, primaryIdx))
      } else if (product.primary_image) {
        // Fallback: product has only primary_image, no catalog_product_images rows
        setImages([{ path: product.primary_image, mediaAssetId: null, uploading: false }])
        setPrimaryIndex(0)
      }

      setInitialLoading(false)
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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

      // 1. Update catalog_products
      const { error: productError } = await supabase
        .from('catalog_products')
        .update({
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
        .eq('id', id)

      if (productError) throw productError

      // 2. Sync catalog_product_images: delete all then re-insert
      await supabase.from('catalog_product_images').delete().eq('product_id', id)

      const imageRows = images
        .filter((img): img is typeof img & { mediaAssetId: string } => typeof img.mediaAssetId === 'string' && img.mediaAssetId.length > 0 && img.path.length > 0)
        .map((img, i) => ({
          product_id: id,
          media_id: img.mediaAssetId,
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

      // 3. Update or insert offer
      if (offerId) {
        const { error: offerError } = await supabase
          .from('offers')
          .update({
            price: parseFloat(form.price),
            vat_rate: parseInt(form.vat_rate) || 20,
            stock_quantity: parseInt(form.stock_quantity) || 0,
            min_order_quantity: parseInt(form.min_order_quantity) || 1,
          })
          .eq('id', offerId)

        if (offerError) throw offerError
      } else {
        const { data: newOffer, error: offerError } = await supabase
          .from('offers')
          .insert({
            supplier_id: user.id,
            product_id: id,
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

        if (offerError || !newOffer) throw offerError

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('catalog_products')
          .update({ default_offer_id: newOffer.id })
          .eq('id', id)
      }

      toast.success('Ürün başarıyla güncellendi')
      router.push('/admin/products')
    } catch (error) {
      console.error('Product update error:', error)
      toast.error('Ürün güncellenirken bir hata oluştu')
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ürün Düzenle</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info */}
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

          {/* Images */}
          <MultiImageUploader
            images={images}
            onChange={setImages}
            primaryIndex={primaryIndex}
            onPrimaryChange={setPrimaryIndex}
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

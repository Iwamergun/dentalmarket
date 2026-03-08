import { createClient } from '@/lib/supabase/server'
import { Product, ProductWithRelations } from '@/types/catalog.types'

/* ─── Shared types ─── */

export interface BestOfferProduct {
  id: string
  name: string
  slug: string
  primary_image: string | null
  sku: string | null
  short_description: string | null
  is_active: boolean
  brand_id: string | null
  brand_name: string | null
  primary_category_id: string | null
  category_name: string | null
  min_price: number | null
  best_supplier_id: string | null
  best_stock: number | null
  best_lead_time: number | null
  best_shipping_cost: number | null
  offer_count: number
  price_min: number | null
  price_max: number | null
}

export interface ProductOffer {
  offer_id: string
  product_id: string
  supplier_id: string
  price: number
  currency: string
  vat_rate: number
  stock_quantity: number | null
  lead_time_days: number | null
  min_order_quantity: number | null
  shipping_cost: number | null
  free_shipping_threshold: number | null
  payment_options: string[] | null
  notes: string | null
  is_default: boolean
  created_at: string
  supplier_name: string | null
  supplier_slug: string | null
  supplier_logo: string | null
  supplier_rating: number | null
  supplier_total_ratings: number | null
  supplier_total_sales: number | null
}

export interface ProductDetailData extends ProductWithRelations {
  price: number | null
  compare_at_price: number | null
  stock_quantity: number | null
  images: string[]
  offer_count: number
  price_min: number | null
  price_max: number | null
}

/* ─── Queries using v_product_best_offer ─── */

export async function getProducts(limit = 20, offset = 0): Promise<BestOfferProduct[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('v_product_best_offer' as 'catalog_products')
    .select('*')
    .eq('is_active', true)
    .order('min_price', { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products:', error?.message)
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []) as any as BestOfferProduct[]
}

export async function getProductsByCategory(categoryId: string, limit = 20, offset = 0): Promise<BestOfferProduct[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('v_product_best_offer' as 'catalog_products')
    .select('*')
    .eq('primary_category_id', categoryId)
    .eq('is_active', true)
    .order('min_price', { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by category:', error?.message)
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []) as any as BestOfferProduct[]
}

export async function getProductsByBrand(brandId: string, limit = 20, offset = 0): Promise<BestOfferProduct[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('v_product_best_offer' as 'catalog_products')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('min_price', { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by brand:', error?.message)
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []) as any as BestOfferProduct[]
}

/* ─── Two-query approach: products + separate offer stats (RLS-safe) ─── */

async function enrichWithOfferStats(products: BestOfferProduct[]): Promise<BestOfferProduct[]> {
  if (products.length === 0) return []

  const supabase = await createClient()
  const productIds = products.map(p => p.id)

  const { data: offerStats } = await supabase
    .from('offers')
    .select('product_id, price, supplier_id')
    .in('product_id', productIds)
    .eq('is_active', true)
    .gt('stock_quantity', 0)

  const offerMap = new Map<string, { count: number; minPrice: number; maxPrice: number }>()
  offerStats?.forEach(o => {
    const existing = offerMap.get(o.product_id)
    const price = parseFloat(String(o.price))
    if (existing) {
      existing.count++
      existing.minPrice = Math.min(existing.minPrice, price)
      existing.maxPrice = Math.max(existing.maxPrice, price)
    } else {
      offerMap.set(o.product_id, { count: 1, minPrice: price, maxPrice: price })
    }
  })

  return products.map(p => {
    const stats = offerMap.get(p.id)
    if (!stats) return p
    return {
      ...p,
      offer_count: stats.count,
      min_price: stats.minPrice,
      price_min: stats.minPrice,
      price_max: stats.maxPrice,
    }
  })
}

export async function getProductsWithOffers(limit = 20, offset = 0): Promise<BestOfferProduct[]> {
  const products = await getProducts(limit, offset)
  return enrichWithOfferStats(products)
}

export async function getProductsByCategoryWithOffers(categoryId: string, limit = 20, offset = 0): Promise<BestOfferProduct[]> {
  const products = await getProductsByCategory(categoryId, limit, offset)
  return enrichWithOfferStats(products)
}

export async function getProductsByBrandWithOffers(brandId: string, limit = 20, offset = 0): Promise<BestOfferProduct[]> {
  const products = await getProductsByBrand(brandId, limit, offset)
  return enrichWithOfferStats(products)
}

/* ─── Product offers for detail page ─── */

export async function getProductOffers(productId: string): Promise<ProductOffer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('offers')
    .select(`
      id,
      product_id,
      supplier_id,
      price,
      currency,
      vat_rate,
      stock_quantity,
      lead_time_days,
      min_order_quantity,
      shipping_cost,
      free_shipping_threshold,
      payment_options,
      notes,
      is_default,
      created_at,
      profiles!inner(
        company_name,
        store_slug,
        store_logo_url,
        avg_rating,
        total_ratings,
        total_sales
      )
    `)
    .eq('product_id', productId)
    .eq('is_active', true)
    .gt('stock_quantity', 0)
    .order('price', { ascending: true })

  if (error) {
    console.error('Error fetching product offers:', error?.message)
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((offer: any) => ({
    offer_id: offer.id,
    product_id: offer.product_id,
    supplier_id: offer.supplier_id,
    price: Number(offer.price),
    currency: offer.currency ?? 'TRY',
    vat_rate: Number(offer.vat_rate ?? 20),
    stock_quantity: offer.stock_quantity,
    lead_time_days: offer.lead_time_days,
    min_order_quantity: offer.min_order_quantity,
    shipping_cost: offer.shipping_cost != null ? Number(offer.shipping_cost) : null,
    free_shipping_threshold: offer.free_shipping_threshold != null ? Number(offer.free_shipping_threshold) : null,
    payment_options: offer.payment_options,
    notes: offer.notes,
    is_default: offer.is_default ?? false,
    created_at: offer.created_at,
    supplier_name: offer.profiles?.company_name ?? 'Satıcı',
    supplier_slug: offer.profiles?.store_slug ?? null,
    supplier_logo: offer.profiles?.store_logo_url ?? null,
    supplier_rating: offer.profiles?.avg_rating ? Number(offer.profiles.avg_rating) : null,
    supplier_total_ratings: offer.profiles?.total_ratings ? Number(offer.profiles.total_ratings) : null,
    supplier_total_sales: offer.profiles?.total_sales ? Number(offer.profiles.total_sales) : null,
  }))
}

/* ─── Product detail by slug ─── */

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  const supabase = await createClient()

  // Önce ürünü çek
  const { data, error: productError } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (productError) {
    console.error('Error fetching product by slug:', productError.message)
    return null
  }

  if (!data) return null

  const product = data as Product

  // Paralel olarak tüm ilişkili verileri çek
  const [brandResult, categoryResult, offersResult, imagesResult] = await Promise.all([
    // Brand bilgisi
    product.brand_id
      ? supabase.from('brands').select('*').eq('id', product.brand_id).single()
      : Promise.resolve({ data: null }),

    // Category bilgisi
    product.primary_category_id
      ? supabase.from('categories').select('*').eq('id', product.primary_category_id).single()
      : Promise.resolve({ data: null }),

    // Tüm aktif teklifler (en iyisini ve istatistikleri hesaplamak için)
    supabase
      .from('offers')
      .select('price, stock_quantity, currency, vat_rate')
      .eq('product_id', product.id)
      .eq('is_active', true)
      .order('price', { ascending: true }),

    // Ürün resimleri (media_assets ile join)
    supabase
      .from('catalog_product_images')
      .select('id, alt_text, sort_order, is_primary, media_id')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true }),
  ])

  const brand = brandResult.data
  const category = categoryResult.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allOffers = ((offersResult.data as any) || []) as Array<{ price: number; stock_quantity: number; currency: string; vat_rate: number }>
  const bestOffer = allOffers[0] ?? null
  const prices = allOffers.map(o => Number(o.price)).filter(p => p > 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productImages = ((imagesResult.data as any) || []) as Array<{ id: string; alt_text: string | null; sort_order: number; is_primary: boolean; media_id: string }>

  // Media URL'lerini çek
  let galleryImages: string[] = []
  if (productImages.length > 0) {
    const mediaIds = productImages.map((img) => img.media_id)
    const { data: mediaData } = await supabase
      .from('media_assets')
      .select('id, public_url, object_path')
      .in('id', mediaIds)

    if (mediaData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedMedia = mediaData as any as Array<{ id: string; public_url: string | null; object_path: string | null }>
      const mediaMap = new Map(typedMedia.map((m) => [m.id, m.public_url || m.object_path]))
      galleryImages = productImages
        .map((img) => mediaMap.get(img.media_id))
        .filter(Boolean) as string[]
    }
  }

  return {
    ...product,
    brand,
    category,
    price: bestOffer ? Number(bestOffer.price) : null,
    compare_at_price: null,
    stock_quantity: bestOffer?.stock_quantity ?? null,
    images: galleryImages,
    offer_count: allOffers.length,
    price_min: prices.length > 0 ? Math.min(...prices) : null,
    price_max: prices.length > 0 ? Math.max(...prices) : null,
  } as ProductDetailData
}
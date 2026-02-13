import { createClient } from '@/lib/supabase/server'
import { Product, ProductWithRelations } from '@/types/catalog.types'

export interface ProductDetailData extends ProductWithRelations {
  price: number | null
  compare_at_price: number | null
  stock_quantity: number | null
  images: string[]
}

export async function getProducts(limit = 20, offset = 0): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return []
  }

  return data || []
}

export async function getProductsByCategory(categoryId: string, limit = 20, offset = 0): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_products')
    .select('*')  // ← Basitleştir, ilişkileri kaldır
    .eq('primary_category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by category:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return []
  }

  console.log('Products found:', data?.length)  // ← Debug log ekle
  return data || []
}

export async function getProductsByBrand(brandId: string, limit = 20, offset = 0): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching products by brand:', error)
    return []
  }

  return (data || []) as Product[]
}

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

    // En iyi teklif (en düşük fiyatlı aktif teklif)
    supabase
      .from('offers')
      .select('price, stock_quantity, currency, vat_rate')
      .eq('product_id', product.id)
      .eq('is_active', true)
      .order('price', { ascending: true })
      .limit(1),

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
  const bestOffer = (offersResult.data as any)?.[0] as { price: number; stock_quantity: number; currency: string; vat_rate: number } | null ?? null
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
    price: bestOffer?.price ?? null,
    compare_at_price: null,
    stock_quantity: bestOffer?.stock_quantity ?? null,
    images: galleryImages,
  } as ProductDetailData
}
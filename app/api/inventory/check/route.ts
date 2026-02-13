import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Tek ürün stok kontrolü şeması
const singleItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().nullable().optional(),
  quantity: z.number().int().positive(),
})

// Toplu stok kontrolü şeması
const bulkCheckSchema = z.object({
  items: z.array(singleItemSchema),
})

// Offer tipi
type OfferData = {
  id: string
  price: number
  stock_quantity: number
  lead_time_days: number
  min_order_quantity: number
  product_id: string
  variant_id: string | null
}

interface InventoryCheckResult {
  product_id: string
  variant_id: string | null
  requested_quantity: number
  available_quantity: number
  is_available: boolean
  lead_time_days: number | null
  min_order_quantity: number | null
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'not_found'
  message: string
}

/**
 * POST /api/inventory/check
 * Stok durumunu kontrol eder
 * - Tek ürün veya toplu kontrol yapılabilir
 * - offers tablosundan stock_quantity bilgisi alınır
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const body = await request.json()
    
    // Tek ürün mü toplu kontrol mü belirle
    let itemsToCheck: z.infer<typeof singleItemSchema>[]
    
    if (body.items) {
      // Toplu kontrol
      const validation = bulkCheckSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Geçersiz veri formatı', details: validation.error.flatten() },
          { status: 400 }
        )
      }
      itemsToCheck = validation.data.items
    } else {
      // Tek ürün kontrolü
      const validation = singleItemSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Geçersiz veri formatı', details: validation.error.flatten() },
          { status: 400 }
        )
      }
      itemsToCheck = [validation.data]
    }

    const results: InventoryCheckResult[] = []
    let allAvailable = true

    for (const item of itemsToCheck) {
      // Ürün ve teklif bilgilerini al
      // variant_id varsa variant bazlı, yoksa ürün bazlı kontrol
      let query = supabase
        .from('offers')
        .select(`
          id,
          price,
          stock_quantity,
          lead_time_days,
          min_order_quantity,
          product_id,
          variant_id
        `)
        .eq('product_id', item.product_id)
        .eq('is_active', true)
      
      if (item.variant_id) {
        query = query.eq('variant_id', item.variant_id)
      } else {
        query = query.is('variant_id', null)
      }

      const { data, error } = await query.single()
      const offer = data as OfferData | null

      if (error || !offer) {
        // Ürün/teklif bulunamadı
        results.push({
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          requested_quantity: item.quantity,
          available_quantity: 0,
          is_available: false,
          lead_time_days: null,
          min_order_quantity: null,
          status: 'not_found',
          message: 'Ürün bulunamadı veya satışta değil',
        })
        allAvailable = false
        continue
      }

      const availableQty = offer.stock_quantity || 0
      const minOrderQty = offer.min_order_quantity || 1
      const isAvailable = availableQty >= item.quantity && item.quantity >= minOrderQty
      
      // Stok durumunu belirle
      let status: InventoryCheckResult['status']
      let message: string

      if (availableQty === 0) {
        status = 'out_of_stock'
        message = 'Ürün stokta yok'
        allAvailable = false
      } else if (availableQty < item.quantity) {
        status = 'low_stock'
        message = `Yetersiz stok. Mevcut: ${availableQty} adet`
        allAvailable = false
      } else if (item.quantity < minOrderQty) {
        status = 'low_stock'
        message = `Minimum sipariş miktarı: ${minOrderQty} adet`
        allAvailable = false
      } else if (availableQty <= 10) {
        status = 'low_stock'
        message = `Son ${availableQty} adet! Stok tükenmek üzere`
      } else {
        status = 'in_stock'
        message = 'Stokta mevcut'
      }

      results.push({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        requested_quantity: item.quantity,
        available_quantity: availableQty,
        is_available: isAvailable,
        lead_time_days: offer.lead_time_days,
        min_order_quantity: minOrderQty,
        status,
        message,
      })

      if (!isAvailable) {
        allAvailable = false
      }
    }

    return NextResponse.json({
      success: true,
      all_available: allAvailable,
      checked_count: results.length,
      results,
      // Özet bilgiler
      summary: {
        total_items: results.length,
        in_stock: results.filter(r => r.status === 'in_stock').length,
        low_stock: results.filter(r => r.status === 'low_stock').length,
        out_of_stock: results.filter(r => r.status === 'out_of_stock').length,
        not_found: results.filter(r => r.status === 'not_found').length,
      }
    })

  } catch (error) {
    console.error('Inventory Check API Error:', error)
    return NextResponse.json(
      { error: 'Stok kontrolünde bir hata oluştu' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/inventory/check?product_id=xxx&variant_id=xxx&quantity=1
 * Tek ürün için hızlı stok kontrolü
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    const variantId = searchParams.get('variant_id')
    const quantity = parseInt(searchParams.get('quantity') || '1', 10)

    if (!productId) {
      return NextResponse.json(
        { error: 'product_id parametresi gerekli' },
        { status: 400 }
      )
    }

    // UUID formatı kontrolü
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(productId)) {
      return NextResponse.json(
        { error: 'Geçersiz product_id formatı' },
        { status: 400 }
      )
    }

    if (variantId && !uuidRegex.test(variantId)) {
      return NextResponse.json(
        { error: 'Geçersiz variant_id formatı' },
        { status: 400 }
      )
    }

    if (isNaN(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: 'Geçersiz miktar' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Stok bilgisini al
    let query = supabase
      .from('offers')
      .select(`
        id,
        price,
        stock_quantity,
        lead_time_days,
        min_order_quantity
      `)
      .eq('product_id', productId)
      .eq('is_active', true)
    
    if (variantId) {
      query = query.eq('variant_id', variantId)
    } else {
      query = query.is('variant_id', null)
    }

    const { data, error } = await query.single()
    const offer = data as { id: string; price: number; stock_quantity: number; lead_time_days: number; min_order_quantity: number } | null

    if (error || !offer) {
      return NextResponse.json({
        success: true,
        product_id: productId,
        variant_id: variantId,
        is_available: false,
        available_quantity: 0,
        status: 'not_found',
        message: 'Ürün bulunamadı veya satışta değil',
      })
    }

    const availableQty = offer.stock_quantity || 0
    const minOrderQty = offer.min_order_quantity || 1
    const isAvailable = availableQty >= quantity && quantity >= minOrderQty

    // Durumu belirle
    let status: string
    let message: string

    if (availableQty === 0) {
      status = 'out_of_stock'
      message = 'Ürün stokta yok'
    } else if (availableQty < quantity) {
      status = 'low_stock'
      message = `Yetersiz stok. Mevcut: ${availableQty} adet`
    } else if (quantity < minOrderQty) {
      status = 'low_stock'
      message = `Minimum sipariş miktarı: ${minOrderQty} adet`
    } else if (availableQty <= 10) {
      status = 'low_stock'
      message = `Son ${availableQty} adet! Stok tükenmek üzere`
    } else {
      status = 'in_stock'
      message = 'Stokta mevcut'
    }

    return NextResponse.json({
      success: true,
      product_id: productId,
      variant_id: variantId,
      requested_quantity: quantity,
      available_quantity: availableQty,
      is_available: isAvailable,
      lead_time_days: offer.lead_time_days,
      min_order_quantity: minOrderQty,
      price: offer.price,
      status,
      message,
    })

  } catch (error) {
    console.error('Inventory Check GET Error:', error)
    return NextResponse.json(
      { error: 'Stok kontrolünde bir hata oluştu' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Guest sepet item şeması
const guestCartItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().nullable().optional(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
})

const syncCartSchema = z.object({
  session_id: z.string().min(1),
  guest_items: z.array(guestCartItemSchema),
})

/**
 * POST /api/cart/sync
 * Guest sepetini üye sepetine senkronize eder
 * - Kullanıcı giriş yaptığında çağrılır
 * - Guest sepetteki ürünler kullanıcı sepetine aktarılır
 * - Aynı ürün varsa miktarlar toplanır
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Kullanıcı kimlik doğrulaması
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Request body'yi parse et
    const body = await request.json()
    const validation = syncCartSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { guest_items } = validation.data

    // Eğer guest items boşsa, işlem yapma
    if (guest_items.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Senkronize edilecek ürün yok',
        merged_count: 0,
        added_count: 0,
      })
    }

    // Kullanıcının mevcut sepetini bul veya oluştur
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userCartResult = await (supabase as any)
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let cartId: string

    if (!userCartResult.data) {
      // Yeni sepet oluştur
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newCart, error: createError } = await (supabase as any)
        .from('cart')
        .insert({ user_id: user.id })
        .select('id')
        .single()

      if (createError || !newCart) {
        console.error('Cart creation error:', createError)
        return NextResponse.json(
          { error: 'Sepet oluşturulamadı' },
          { status: 500 }
        )
      }
      cartId = newCart.id as string
    } else {
      cartId = userCartResult.data.id as string
    }

    // Kullanıcının mevcut sepet ürünlerini al
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('id, product_id, variant_id, quantity')
      .eq('cart_id', cartId)

    type ExistingItem = { id: string; product_id: string; variant_id: string | null; quantity: number }
    const existingItemsMap = new Map<string, ExistingItem>(
      ((existingItems || []) as ExistingItem[]).map(item => [
        `${item.product_id}-${item.variant_id || 'null'}`,
        item
      ])
    )

    let mergedCount = 0
    let addedCount = 0

    // Her guest item için işlem yap
    for (const guestItem of guest_items) {
      const key = `${guestItem.product_id}-${guestItem.variant_id || 'null'}`
      const existingItem = existingItemsMap.get(key)

      if (existingItem) {
        // Ürün zaten sepette var, miktarı güncelle
        const newQuantity = existingItem.quantity + guestItem.quantity
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('cart_items')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
        
        mergedCount++
      } else {
        // Yeni ürün ekle
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('cart_items')
          .insert({
            cart_id: cartId,
            product_id: guestItem.product_id,
            variant_id: guestItem.variant_id || null,
            quantity: guestItem.quantity,
            price: guestItem.price,
          })
        
        addedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sepet başarıyla senkronize edildi',
      merged_count: mergedCount,
      added_count: addedCount,
      total_items: mergedCount + addedCount,
    })

  } catch (error) {
    console.error('Cart Sync API Error:', error)
    return NextResponse.json(
      { error: 'Sepet senkronizasyonunda bir hata oluştu' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart/sync
 * Guest sepetini temizler (opsiyonel)
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID gerekli' },
        { status: 400 }
      )
    }

    // Session based cart kullanıyorsak burada temizleme işlemi yapılır
    // Şu an localStorage kullandığımız için client-side temizlenir
    
    return NextResponse.json({
      success: true,
      message: 'Guest sepet temizlendi',
    })

  } catch (error) {
    console.error('Cart Sync DELETE Error:', error)
    return NextResponse.json(
      { error: 'Sepet temizlenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

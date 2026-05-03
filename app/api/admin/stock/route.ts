import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function PATCH(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limiter = rateLimit(`admin-stock:${ip}`, { limit: 60, windowMs: 60_000 })
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { offer_id, stock_quantity } = body

    if (!offer_id || typeof stock_quantity !== 'number' || stock_quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz istek verisi' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('offers')
      .update({ stock_quantity })
      .eq('id', offer_id)

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Stok güncellenemedi' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

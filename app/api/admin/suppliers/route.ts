import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hasCatalogAdminAccess } from '@/lib/auth/access'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Oturum açmanız gerekiyor' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!hasCatalogAdminAccess(profile?.role)) {
      return NextResponse.json({ success: false, error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
    }

    const { data: pendingSuppliers, error } = await supabase
      .from('profiles')
      .select('id, company_name, tax_number, phone, store_slug, store_description, created_at, is_active')
      .in('role', ['depo', 'supplier'])
      .eq('is_active', false)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ success: false, error: 'Depo listesi alınamadı' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      suppliers: pendingSuppliers ?? [],
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Oturum açmanız gerekiyor' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!hasCatalogAdminAccess(profile?.role)) {
      return NextResponse.json({ success: false, error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
    }

    const body = await request.json()
    const supplierId = typeof body?.supplierId === 'string' ? body.supplierId : ''
    const action = body?.action === 'approve' ? 'approve' : body?.action === 'reject' ? 'reject' : null

    if (!supplierId || !action) {
      return NextResponse.json({ success: false, error: 'Geçersiz istek' }, { status: 400 })
    }

    const nextIsActive = action === 'approve'

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_active: nextIsActive })
      .eq('id', supplierId)
      .in('role', ['depo', 'supplier'])

    if (updateError) {
      return NextResponse.json({ success: false, error: 'Onay durumu güncellenemedi' }, { status: 500 })
    }

    const notificationPayload = {
      user_id: supplierId,
      type: 'supplier_verification',
      title: nextIsActive ? 'Depo hesabınız onaylandı' : 'Depo hesabınız reddedildi',
      body: nextIsActive
        ? 'Depo hesabınız onaylandı. Artık teklif yayınlayabilirsiniz.'
        : 'Depo hesabınız reddedildi. Detaylar için destek ile iletişime geçebilirsiniz.',
      metadata: {
        action,
      },
      dedupe_key: `supplier-verification:${supplierId}:${action}`,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ((supabase as any).from('user_notifications') as any)
      .upsert(notificationPayload, { onConflict: 'user_id,dedupe_key' })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

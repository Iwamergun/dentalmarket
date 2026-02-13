import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: Adresi varsayılan yap
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Adresin kullanıcıya ait olduğunu kontrol et
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: address } = await (supabase as any)
      .from('addresses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!address) {
      return NextResponse.json(
        { error: 'Adres bulunamadı' },
        { status: 404 }
      )
    }

    // Tüm adreslerin is_default'unu false yap
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)

    // Seçilen adresi varsayılan yap
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('addresses')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Varsayılan adres güncellenirken hata:', error)
      return NextResponse.json(
        { error: 'Varsayılan adres güncellenirken bir hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Varsayılan adres API hatası:', err)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}

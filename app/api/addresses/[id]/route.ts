import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addressFormSchema } from '@/lib/validations/address'

// GET: Tek adres detay
export async function GET(
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Adres getirilirken hata:', error)
      return NextResponse.json(
        { error: 'Adres bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Adres detay API hatası:', err)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT: Adres güncelle
export async function PUT(
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

    const body = await request.json()

    // Validasyon
    const validationResult = addressFormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validasyon hatası',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const formData = validationResult.data

    // Adresin kullanıcıya ait olduğunu kontrol et
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('addresses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Adres bulunamadı' },
        { status: 404 }
      )
    }

    // Eğer varsayılan yapılacaksa diğerlerini false yap
    if (formData.is_default) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('addresses')
      .update({
        title: formData.address_title,
        full_name: formData.full_name,
        phone: formData.phone_number,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2 || null,
        city: formData.city,
        state: formData.state || null,
        postal_code: formData.postal_code || '',
        country: formData.country || 'Türkiye',
        is_default: formData.is_default || false,
        is_billing: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Adres güncellenirken hata:', error)
      return NextResponse.json(
        { error: 'Adres güncellenirken bir hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Adres güncelleme API hatası:', err)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE: Adres sil
export async function DELETE(
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

    // Adresin bilgilerini kontrol et
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: address } = await (supabase as any)
      .from('addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!address) {
      return NextResponse.json(
        { error: 'Adres bulunamadı' },
        { status: 404 }
      )
    }

    // Varsayılan adres silinemez
    if (address.is_default) {
      return NextResponse.json(
        { error: 'Varsayılan adres silinemez. Önce başka bir adresi varsayılan olarak ayarlayın.' },
        { status: 400 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Adres silinirken hata:', error)
      return NextResponse.json(
        { error: 'Adres silinirken bir hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Adres başarıyla silindi' })
  } catch (err) {
    console.error('Adres silme API hatası:', err)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}

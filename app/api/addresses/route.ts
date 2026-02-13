import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addressFormSchema } from '@/lib/validations/address'

// GET: Kullanıcının tüm adreslerini getir
export async function GET() {
  try {
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
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Adresler getirilirken hata:', error)
      return NextResponse.json(
        { error: 'Adresler getirilirken bir hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Adresler API hatası:', err)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}

// POST: Yeni adres ekle
export async function POST(request: NextRequest) {
  try {
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

    // Eğer varsayılan adres yapılacaksa, diğerlerinin is_default'unu false yap
    if (formData.is_default) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    // İlk adres ise otomatik varsayılan yap
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingAddresses } = await (supabase as any)
      .from('addresses')
      .select('id')
      .eq('user_id', user.id)

    const isFirstAddress = !existingAddresses || existingAddresses.length === 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('addresses')
      .insert({
        user_id: user.id,
        title: formData.address_title,
        full_name: formData.full_name,
        phone: formData.phone_number,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2 || null,
        city: formData.city,
        state: formData.state || null,
        postal_code: formData.postal_code || '',
        country: formData.country || 'Türkiye',
        is_default: isFirstAddress ? true : formData.is_default || false,
        is_billing: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Adres eklenirken hata:', error)
      return NextResponse.json(
        { error: 'Adres eklenirken bir hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('Adres ekleme API hatası:', err)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}

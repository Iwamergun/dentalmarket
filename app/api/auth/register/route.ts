import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { createAdminClient } from '@/lib/supabase/admin'
import { registerSchema } from '@/lib/validations/auth'
import {
  buildProfileDefaults,
  generateUniqueStoreSlug,
  normalizeSelfRegisterRole,
  slugifyStoreName,
} from '@/lib/auth/register-profile'

type ExistingStoreSlug = { store_slug: string | null }
type SupabaseErrorLike = {
  message?: string
  code?: string
  details?: string
}

function getRegisterProfileErrorMessage(profileError: SupabaseErrorLike) {
  if (profileError.code === '23505') {
    return 'Bu firma bilgileriyle daha önce hesap oluşturulmuş olabilir. Lütfen bilgilerinizi kontrol edin.'
  }

  if (profileError.code === '22P02' && profileError.message?.toLowerCase().includes('role')) {
    return 'Hesap türü sistemle uyumlu değil. Lütfen destek ekibiyle iletişime geçin.'
  }

  return 'Profil oluşturulurken bir hata oluştu'
}

async function upsertProfile(
  adminSupabase: ReturnType<typeof createAdminClient>,
  payload: Record<string, unknown>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((adminSupabase as any).from('profiles') as any).upsert(payload, { onConflict: 'id' })
}

async function resolveStoreSlug(adminSupabase: ReturnType<typeof createAdminClient>, companyName: string) {
  const baseSlug = slugifyStoreName(companyName)
  const escapedBaseSlug = baseSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await ((adminSupabase as any).from('profiles') as any)
    .select('store_slug')
    .ilike('store_slug', `${baseSlug}%`)

  const existingSlugs = ((data ?? []) as ExistingStoreSlug[])
    .map((item) => item.store_slug)
    .filter((slug): slug is string => {
      if (!slug) {
        return false
      }

      return slug === baseSlug || new RegExp(`^${escapedBaseSlug}-\\d+$`).test(slug)
    })

  return generateUniqueStoreSlug(baseSlug, existingSlugs)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Form doğrulama hatası',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const role = normalizeSelfRegisterRole(validationResult.data.role)
    const adminSupabase = createAdminClient()
    const publicSupabase = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { data: signUpData, error: signUpError } = await publicSupabase.auth.signUp({
      email: validationResult.data.email,
      password: validationResult.data.password,
      options: {
        data: {
          first_name: validationResult.data.firstName,
          last_name: validationResult.data.lastName,
          full_name: `${validationResult.data.firstName} ${validationResult.data.lastName}`,
        },
        emailRedirectTo: body.emailRedirectTo,
      },
    })

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message || 'Kayıt olurken bir hata oluştu' },
        { status: 400 }
      )
    }

    const userId = signUpData.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı oluşturulamadı' },
        { status: 500 }
      )
    }

    const storeSlug = role === 'depo'
      ? await resolveStoreSlug(adminSupabase, validationResult.data.company_name)
      : null

    const profilePayload = {
      id: userId,
      role,
      company_name: validationResult.data.company_name,
      tax_number: validationResult.data.tax_number || null,
      phone: validationResult.data.phone,
      store_description: validationResult.data.store_description || null,
      store_slug: storeSlug,
      ...buildProfileDefaults(role),
    }

    let { error: profileError } = await upsertProfile(adminSupabase, profilePayload)
    if (
      profileError?.code === '22P02' &&
      role === 'depo' &&
      profileError.message?.toLowerCase().includes('user_role')
    ) {
      ;({ error: profileError } = await upsertProfile(adminSupabase, {
        ...profilePayload,
        role: 'supplier',
      }))
    }

    if (profileError) {
      console.error('Profile upsert error:', profileError.message, profileError.code, profileError.details)
      const { error: deleteUserError } = await adminSupabase.auth.admin.deleteUser(userId)
      if (deleteUserError) {
        console.error('Orphan auth user cleanup error:', deleteUserError.message)
      }
      return NextResponse.json(
        { error: getRegisterProfileErrorMessage(profileError) },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { error: 'Kayıt olurken beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}

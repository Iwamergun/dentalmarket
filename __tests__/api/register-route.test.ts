import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/auth/register/route'

const validRegisterBody = {
  role: 'clinic',
  company_name: 'Test Klinik',
  tax_number: '',
  phone: '05551234567',
  store_description: '',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'Password1',
  confirmPassword: 'Password1',
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('register route', () => {
  it('returns a configuration error when Supabase server env is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')

    const response = await POST(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(validRegisterBody),
      }) as never
    )

    await expect(response.json()).resolves.toEqual({
      error: 'Kayıt servisi yapılandırması eksik. Lütfen site yöneticisiyle iletişime geçin.',
      code: 'REGISTER_SERVICE_MISCONFIGURED',
    })
    expect(response.status).toBe(503)
  })
})

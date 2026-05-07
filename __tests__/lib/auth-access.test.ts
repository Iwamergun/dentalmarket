import { describe, expect, it } from 'vitest'
import { getAuthMetadata, hasAdminAccess } from '@/lib/auth/access'

describe('auth access helpers', () => {
  it('allows admin-like profile roles', () => {
    expect(hasAdminAccess('admin', undefined)).toBe(true)
    expect(hasAdminAccess('stock_manager', undefined)).toBe(true)
  })

  it('allows admin access from user metadata', () => {
    const metadata = getAuthMetadata({
      app_metadata: { roles: ['clinic_user'] },
      user_metadata: { roles: ['inventory_manager'] },
    })

    expect(hasAdminAccess(null, metadata)).toBe(true)
  })

  it('denies non-admin roles', () => {
    expect(hasAdminAccess('clinic', { role: 'customer' })).toBe(false)
  })
})

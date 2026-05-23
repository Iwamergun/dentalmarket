import { describe, expect, it } from 'vitest'
import { getAuthMetadata, hasAdminAccess, hasCatalogAdminAccess, hasSupplierPanelAccess } from '@/lib/auth/access'

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

  it('catalog admin access should allow only central admin roles', () => {
    expect(hasCatalogAdminAccess('admin')).toBe(true)
    expect(hasCatalogAdminAccess('super_admin')).toBe(true)
    expect(hasCatalogAdminAccess('depo')).toBe(false)
  })

  it('supplier panel access should allow supplier and depo-like roles', () => {
    expect(hasSupplierPanelAccess('supplier', undefined)).toBe(true)
    expect(hasSupplierPanelAccess('depo', undefined)).toBe(true)
    expect(hasSupplierPanelAccess('admin', undefined)).toBe(false)
    expect(hasSupplierPanelAccess('clinic', undefined)).toBe(false)
  })
})

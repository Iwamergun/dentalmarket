import { describe, expect, it } from 'vitest'
import { getAuthMetadata, hasAdminAccess, hasCatalogAdminAccess, hasSupplierPanelAccess } from '@/lib/auth/access'

describe('auth access helpers', () => {
  it('allows admin-like profile roles', () => {
    expect(hasAdminAccess('admin')).toBe(true)
    expect(hasAdminAccess('depo')).toBe(true)
    expect(hasAdminAccess('super_admin')).toBe(true)
    expect(hasAdminAccess('superadmin')).toBe(true)
  })

  it('legacy warehouse/stock rolleri admin sayılmaz', () => {
    expect(hasAdminAccess('depot')).toBe(false)
    expect(hasAdminAccess('warehouse')).toBe(false)
    expect(hasAdminAccess('stock')).toBe(false)
    expect(hasAdminAccess('stock_manager')).toBe(false)
    expect(hasAdminAccess('inventory_manager')).toBe(false)
    expect(hasAdminAccess('warehouse_manager')).toBe(false)
  })

  it('user_metadata üzerinden admin yetkisi verilmez', () => {
    // user_metadata kullanıcı tarafından değiştirilebildiğinden güvenilmez
    const metadata = getAuthMetadata({
      app_metadata: { roles: ['clinic_user'] },
      user_metadata: { roles: ['inventory_manager'] },
    })
    expect(hasAdminAccess(null, metadata)).toBe(false)
  })

  it('getAuthMetadata yalnızca app_metadata döndürür', () => {
    const metadata = getAuthMetadata({
      app_metadata: { custom_role: 'trusted' },
      user_metadata: { custom_role: 'untrusted' },
    })
    expect(metadata).toEqual({ custom_role: 'trusted' })
  })

  it('denies non-admin roles', () => {
    expect(hasAdminAccess('clinic')).toBe(false)
    expect(hasAdminAccess('user')).toBe(false)
    expect(hasAdminAccess(null)).toBe(false)
    expect(hasAdminAccess(undefined)).toBe(false)
  })

  it('catalog admin access should allow only central admin roles', () => {
    expect(hasCatalogAdminAccess('admin')).toBe(true)
    expect(hasCatalogAdminAccess('super_admin')).toBe(true)
    expect(hasCatalogAdminAccess('depo')).toBe(false)
  })

  it('supplier panel access should allow only depo role', () => {
    expect(hasSupplierPanelAccess('depo')).toBe(true)
    expect(hasSupplierPanelAccess('supplier')).toBe(false)
    expect(hasSupplierPanelAccess('admin')).toBe(false)
    expect(hasSupplierPanelAccess('clinic')).toBe(false)
  })
})

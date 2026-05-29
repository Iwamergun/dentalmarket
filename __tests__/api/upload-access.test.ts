import { describe, expect, it } from 'vitest'
import { canUploadMedia } from '@/lib/auth/upload-access'

describe('upload access', () => {
  it('yalnızca depo rolüne izin vermeli', () => {
    expect(canUploadMedia('supplier', undefined)).toBe(false)
    expect(canUploadMedia('depo', undefined)).toBe(true)
  })

  it('legacy warehouse/stock rolleriyle izin vermemeli', () => {
    expect(canUploadMedia('stock_manager', undefined)).toBe(false)
    expect(canUploadMedia('warehouse', undefined)).toBe(false)
  })

  it('admin rolüne izin vermeli', () => {
    expect(canUploadMedia('admin', undefined)).toBe(true)
  })

  it('user_metadata tabanlı warehouse token artık upload yetkisi vermez', () => {
    expect(
      canUploadMedia(null, {
        roles: ['warehouse_manager'],
      })
    ).toBe(false)
  })

  it('clinic ve ilgisiz rollere izin vermemeli', () => {
    expect(canUploadMedia('clinic', undefined)).toBe(false)
    expect(canUploadMedia('user', undefined)).toBe(false)
    expect(canUploadMedia(null, undefined)).toBe(false)
  })
})

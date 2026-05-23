import { describe, expect, it } from 'vitest'
import { canUploadMedia } from '@/app/api/upload/route'

describe('upload access', () => {
  it('allows supplier role explicitly', () => {
    expect(canUploadMedia('supplier', undefined)).toBe(true)
  })

  it('allows admin-like warehouse roles', () => {
    expect(canUploadMedia('stock_manager', undefined)).toBe(true)
    expect(canUploadMedia('depo', undefined)).toBe(true)
  })

  it('allows admin-like metadata tokens', () => {
    expect(
      canUploadMedia(null, {
        roles: ['warehouse_manager'],
      })
    ).toBe(true)
  })

  it('denies unrelated roles', () => {
    expect(canUploadMedia('clinic', undefined)).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import {
  buildProfileDefaults,
  generateUniqueStoreSlug,
  isValidTurkishTaxNumber,
  normalizeSelfRegisterRole,
  slugifyStoreName,
} from '@/lib/auth/register-profile'

describe('register profile helpers', () => {
  it('admin self-assign engellenmeli', () => {
    expect(() => normalizeSelfRegisterRole('admin')).toThrow()
    expect(normalizeSelfRegisterRole('clinic')).toBe('clinic')
    expect(normalizeSelfRegisterRole('depo')).toBe('depo')
  })

  it('clinic otomatik aktif, depo onay beklemeli', () => {
    expect(buildProfileDefaults('clinic').is_active).toBe(true)
    expect(buildProfileDefaults('depo').is_active).toBe(false)
  })

  it('TR vergi numarası yalnızca 10 haneli rakam olmalı', () => {
    expect(isValidTurkishTaxNumber('1234567890')).toBe(true)
    expect(isValidTurkishTaxNumber('123456789')).toBe(false)
    expect(isValidTurkishTaxNumber('12345678901')).toBe(false)
    expect(isValidTurkishTaxNumber('12345A7890')).toBe(false)
  })

  it('store slug Türkçe karakterlerden normalize edilmeli', () => {
    expect(slugifyStoreName('Acme Dental Depo')).toBe('acme-dental-depo')
    expect(slugifyStoreName('Çöğüş İmplant')).toBe('cogus-implant')
  })

  it('store slug çakışmalarında sayaç eklenmeli', () => {
    expect(generateUniqueStoreSlug('yeni-depo', [])).toBe('yeni-depo')
    expect(generateUniqueStoreSlug('acme-dental-depo', ['acme-dental-depo'])).toBe('acme-dental-depo-2')
    expect(generateUniqueStoreSlug('acme-dental-depo', ['acme-dental-depo', 'acme-dental-depo-2'])).toBe('acme-dental-depo-3')
  })
})

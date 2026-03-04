import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import { addressFormSchema } from '@/lib/validations/address'

describe('loginSchema', () => {
  it('geçerli email kabul edilmeli', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'Abcdef1' })
    expect(result.success).toBe(true)
  })

  it('geçersiz email reddedilmeli', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'Abcdef1' })
    expect(result.success).toBe(false)
  })

  it('kısa şifre reddedilmeli (min 6 karakter)', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validData = {
    firstName: 'Ali',
    lastName: 'Yılmaz',
    email: 'ali@example.com',
    password: 'Abcdef1',
    confirmPassword: 'Abcdef1',
  }

  it('geçerli veri kabul edilmeli', () => {
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('şifreler eşleşmiyorsa reddedilmeli', () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: 'Different1' })
    expect(result.success).toBe(false)
  })

  it('eksik zorunlu alan reddedilmeli', () => {
    const { firstName, ...rest } = validData
    const result = registerSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })
})

describe('addressFormSchema', () => {
  const validAddress = {
    address_title: 'Ev',
    full_name: 'Ali Yılmaz',
    phone_number: '05321234567',
    address_line1: 'Atatürk Caddesi No:1',
    city: 'İstanbul',
    postal_code: '34000',
    country: 'Türkiye',
    is_default: false,
  }

  it('geçerli adres formu kabul edilmeli', () => {
    const result = addressFormSchema.safeParse(validAddress)
    expect(result.success).toBe(true)
  })

  it('eksik zorunlu alan reddedilmeli', () => {
    const { address_line1, ...rest } = validAddress
    const result = addressFormSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('telefon numarası validasyonu çalışmalı', () => {
    const invalid = { ...validAddress, phone_number: '1234' }
    expect(addressFormSchema.safeParse(invalid).success).toBe(false)

    const valid = { ...validAddress, phone_number: '05321234567' }
    expect(addressFormSchema.safeParse(valid).success).toBe(true)
  })
})

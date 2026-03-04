import { describe, it, expect } from 'vitest'
import { siteConfig } from '@/lib/constants/site-config'

describe('siteConfig', () => {
  it('name fallback\'i "Dent Alışveriş" olmalı', () => {
    expect(siteConfig.name).toBe('Dent Alışveriş')
  })

  it('locale "tr-TR" olmalı', () => {
    expect(siteConfig.locale).toBe('tr-TR')
  })

  it('currency "TRY" olmalı', () => {
    expect(siteConfig.currency).toBe('TRY')
  })

  it('contact.email "info@dentalisveris.com" içermeli', () => {
    expect(siteConfig.contact.email).toContain('info@dentalisveris.com')
  })

  it('social objesinin twitter, facebook, linkedin alanları olmalı', () => {
    expect(siteConfig.social).toHaveProperty('twitter')
    expect(siteConfig.social).toHaveProperty('facebook')
    expect(siteConfig.social).toHaveProperty('linkedin')
  })
})

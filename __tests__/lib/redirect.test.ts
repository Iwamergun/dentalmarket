import { describe, expect, it } from 'vitest'
import { buildLoginRedirectPath, resolvePostLoginRedirect, sanitizeRedirectPath } from '@/lib/auth/redirect'

describe('redirect helpers', () => {
  it('sadece site içi relative path redirect kabul etmeli', () => {
    expect(sanitizeRedirectPath('/odeme')).toBe('/odeme')
    expect(sanitizeRedirectPath('/profil/siparislerim?tab=all')).toBe('/profil/siparislerim?tab=all')
    expect(sanitizeRedirectPath('https://evil.com')).toBeNull()
    expect(sanitizeRedirectPath('//evil.com')).toBeNull()
    expect(sanitizeRedirectPath('odeme')).toBeNull()
  })

  it('geçersiz redirect varsa güvenli fallback dönmeli', () => {
    expect(resolvePostLoginRedirect('/odeme')).toBe('/odeme')
    expect(resolvePostLoginRedirect('https://evil.com')).toBe('/profil')
  })

  it('middleware redirect path oluştururken query string korumalı', () => {
    expect(buildLoginRedirectPath('/odeme', '?from=cart')).toBe('/odeme?from=cart')
    expect(buildLoginRedirectPath('https://evil.com', '?x=1')).toBe('/')
  })
})

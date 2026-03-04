import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('ilk istek başarılı olmalı (remaining = limit - 1)', () => {
    const result = rateLimit('test-id-1', { limit: 5, windowMs: 60_000 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('limit dahilindeki istekler başarılı olmalı', () => {
    for (let i = 0; i < 5; i++) {
      const result = rateLimit('test-id-2', { limit: 5, windowMs: 60_000 })
      expect(result.success).toBe(true)
    }
  })

  it('limit aşıldığında success: false dönmeli', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit('test-id-3', { limit: 5, windowMs: 60_000 })
    }
    const result = rateLimit('test-id-3', { limit: 5, windowMs: 60_000 })
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('farklı identifier\'lar bağımsız olmalı', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit('test-id-4a', { limit: 5, windowMs: 60_000 })
    }
    const result = rateLimit('test-id-4b', { limit: 5, windowMs: 60_000 })
    expect(result.success).toBe(true)
  })

  it('zaman penceresi geçtikten sonra reset olmalı', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit('test-id-5', { limit: 5, windowMs: 60_000 })
    }
    expect(rateLimit('test-id-5', { limit: 5, windowMs: 60_000 }).success).toBe(false)

    vi.advanceTimersByTime(61_000)

    const result = rateLimit('test-id-5', { limit: 5, windowMs: 60_000 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('custom config ile çalışmalı', () => {
    const result = rateLimit('test-id-6', { limit: 3, windowMs: 30_000 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(2)

    rateLimit('test-id-6', { limit: 3, windowMs: 30_000 })
    rateLimit('test-id-6', { limit: 3, windowMs: 30_000 })
    const last = rateLimit('test-id-6', { limit: 3, windowMs: 30_000 })
    expect(last.success).toBe(false)
  })
})

describe('getClientIp', () => {
  it('x-forwarded-for header\'ından IP almalı', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('x-real-ip header\'ından IP almalı', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '9.10.11.12' },
    })
    expect(getClientIp(req)).toBe('9.10.11.12')
  })

  it('header yoksa unknown dönmeli', () => {
    const req = new Request('http://localhost')
    expect(getClientIp(req)).toBe('unknown')
  })
})

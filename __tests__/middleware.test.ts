import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// Supabase mock
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  })),
}))

import { createServerClient } from '@supabase/ssr'
import { middleware, config } from '@/middleware'

function makeRequest(pathname: string) {
  return new NextRequest(new URL(`http://localhost${pathname}`))
}

describe('middleware config', () => {
  it('matcher config\'de /admin/:path*, /supplier/:path*, /dashboard/:path* olmalı', () => {
    expect(config.matcher).toContain('/admin/:path*')
    expect(config.matcher).toContain('/supplier/:path*')
    expect(config.matcher).toContain('/dashboard/:path*')
  })
})

describe('middleware route koruması', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('auth olmadan /admin → /giris\'e redirect etmeli', async () => {
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn(),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

    const req = makeRequest('/admin')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/giris')
  })

  it('auth olmadan /supplier → /giris\'e redirect etmeli', async () => {
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn(),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

    const req = makeRequest('/supplier')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/giris')
  })

  it('auth olmadan /dashboard → /giris\'e redirect etmeli', async () => {
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn(),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

    const req = makeRequest('/dashboard')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/giris')
  })

  it('admin olmayan kullanıcı /admin → / e redirect etmeli', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'user' } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: vi.fn(() => mockFrom),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

    const req = makeRequest('/admin')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toMatch(/\/$/)
  })

  it('admin kullanıcı /admin\'e erişebilmeli', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'admin' } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1' } } }) },
      from: vi.fn(() => mockFrom),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

    const req = makeRequest('/admin')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('depo kullanıcı /admin/products/new yerine supplier teklif sayfasına yönlenmeli', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'depo' } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'depo-1' } } }) },
      from: vi.fn(() => mockFrom),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

    const req = makeRequest('/admin/products/new')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/supplier/urunler/yeni')
  })

  it('admin kullanıcı /admin/products/new erişimini korumalı', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'admin' } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-2' } } }) },
      from: vi.fn(() => mockFrom),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

    const req = makeRequest('/admin/products/new')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })
})

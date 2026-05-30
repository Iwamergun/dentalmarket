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
  it('matcher config\'de korumalı pathler olmalı', () => {
    expect(config.matcher).toContain('/admin/:path*')
    expect(config.matcher).toContain('/supplier/:path*')
    expect(config.matcher).toContain('/dashboard/:path*')
    expect(config.matcher).toContain('/odeme')
    expect(config.matcher).toContain('/odeme/:path*')
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

  it('auth olmadan /odeme → /giris?redirect=/odeme\'ye redirect etmeli', async () => {
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn(),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)

    const req = makeRequest('/odeme')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/giris?redirect=%2Fodeme')
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

  it('clinic kullanıcı /admin\'e erişememeli', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'clinic', is_active: true } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'clinic-admin-denied' } } }) },
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

  it('depo kullanıcı /admin\'e erişebilmeli', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'depo', is_active: true } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'depo-1' } } }) },
      from: vi.fn(() => mockFrom),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)
    const req = makeRequest('/admin')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('depo kullanıcı /supplier\'a erişebilmeli', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'depo', is_active: true } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'depo-1' } } }) },
      from: vi.fn(() => mockFrom),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)
    const req = makeRequest('/supplier/urunler')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('clinic kullanıcı /supplier\'a erişememeli', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'clinic', is_active: true } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'clinic-1' } } }) },
      from: vi.fn(() => mockFrom),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)
    const req = makeRequest('/supplier/urunler')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toMatch(/\/$/)
  })

  it('onaysız depo /supplier/urunler/yeni sayfasına girememeli', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'depo', is_active: false } }),
    }
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'depo-pending' } } }) },
      from: vi.fn(() => mockFrom),
    }
    ;(createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient)
    const req = makeRequest('/supplier/urunler/yeni')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/supplier/dashboard')
  })

  it('admin kullanıcı /admin/products/new erişebilmeli', async () => {
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

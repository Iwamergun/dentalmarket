import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  serverFrom: vi.fn(),
  adminFrom: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mocks.getUser,
    },
    from: mocks.serverFrom,
  })),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: mocks.adminFrom,
  })),
}))

import { GET } from '@/app/api/orders/my/route'

describe('my orders route', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('returns owned orders without requiring the service role key', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')

    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'clinic@example.com',
        },
      },
    })

    mocks.serverFrom.mockImplementation((table: string) => {
      if (table === 'orders') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({
              data: [
                {
                  id: 'order-1',
                  order_number: 'DA-1',
                  status: 'confirmed',
                  payment_status: 'pending',
                  payment_method: 'bank_transfer',
                  subtotal: 100,
                  shipping_cost: 0,
                  total: 100,
                  created_at: '2026-06-02T12:00:00.000Z',
                  shipping_address: { email: 'clinic@example.com' },
                },
              ],
              error: null,
            })),
          })),
        }
      }

      if (table === 'order_items') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ count: 2, error: null })),
          })),
        }
      }

      throw new Error(`Unexpected table: ${table}`)
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.orders).toEqual([
      expect.objectContaining({
        id: 'order-1',
        items_count: 2,
        updated_at: '2026-06-02T12:00:00.000Z',
      }),
    ])
  })
})

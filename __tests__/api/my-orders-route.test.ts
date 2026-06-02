import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  adminFrom: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mocks.getUser,
    },
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
  })

  it('returns owned orders when pending email lookup fails', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'clinic@example.com',
        },
      },
    })

    let ordersQueryCount = 0
    mocks.adminFrom.mockImplementation((table: string) => {
      if (table === 'orders') {
        ordersQueryCount += 1

        if (ordersQueryCount === 1) {
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

        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              filter: vi.fn(() => Promise.resolve({
                data: null,
                error: { message: 'JSON filter is not available' },
              })),
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

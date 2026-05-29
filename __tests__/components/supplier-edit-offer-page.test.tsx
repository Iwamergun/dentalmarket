import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, back: vi.fn() }),
  useParams: () => ({ id: 'offer-1' }),
}))

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

import { createBrowserClient } from '@supabase/ssr'
import UrunDuzenlePage from '@/app/supplier/urunler/[id]/duzenle/page'

describe('Supplier offer edit page', () => {
  it('updates only offers without catalog_products writes', async () => {
    const catalogUpdate = vi.fn()
    const catalogInsert = vi.fn()
    const catalogDelete = vi.fn()

    const offersUpdateEqSupplier = vi.fn(async () => ({ error: null }))
    const offersUpdateEqId = vi.fn(() => ({ eq: offersUpdateEqSupplier }))
    const offersUpdate = vi.fn(() => ({ eq: offersUpdateEqId }))

    const from = vi.fn((table: string) => {
      if (table === 'offers') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: {
                    id: 'offer-1',
                    product_id: 'product-1',
                    supplier_sku: 'SUP-1',
                    description: 'Depo açıklama',
                    expiry_date: '2027-12-31',
                    price: 100,
                    vat_rate: 20,
                    stock_quantity: 5,
                    min_order_quantity: 1,
                    lead_time_days: 0,
                    shipping_cost: 0,
                    free_shipping_threshold: null,
                    payment_options: null,
                    notes: null,
                    is_active: true,
                  },
                })),
              })),
            })),
          })),
          update: offersUpdate,
          delete: vi.fn(),
        }
      }

      if (table === 'catalog_products') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(async () => ({
                data: {
                  id: 'product-1',
                  name: 'Ürün A',
                  slug: 'urun-a',
                  sku: 'CAT-1',
                  barcode: '123',
                  short_description: 'Kısa',
                  description: 'Master açıklama',
                  primary_category_id: 'cat-1',
                  brand_id: 'brand-1',
                  primary_image: null,
                  compare_at_price: 120,
                },
              })),
            })),
          })),
          update: catalogUpdate,
          insert: catalogInsert,
          delete: catalogDelete,
        }
      }

      if (table === 'categories') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(async () => ({ data: [{ id: 'cat-1', name: 'Kategori A' }] })),
            })),
          })),
        }
      }

      if (table === 'brands') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(async () => ({ data: [{ id: 'brand-1', name: 'Marka A' }] })),
            })),
          })),
        }
      }

      return {
        select: vi.fn(),
      }
    })

    ;(createBrowserClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from,
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: 'supplier-1' } } })),
      },
    })

    render(<UrunDuzenlePage />)

    await screen.findByText('Katalog Bilgileri (Salt Okunur)')
    fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }))

    await waitFor(() => {
      expect(offersUpdate).toHaveBeenCalledTimes(1)
    })

    expect(catalogUpdate).not.toHaveBeenCalled()
    expect(catalogInsert).not.toHaveBeenCalled()
    expect(catalogDelete).not.toHaveBeenCalled()
  })
})

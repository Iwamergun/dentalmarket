import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SepetPage from '@/app/sepet/page'

const updateQuantityMock = vi.fn().mockResolvedValue(undefined)
const removeFromCartMock = vi.fn().mockResolvedValue(undefined)
const clearCartMock = vi.fn().mockResolvedValue(undefined)
const applyDiscountCodeMock = vi.fn().mockResolvedValue(true)
const removeDiscountCodeMock = vi.fn()

vi.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      email: 'member@example.com',
      user_metadata: {
        full_name: 'Member User',
      },
    },
    loading: false,
  }),
}))

vi.mock('@/app/contexts/CartContext', () => ({
  useCart: () => ({
    items: [
      {
        id: 'item-1',
        product_id: 'product-1',
        quantity: 2,
        price: 250,
        product: {
          name: 'Kompozit Dolgu Seti',
          slug: 'kompozit-dolgu-seti',
          primary_image: null,
          out_of_stock: false,
          low_stock_warning: false,
          stock_quantity: 12,
          price_changed: false,
          brands: {
            name: 'Dent Brand',
          },
          sku: 'SKU-1',
        },
      },
    ],
    itemCount: 2,
    subtotal: 500,
    finalTotal: 500,
    shipping_cost: 0,
    discount_code: null,
    discount_amount: 0,
    loading: false,
    error: null,
    updateQuantity: updateQuantityMock,
    removeFromCart: removeFromCartMock,
    clearCart: clearCartMock,
    applyDiscountCode: applyDiscountCodeMock,
    removeDiscountCode: removeDiscountCodeMock,
  }),
}))

describe('SepetPage', () => {
  beforeEach(() => {
    updateQuantityMock.mockClear()
    removeFromCartMock.mockClear()
    clearCartMock.mockClear()
    applyDiscountCodeMock.mockClear()
    removeDiscountCodeMock.mockClear()
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('keeps cart controls accessible while using the refreshed summary layout', async () => {
    render(<SepetPage />)

    expect(screen.getByText('Sepetim')).toBeInTheDocument()
    expect(screen.getByText('Sipariş Özeti')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ödemeye Geç/i })).toHaveAttribute('href', '/odeme')
    expect(screen.getByRole('link', { name: /Alışverişe Devam Et/i })).toHaveAttribute('href', '/urunler')

    fireEvent.click(screen.getByRole('button', { name: 'Miktarı artır' }))
    await waitFor(() => expect(updateQuantityMock).toHaveBeenCalledWith('item-1', 3))

    fireEvent.click(screen.getByRole('button', { name: 'Sepetten kaldır' }))
    await waitFor(() => expect(removeFromCartMock).toHaveBeenCalledWith('item-1'))

    fireEvent.change(screen.getByPlaceholderText('İndirim kodu'), { target: { value: 'indirim10' } })
    fireEvent.click(screen.getByRole('button', { name: 'Uygula' }))
    await waitFor(() => expect(applyDiscountCodeMock).toHaveBeenCalledWith('INDIRIM10'))

    fireEvent.click(screen.getByRole('button', { name: /Sepeti Temizle/i }))
    await waitFor(() => expect(clearCartMock).toHaveBeenCalled())
  })
})

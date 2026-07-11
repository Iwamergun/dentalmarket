import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/catalog/product-card'

vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <img alt={props.alt} />,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' }, loading: false }),
}))

vi.mock('@/components/cart/AddToCartButton', () => ({
  AddToCartButton: () => <button type="button">Sepete Ekle</button>,
}))

vi.mock('@/components/WishlistButton', () => ({
  WishlistButton: () => <button type="button" aria-label="Favorilere ekle">Fav</button>,
}))

describe('ProductCard redesign', () => {
  it('renders text add-to-cart action and compact rating summary', () => {
    render(
      <ProductCard
        product={{
          id: 'p1',
          name: 'Test Ürün',
          slug: 'test-urun',
          primary_image: null,
          sku: 'SKU-1',
          short_description: null,
          is_active: true,
          brand_id: null,
          brand_name: 'Marka',
          primary_category_id: null,
          category_name: null,
          min_price: 100,
          best_supplier_id: null,
          best_stock: 12,
          best_lead_time: null,
          best_shipping_cost: null,
          offer_count: 2,
          price_min: 100,
          price_max: 120,
          rating_avg: 4,
          review_count: 12,
        }}
      />
    )

    expect(screen.getByRole('button', { name: 'Favorilere ekle' })).toBeInTheDocument()
    expect(screen.getByText('Sepete Ekle')).toBeInTheDocument()
    expect(screen.getByText('★ 4.0 · 12 değerlendirme')).toBeInTheDocument()
    expect(screen.getByText('Stokta · 12 adet')).toBeInTheDocument()
  })
})

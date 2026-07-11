import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CartLayout from '@/app/sepet/layout'

vi.mock('@/components/layout/header', () => ({
  Header: () => <div>Header</div>,
}))

vi.mock('@/components/layout/category-bar', () => ({
  CategoryBar: () => <div>CategoryBar</div>,
}))

vi.mock('@/components/layout/footer', () => ({
  Footer: () => <div>Footer</div>,
}))

vi.mock('@/components/layout/mobile-bottom-nav', () => ({
  MobileBottomNav: () => <div>MobileBottomNav</div>,
}))

describe('Cart layout', () => {
  it('wraps the cart route in the same public storefront shell', () => {
    render(
      <CartLayout>
        <div>Cart content</div>
      </CartLayout>
    )

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('CategoryBar')).toBeInTheDocument()
    expect(screen.getByText('Cart content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
    expect(screen.getByText('MobileBottomNav')).toBeInTheDocument()
  })
})

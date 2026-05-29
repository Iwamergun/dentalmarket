import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/header'

const pushMock = vi.fn()

vi.mock('@/components/cart/CartButton', () => ({
  CartButton: () => <button type="button">Cart</button>,
}))

vi.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

describe('Header brand area', () => {
  it('should render icon + exact DentAlışveriş wordmark without subtitle', () => {
    render(<Header />)

    expect(screen.getByText('DentAlışveriş')).toBeInTheDocument()
    expect(screen.getByAltText('DentAlışveriş')).toHaveAttribute('src', '/brand/dentalisveris-icon.svg')
    expect(screen.queryByText('Premium dental marketplace')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kategoriler' })).toHaveAttribute('href', '/kategoriler')
    expect(screen.getByRole('link', { name: 'Markalar' })).toHaveAttribute('href', '/markalar')
    expect(screen.getByRole('link', { name: 'Tüm Ürünler' })).toHaveAttribute('href', '/urunler')
    expect(screen.getByRole('link', { name: 'Kampanyalar' })).toHaveAttribute('href', '/kampanyalar')
  })

  it('should route search queries to /urunler?q=', () => {
    render(<Header />)

    const searchInput = screen.getAllByPlaceholderText('Ürün, marka veya kategori ara...')[0]
    fireEvent.change(searchInput, { target: { value: 'anestezi' } })
    fireEvent.submit(searchInput.closest('form')!)

    expect(pushMock).toHaveBeenCalledWith('/urunler?q=anestezi')
  })
})

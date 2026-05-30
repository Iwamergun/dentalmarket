import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/header'

const pushMock = vi.fn()
const pathnameMock = vi.fn(() => '/')

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
  usePathname: () => pathnameMock(),
}))

describe('Header brand area', () => {
  it('should render icon-only homepage link and centered desktop nav links', () => {
    render(<Header />)

    expect(screen.queryByText('DentAlışveriş')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'DentAlışveriş ana sayfa' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('img', { name: 'DentAlışveriş' })).toBeInTheDocument()
    expect(screen.queryByText('Premium dental marketplace')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Ana navigasyon' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kategoriler' })).toHaveAttribute('href', '/kategoriler')
    expect(screen.getByRole('link', { name: 'Markalar' })).toHaveAttribute('href', '/markalar')
    expect(screen.getByRole('link', { name: 'Tüm Ürünler' })).toHaveAttribute('href', '/urunler')
    expect(screen.getByRole('link', { name: 'Kampanyalar' })).toHaveAttribute('href', '/kampanyalar')
  })

  it('should mark the active desktop nav item with aria-current', () => {
    pathnameMock.mockReturnValue('/markalar/yerli-uretim')

    render(<Header />)

    expect(screen.getByRole('link', { name: 'Markalar' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Kategoriler' })).not.toHaveAttribute('aria-current')
  })

  it('should route search queries to /urunler?q=', () => {
    render(<Header />)

    const searchInput = screen.getAllByPlaceholderText('Ürün, marka veya kategori ara...')[0]
    fireEvent.change(searchInput, { target: { value: 'anestezi' } })
    fireEvent.submit(searchInput.closest('form')!)

    expect(pushMock).toHaveBeenCalledWith('/urunler?q=anestezi')
  })
})

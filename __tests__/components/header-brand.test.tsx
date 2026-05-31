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

    expect(screen.getByRole('link', { name: 'DENTALMARKETTR' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('img', { name: 'DentAlışveriş' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kategoriler' })).toHaveAttribute('href', '/kategoriler')
    expect(screen.getByRole('link', { name: 'Anasayfa' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Tüm Ürünler' })).toHaveAttribute('href', '/urunler')
    expect(screen.getByRole('link', { name: 'Kampanyalar' })).toHaveAttribute('href', '/kampanyalar')
    expect(screen.getByRole('link', { name: 'İletişim' })).toHaveAttribute('href', '/iletisim')
    expect(screen.getByRole('link', { name: 'Kargo Takibi' })).toHaveAttribute('href', '/kargo-takibi')
  })

  it('should mark the active desktop nav item with aria-current', () => {
    pathnameMock.mockReturnValue('/kampanyalar/yerli-uretim')

    render(<Header />)

    expect(screen.getByRole('link', { name: 'Kampanyalar' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Kategoriler' })).not.toHaveAttribute('aria-current')
  })

  it('should route search queries to /urunler?q=', () => {
    render(<Header />)

    const searchInput = screen.getByPlaceholderText('Ürün ara...')
    fireEvent.change(searchInput, { target: { value: 'anestezi' } })
    fireEvent.submit(searchInput.closest('form')!)

    expect(pushMock).toHaveBeenCalledWith('/urunler?q=anestezi')
  })
})

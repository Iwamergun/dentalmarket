import React from 'react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
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
  beforeEach(() => {
    pushMock.mockClear()
    pathnameMock.mockReturnValue('/')
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
  })

  it('should render icon-only homepage link and centered desktop nav links', () => {
    const { container } = render(<Header />)

    expect(container.querySelector('a[aria-label="Dentalışveriş ana sayfa"]')).toHaveAttribute('href', '/')
    expect(container.querySelector('[role="img"][aria-label="DentAlışveriş"]')).toBeInTheDocument()
    expect(container.querySelector('nav a[href="/kategoriler"]')).toBeInTheDocument()
    expect(container.querySelector('nav a[href="/"]')).toBeInTheDocument()
    expect(container.querySelector('nav a[href="/urunler"]')).toBeInTheDocument()
    expect(container.querySelector('nav a[href="/kampanyalar"]')).toBeInTheDocument()
    expect(container.querySelector('nav a[href="/iletisim"]')).toBeInTheDocument()
    expect(container.querySelector('nav a[href="/kargo-takibi"]')).toBeInTheDocument()
  })

  it('should mark the active desktop nav item with aria-current', () => {
    pathnameMock.mockReturnValue('/kampanyalar/yerli-uretim')

    const { container } = render(<Header />)

    expect(container.querySelector('nav a[href="/kampanyalar"]')).toHaveAttribute('aria-current', 'page')
    expect(container.querySelector('nav a[href="/kategoriler"]')).not.toHaveAttribute('aria-current')
  })

  it('should route search queries to /urunler?q=', () => {
    render(<Header />)

    const searchInput = screen.getByPlaceholderText('Ürün ara...')
    fireEvent.change(searchInput, { target: { value: 'anestezi' } })
    fireEvent.submit(searchInput.closest('form')!)

    expect(pushMock).toHaveBeenCalledWith('/urunler?q=anestezi')
  })

  it('should show contextual mega menu links for each desktop item', () => {
    const { container } = render(<Header />)

    fireEvent.mouseEnter(container.querySelector('nav a[href="/kategoriler"]')!)

    expect(container.querySelector('a[href="/kategoriler"]')).toBeInTheDocument()
    expect(container.querySelector('a[href="/urunler?sort=name-asc"]')).toBeInTheDocument()
    expect(container.querySelector('a[href="/urunler?inStock=true"]')).toBeInTheDocument()
  })

  it('keeps desktop mega menu open long enough to move pointer into dropdown', () => {
    vi.useFakeTimers()
    const { container } = render(<Header />)
    const desktopArea = container.querySelector('nav')?.parentElement

    fireEvent.mouseEnter(container.querySelector('nav a[href="/kategoriler"]')!)
    const dropdownLink = container.querySelector('a[href="/urunler?sort=name-asc"]')
    expect(dropdownLink).toBeInTheDocument()

    fireEvent.mouseLeave(desktopArea!)
    expect(container.querySelector('a[href="/urunler?sort=name-asc"]')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(90)
    })
    expect(container.querySelector('a[href="/urunler?sort=name-asc"]')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(container.querySelector('a[href="/urunler?sort=name-asc"]')).not.toBeInTheDocument()

    vi.useRealTimers()
  })

  it('should hide the search card on scroll and reopen it from the search icon', () => {
    render(<Header />)

    expect(screen.getByPlaceholderText('Ürün, marka veya kategori ara...')).toBeInTheDocument()

    Object.defineProperty(window, 'scrollY', { value: 80, writable: true, configurable: true })
    fireEvent.scroll(window)

    expect(screen.queryByPlaceholderText('Ürün, marka veya kategori ara...')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Arama panelini aç' }))

    expect(screen.getAllByPlaceholderText('Ürün, marka veya kategori ara...').length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: 'Arama panelini aç' }))

    expect(screen.queryByPlaceholderText('Ürün, marka veya kategori ara...')).not.toBeInTheDocument()
  })
})

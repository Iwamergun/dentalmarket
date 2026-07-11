import React from 'react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/header'

const pushMock = vi.fn()
const pathnameMock = vi.fn(() => '/')
const authState = {
  user: null as Record<string, unknown> | null,
  loading: false,
}

vi.mock('@/components/cart/CartButton', () => ({
  CartButton: () => <button type="button">Cart</button>,
}))

vi.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => authState,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
        }),
      }),
    }),
  }),
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
    authState.user = null
    authState.loading = false
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

  it('renders a neutral fallback avatar and keeps the profile menu accessible', () => {
    authState.user = {
      id: 'user-1',
      email: 'member@example.com',
      user_metadata: {
        full_name: 'Member User',
      },
    }

    const { container } = render(<Header />)

    const profileButton = screen.getByRole('button', { name: 'Hesap menüsünü aç' })
    expect(container.querySelector('svg.lucide-circle-user-round')).toBeInTheDocument()

    fireEvent.click(profileButton)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Profilim' })).toBeInTheDocument()
  })

  it('uses the user avatar image when one is available', () => {
    authState.user = {
      id: 'user-2',
      email: 'avatar@example.com',
      user_metadata: {
        full_name: 'Avatar User',
        avatar_url: 'https://example.com/avatar.png',
      },
    }

    render(<Header />)

    expect(screen.getByAltText('Avatar User profil fotoğrafı')).toHaveAttribute('src', 'https://example.com/avatar.png')
  })
})

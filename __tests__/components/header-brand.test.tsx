import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/header'

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

describe('Header brand area', () => {
  it('should render icon + exact DentAlışveriş wordmark without subtitle', () => {
    render(<Header />)

    expect(screen.getByText('DentAlışveriş')).toBeInTheDocument()
    expect(screen.getByAltText('DentAlışveriş')).toHaveAttribute('src', '/brand/dentalisveris-icon.svg')
    expect(screen.queryByText('Premium dental marketplace')).not.toBeInTheDocument()
  })
})

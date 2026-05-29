import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { CategoryBar } from '@/components/layout/category-bar'

const orderMock = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: orderMock,
        }),
      }),
    }),
  }),
}))

describe('CategoryBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
  })

  it('shows a polite message when category fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    orderMock.mockResolvedValueOnce({ data: null, error: { message: 'RLS denied' } })

    render(<CategoryBar />)

    await waitFor(() => {
      expect(screen.getByText('Kategoriler şu anda yüklenemiyor.')).toBeInTheDocument()
    })
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('renders root categories when fetch succeeds', async () => {
    orderMock.mockResolvedValueOnce({
      data: [
        { id: 'root-1', name: 'El Aletleri', slug: 'el-aletleri', parent_id: null },
        { id: 'child-1', name: 'Pensler', slug: 'pensler', parent_id: 'root-1' },
      ],
      error: null,
    })

    render(<CategoryBar />)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'El Aletleri' })).toHaveAttribute('href', '/kategoriler/el-aletleri')
    })
    expect(screen.getByRole('link', { name: 'Tüm Kategorileri Gör' })).toHaveAttribute('href', '/kategoriler')
  })
})

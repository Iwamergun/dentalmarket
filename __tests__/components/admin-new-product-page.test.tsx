import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
}))

vi.mock('@/components/admin/ImageUploader', () => ({
  default: () => <div>ImageUploader</div>,
}))

import { createBrowserClient } from '@supabase/ssr'
import AdminNewProductPage from '@/app/admin/products/new/page'

function createQueryResult(data: unknown) {
  return {
    eq() {
      return this
    },
    order() {
      return Promise.resolve({ data })
    },
    or() {
      return this
    },
    limit() {
      return Promise.resolve({ data })
    },
  }
}

describe('AdminNewProductPage', () => {
  it('eski alanları korurken ürün adını doğrudan girilebilir göstermeli', async () => {
    ;(createBrowserClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'categories') {
          return { select: vi.fn(() => createQueryResult([{ id: 'cat-1', name: 'Endodonti' }])) }
        }

        if (table === 'brands') {
          return { select: vi.fn(() => createQueryResult([{ id: 'brand-1', name: 'Marka A' }])) }
        }

        return { select: vi.fn(() => createQueryResult([])) }
      }),
      auth: {
        getUser: vi.fn(),
      },
    })

    render(<AdminNewProductPage />)
    await screen.findByText('Marka seçin')

    expect(screen.getByRole('textbox', { name: /Ürün Adı/ })).toBeInTheDocument()
    expect(screen.getByText('Slug')).toBeInTheDocument()
    expect(screen.getByText(/SKU/)).toBeInTheDocument()
    expect(screen.getByText('Barkod')).toBeInTheDocument()
    expect(screen.getByText('Kategori')).toBeInTheDocument()
    expect(screen.getByText('Marka')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Yeni kategori adı')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Yeni marka adı')).toBeInTheDocument()
    expect(screen.getByText('Kısa Açıklama')).toBeInTheDocument()
    expect(screen.getByText('Açıklama')).toBeInTheDocument()
    expect(screen.queryByText('Fiyat & Stok')).not.toBeInTheDocument()
    expect(screen.queryByText('Stok Miktarı')).not.toBeInTheDocument()
    expect(screen.getByText('ImageUploader')).toBeInTheDocument()
  })
})

import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

describe('NotFound page', () => {
  it('"404" metni render edilmeli', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('yeni marka logosunu göstermeli', () => {
    render(<NotFound />)
    expect(screen.getByAltText('DentAlışveriş')).toHaveAttribute('src', '/brand/dentalisveris-logo.svg')
  })

  it('"Sayfa Bulunamadı" başlığı render edilmeli', () => {
    render(<NotFound />)
    expect(screen.getByText('Sayfa Bulunamadı')).toBeInTheDocument()
  })

  it('"Ana Sayfaya Dön" linki href="/" olmalı', () => {
    render(<NotFound />)
    const link = screen.getByText('Ana Sayfaya Dön').closest('a')
    expect(link).toHaveAttribute('href', '/')
  })

  it('"Ürünlere Göz At" linki href="/urunler" olmalı', () => {
    render(<NotFound />)
    const link = screen.getByText('Ürünlere Göz At').closest('a')
    expect(link).toHaveAttribute('href', '/urunler')
  })
})

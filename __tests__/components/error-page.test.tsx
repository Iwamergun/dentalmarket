import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorPage from '@/app/error'

describe('Error page', () => {
  const mockError = Object.assign(new globalThis.Error('Test error message'), { digest: undefined }) as Error & { digest?: string }
  const mockReset = vi.fn()

  it('"Bir Hata Oluştu" başlığı render edilmeli', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument()
  })

  it('yeni marka logosunu göstermeli', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByText('DentAlışveriş')).toBeInTheDocument()
  })

  it('"Tekrar Dene" butonu görünmeli', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByText('Tekrar Dene')).toBeInTheDocument()
  })

  it('"Ana Sayfaya Dön" linki href="/" olmalı', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const link = screen.getByText('Ana Sayfaya Dön').closest('a')
    expect(link).toHaveAttribute('href', '/')
  })

  it('"Tekrar Dene" butonuna tıklayınca reset() çağrılmalı', async () => {
    const user = userEvent.setup()
    render(<ErrorPage error={mockError} reset={mockReset} />)
    await user.click(screen.getByText('Tekrar Dene'))
    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('development\'ta error.message gösterilmeli', () => {
    vi.stubEnv('NODE_ENV', 'development')
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    vi.unstubAllEnvs()
  })
})

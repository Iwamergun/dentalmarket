import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Loading from '@/app/loading'

describe('Loading page', () => {
  it('"Yükleniyor" metni render edilmeli', () => {
    render(<Loading />)
    expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument()
  })

  it('yeni marka logosu render edilmeli', () => {
    render(<Loading />)
    expect(screen.getByText('DentAlışveriş')).toBeInTheDocument()
  })

  it('spinner (animate-spin class\'lı element) mevcut olmalı', () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('component düzgün render edilmeli', () => {
    const { container } = render(<Loading />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

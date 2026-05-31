import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ImageUploader from '@/components/admin/ImageUploader'

describe('ImageUploader', () => {
  it('uses default label when custom label is not provided', () => {
    render(<ImageUploader onUpload={() => {}} />)
    expect(screen.getByText('Ürün Görseli')).toBeInTheDocument()
  })

  it('renders custom label for campaign uploads', () => {
    render(<ImageUploader onUpload={() => {}} label="Kampanya Görseli" />)
    expect(screen.getByText('Kampanya Görseli')).toBeInTheDocument()
  })
})

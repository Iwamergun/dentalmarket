import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroSection } from '@/components/home/hero-section'

describe('HeroSection campaign placement', () => {
  it('renders fallback campaign cards inside the hero when campaign data is empty', () => {
    render(<HeroSection campaigns={[]} />)

    expect(screen.getByText('Öne çıkan kampanyalar')).toBeInTheDocument()
    // Slide 0 is visible (active), slides 1+ are aria-hidden — use hidden:true to query all
    expect(screen.getByRole('link', { name: /Yaz Fırsatları/i })).toHaveAttribute('href', '/kampanyalar')
    expect(screen.getByRole('link', { name: /Yeni Üye Avantajı/i, hidden: true })).toHaveAttribute('href', '/kampanyalar')
    expect(screen.getByText('Demo kartlar')).toBeInTheDocument()
  })

  it('renders real campaign cards in the hero area when campaigns are provided', () => {
    render(
      <HeroSection
        campaigns={[
          {
            id: '1',
            title: 'İmplant Seti',
            description: 'Seçili implant ürünlerinde özel fiyatlar.',
            image_path: '/campaigns/implant.jpg',
            href: '/kampanyalar/implant-seti',
            sort_order: 0,
            is_active: true,
            starts_at: null,
            ends_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]}
      />
    )

    expect(screen.getByRole('link', { name: /İmplant Seti/i })).toHaveAttribute('href', '/kampanyalar/implant-seti')
    expect(screen.queryByText('Demo kartlar')).not.toBeInTheDocument()
  })
})

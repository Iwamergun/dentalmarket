import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroSection } from '@/components/home/hero-section'

describe('HeroSection campaign placement', () => {
  it('renders fallback campaign cards inside the hero when campaign data is empty', () => {
    render(<HeroSection campaigns={[]} />)

    expect(screen.getByText('Öne çıkan kampanyalar')).toBeInTheDocument()
    // Slide 0 is visible (active), slides 1+ are aria-hidden — use hidden:true to query all
    expect(screen.getByRole('link', { name: /Kliniğinizi Yenileyin/i })).toHaveAttribute('href', '/kategoriler')
    expect(screen.getByRole('link', { name: /Haftanın Fırsatları/i, hidden: true })).toHaveAttribute('href', '/kampanyalar')
    expect(screen.getByText('Hazır vitrin')).toBeInTheDocument()
    expect(screen.getByText('Öne çıkan seçki')).toBeInTheDocument()
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
    expect(screen.queryByText('Hazır vitrin')).not.toBeInTheDocument()
  })
})

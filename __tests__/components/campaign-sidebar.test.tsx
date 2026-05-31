import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CampaignSidebar } from '@/components/home/campaign-sidebar'

describe('CampaignSidebar', () => {
  it('renders fallback cards when campaigns are empty', () => {
    render(<CampaignSidebar campaigns={[]} />)
    expect(screen.getByRole('link', { name: 'Yaz Fırsatları' })).toHaveAttribute('href', '/kampanyalar')
    expect(screen.getByRole('link', { name: 'Yeni Üye Avantajı' })).toHaveAttribute('href', '/kampanyalar')
  })

  it('renders campaign image cards with links', () => {
    render(
      <CampaignSidebar
        campaigns={[
          {
            id: '1',
            title: 'Kampanya 1',
            description: null,
            image_path: 'products/a.jpg',
            href: '/kampanyalar/a',
            sort_order: 0,
            is_active: true,
            starts_at: null,
            ends_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Kampanya 2',
            description: null,
            image_path: 'products/b.jpg',
            href: '/kampanyalar/b',
            sort_order: 1,
            is_active: true,
            starts_at: null,
            ends_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]}
      />
    )

    expect(screen.getByRole('link', { name: 'Kampanya 1' })).toHaveAttribute('href', '/kampanyalar/a')
    expect(screen.getByRole('link', { name: 'Kampanya 2' })).toHaveAttribute('href', '/kampanyalar/b')
  })
})

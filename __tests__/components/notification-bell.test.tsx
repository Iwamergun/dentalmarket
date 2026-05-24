import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationBell from '@/components/notifications/NotificationBell'

describe('NotificationBell', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('okunmamış bildirimi gösterip okundu olarak işaretleyebilmeli', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          notifications: [
            {
              id: 'notification-1',
              title: 'Yeni sipariş aldınız',
              body: 'Sipariş #DA-1 • Örnek Klinik',
              actionUrl: '/supplier/siparisler?orderNumber=DA-1',
              isRead: false,
              createdAt: '2026-05-24T01:00:00.000Z',
            },
          ],
          unreadCount: 1,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

    const user = userEvent.setup()
    render(<NotificationBell />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/notifications?limit=10', expect.any(Object))
    })

    expect(screen.getByText('1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Bildirimleri aç' }))
    expect(await screen.findByText('Yeni sipariş aldınız')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Okundu' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/notifications/notification-1/read', expect.objectContaining({
        method: 'POST',
      }))
    })

    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })
})

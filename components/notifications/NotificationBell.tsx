'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Bell, Loader2 } from 'lucide-react'

type NotificationItem = {
  id: string
  title: string
  body: string
  actionUrl: string | null
  isRead: boolean
  createdAt: string
}

function formatNotificationDate(value: string) {
  return new Date(value).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const bellRef = useRef<HTMLDivElement>(null)

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/notifications?limit=10', {
        credentials: 'include',
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Bildirimler yüklenemedi')
      }

      const payload = await response.json() as {
        notifications: NotificationItem[]
        unreadCount: number
      }

      setNotifications(payload.notifications)
      setUnreadCount(payload.unreadCount)
    } catch (error) {
      console.error('Notification bell error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()

    const timer = window.setInterval(() => {
      loadNotifications()
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [loadNotifications])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    setMarkingId(notificationId)
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Bildirim güncellenemedi')
      }

      setNotifications((prev) => prev.map((notification) => (
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )))
      setUnreadCount((prev) => Math.max(prev - 1, 0))
    } catch (error) {
      console.error('Notification read error:', error)
    } finally {
      setMarkingId(null)
    }
  }, [])

  return (
    <div className="relative" ref={bellRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        aria-label="Bildirimleri aç"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-96 rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Bildirimler</p>
              <p className="text-xs text-gray-500">{unreadCount} okunmamış bildirim</p>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Bildirimler yükleniyor...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                Şu anda bildiriminiz bulunmuyor.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-100 px-4 py-3 last:border-b-0 ${
                    notification.isRead ? 'bg-white' : 'bg-blue-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{notification.body}</p>
                      <p className="mt-2 text-xs text-gray-400">
                        {formatNotificationDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        disabled={markingId === notification.id}
                        className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        {markingId === notification.id ? '...' : 'Okundu'}
                      </button>
                    )}
                  </div>

                  {notification.actionUrl && (
                    <Link
                      href={notification.actionUrl}
                      onClick={() => {
                        if (!notification.isRead) {
                          void markAsRead(notification.id)
                        }
                        setIsOpen(false)
                      }}
                      className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Siparişe git
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

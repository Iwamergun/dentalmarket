// Alias for legacy push notification service worker path.
// Keep this file in sync with /sw.js.

self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'Bildirim', body: event.data.text() }
  }

  const { title = 'Dent Alışveriş', body = '', url = '/', icon = '/favicon.svg' } = payload

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge: '/favicon.svg',
      data: { url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
'use client'

/**
 * PushNotificationProvider
 *
 * Client-only component — imported via dynamic() with ssr:false so it never
 * runs during server-side rendering. This keeps the SSR/SEO output clean.
 *
 * What it does:
 *  1. Registers the service worker (/sw.js) on mount.
 *  2. Asks for push notification permission once per browser/session when the
 *     user has been on the page for > 5 seconds.
 *  3. POSTs the PushSubscription to /api/push/subscribe so the server can
 *     target this browser with notifications.
 *
 * VAPID public key must be set in NEXT_PUBLIC_VAPID_PUBLIC_KEY.
 * If the env var is missing, the component exits silently (feature disabled).
 */

import { useEffect } from 'react'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

async function subscribe() {
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!vapidKey) return // Feature disabled — no VAPID key configured

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready

    // Check existing subscription first
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
    }

    // Send subscription to backend (fire-and-forget; errors are non-fatal)
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: subscription.toJSON() }),
    })
  } catch {
    // Non-fatal — push notifications are optional
  }
}

export default function PushNotificationProvider() {
  useEffect(() => {
    // Delay request slightly so it doesn't interfere with page load
    const timer = setTimeout(() => {
      subscribe()
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // Renders nothing — purely side-effect
  return null
}

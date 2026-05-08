import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/push/subscribe
 * Body: { subscription: PushSubscription }
 * Saves or updates the push subscription for the authenticated user.
 *
 * DELETE /api/push/subscribe
 * Body: { endpoint: string }
 * Removes the push subscription.
 */

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limiter = rateLimit(`push-subscribe:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla istek gönderdiniz.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const { subscription } = body as { subscription: PushSubscriptionJSON }

    if (!subscription?.endpoint) {
      return NextResponse.json({ success: false, error: 'Geçersiz abonelik verisi' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('push_subscriptions')
      .upsert(
        {
          endpoint: subscription.endpoint,
          user_id: user?.id ?? null,
          subscription: subscription,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      )

    if (error) {
      // Gracefully handle missing table — feature is optional
      console.warn('push_subscriptions upsert error (table may not exist yet):', error.message)
      return NextResponse.json({ success: true, warning: 'Push aboneliği kaydedilemedi; tablo henüz oluşturulmamış olabilir.' })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('Push subscribe POST error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { endpoint } = body as { endpoint: string }

    if (!endpoint) {
      return NextResponse.json({ success: false, error: 'Endpoint gerekli' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint)

    if (error) {
      console.warn('push_subscriptions delete error:', error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('Push subscribe DELETE error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

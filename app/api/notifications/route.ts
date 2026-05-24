import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') || '10'), 20)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: notifications, error } = await (adminSupabase as any)
      .from('user_notifications')
      .select('id, title, body, action_url, is_read, created_at, metadata')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: unreadCount } = await (adminSupabase as any)
      .from('user_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    return NextResponse.json({
      notifications: (notifications ?? []).map((notification: {
        id: string
        title: string
        body: string
        action_url: string | null
        is_read: boolean
        created_at: string
        metadata: Record<string, unknown> | null
      }) => ({
        id: notification.id,
        title: notification.title,
        body: notification.body,
        actionUrl: notification.action_url,
        isRead: notification.is_read,
        createdAt: notification.created_at,
        metadata: notification.metadata ?? {},
      })),
      unreadCount: unreadCount ?? 0,
    })
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json(
      { error: 'Bildirimler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

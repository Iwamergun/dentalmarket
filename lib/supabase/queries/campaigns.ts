import { createClient } from '@/lib/supabase/server'

export interface Campaign {
  id: string
  title: string
  description: string | null
  image_path: string
  href: string
  sort_order: number
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
}

function isCampaignDateWindowValid(campaign: Campaign, now = new Date()) {
  const startsAtValid = !campaign.starts_at || new Date(campaign.starts_at) <= now
  const endsAtValid = !campaign.ends_at || new Date(campaign.ends_at) >= now
  return startsAtValid && endsAtValid
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = (supabase as any)
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching active campaigns:', error.message)
    return []
  }

  const campaigns = ((data ?? []) as Campaign[])
  return campaigns.filter((campaign) => isCampaignDateWindowValid(campaign))
}

export async function getAllCampaignsForAdmin(): Promise<Campaign[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('campaigns')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching campaigns for admin:', error.message)
    return []
  }

  return (data ?? []) as Campaign[]
}

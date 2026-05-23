import { hasAdminAccess } from '@/lib/auth/access'

export function canUploadMedia(
  profileRole: string | null | undefined,
  metadata: Record<string, unknown> | null | undefined
) {
  if (profileRole === 'supplier') {
    return true
  }

  return hasAdminAccess(profileRole, metadata)
}

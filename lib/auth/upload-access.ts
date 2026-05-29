import { hasAdminAccess, hasSupplierPanelAccess } from '@/lib/auth/access'

export function canUploadMedia(
  profileRole: string | null | undefined,
  metadata?: Record<string, unknown> | null | undefined
) {
  // Tedarikçi ve depo rolündeki kullanıcılar medya yükleyebilir
  if (hasSupplierPanelAccess(profileRole, metadata)) {
    return true
  }

  return hasAdminAccess(profileRole, metadata)
}

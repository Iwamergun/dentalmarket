const ADMIN_TOKENS = new Set([
  'admin',
  'depo',
  'super_admin',
  'superadmin',
  'admin:access',
  'admin_access',
  'dashboard:admin',
  'manage:admin',
])
const METADATA_TOKEN_FIELDS = ['role', 'roles', 'permission', 'permissions', 'name', 'code', 'key', 'slug', 'claims', 'authorities']

function normalizeToken(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

function hasAdminToken(value: unknown): boolean {
  if (typeof value === 'string') {
    return ADMIN_TOKENS.has(normalizeToken(value))
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasAdminToken(item))
  }

  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>

  for (const [key, entry] of Object.entries(record)) {
    if ((entry === true || entry === 'true') && ADMIN_TOKENS.has(normalizeToken(key))) {
      return true
    }
  }

  return METADATA_TOKEN_FIELDS.some((field) => hasAdminToken(record[field]))
}

/**
 * @param profileRole - Güvenilir kaynak: profiles.role (sunucu tarafından kontrol edilir).
 * @param _metadata - @deprecated Artık kullanılmıyor. Admin yetkisi yalnızca
 *   `profileRole` üzerinden belirlenir. Bu parametre geriye dönük uyumluluk
 *   için imzada korunmuştur; herhangi bir etki yapmaz.
 */
export function hasAdminAccess(
  profileRole: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _metadata?: Record<string, unknown> | null | undefined
) {
  return hasAdminToken(profileRole)
}

const CATALOG_ADMIN_ROLES = new Set(['admin', 'super_admin', 'superadmin'])
const SUPPLIER_PANEL_TOKENS = new Set([
  'depo',
])

function hasSupplierPanelToken(value: unknown): boolean {
  if (typeof value === 'string') {
    return SUPPLIER_PANEL_TOKENS.has(normalizeToken(value))
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasSupplierPanelToken(item))
  }

  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>

  for (const [key, entry] of Object.entries(record)) {
    if ((entry === true || entry === 'true') && SUPPLIER_PANEL_TOKENS.has(normalizeToken(key))) {
      return true
    }
  }

  return METADATA_TOKEN_FIELDS.some((field) => hasSupplierPanelToken(record[field]))
}

export function hasCatalogAdminAccess(profileRole: string | null | undefined) {
  if (!profileRole) {
    return false
  }

  return CATALOG_ADMIN_ROLES.has(normalizeToken(profileRole))
}

/**
 * @param profileRole - Güvenilir kaynak: profiles.role (sunucu tarafından kontrol edilir).
 * @param _metadata - @deprecated Artık kullanılmıyor. Tedarikçi paneli yetkisi yalnızca
 *   `profileRole` üzerinden belirlenir. Bu parametre geriye dönük uyumluluk
 *   için imzada korunmuştur; herhangi bir etki yapmaz.
 */
export function hasSupplierPanelAccess(
  profileRole: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _metadata?: Record<string, unknown> | null | undefined
) {
  return hasSupplierPanelToken(profileRole)
}

export function getAuthMetadata(user: {
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
} | null | undefined) {
  if (!user) {
    return undefined
  }

  // Yalnızca app_metadata döndürülür; user_metadata kullanıcı tarafından
  // değiştirilebildiğinden yetki kararlarında güvenilmez kaynak sayılır.
  return user.app_metadata ?? {}
}
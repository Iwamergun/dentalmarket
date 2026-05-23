const ADMIN_TOKENS = new Set([
  'admin',
  'super_admin',
  'superadmin',
  'admin:access',
  'admin_access',
  'dashboard:admin',
  'manage:admin',
  'depo',
  'depot',
  'warehouse',
  'inventory',
  'inventory:access',
  'inventory_access',
  'stock',
  'stock:access',
  'stock_access',
  'inventory_manager',
  'stock_manager',
  'warehouse_manager',
  'depo_yonetimi',
  'depo_yoneticisi',
  'depot_manager',
])

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

  return ['role', 'roles', 'permission', 'permissions', 'name', 'code', 'key', 'slug', 'claims', 'authorities']
    .some((field) => hasAdminToken(record[field]))
}

export function hasAdminAccess(
  profileRole: string | null | undefined,
  metadata: Record<string, unknown> | null | undefined
) {
  if (hasAdminToken(profileRole)) {
    return true
  }

  return hasAdminToken(metadata)
}

const CATALOG_ADMIN_ROLES = new Set(['admin', 'super_admin', 'superadmin'])
const SUPPLIER_PANEL_TOKENS = new Set([
  'supplier',
  'depo',
  'depot',
  'warehouse',
  'inventory',
  'stock',
  'inventory_manager',
  'stock_manager',
  'warehouse_manager',
  'depo_yonetimi',
  'depo_yoneticisi',
  'depot_manager',
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

  return ['role', 'roles', 'permission', 'permissions', 'name', 'code', 'key', 'slug', 'claims', 'authorities']
    .some((field) => hasSupplierPanelToken(record[field]))
}

export function hasCatalogAdminAccess(profileRole: string | null | undefined) {
  if (!profileRole) {
    return false
  }

  return CATALOG_ADMIN_ROLES.has(normalizeToken(profileRole))
}

export function hasSupplierPanelAccess(
  profileRole: string | null | undefined,
  metadata: Record<string, unknown> | null | undefined
) {
  return hasSupplierPanelToken(profileRole) || hasSupplierPanelToken(metadata)
}

export function getAuthMetadata(user: {
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
} | null | undefined) {
  if (!user) {
    return undefined
  }

  return {
    ...(user.app_metadata ?? {}),
    ...(user.user_metadata ?? {}),
  }
}
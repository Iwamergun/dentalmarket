export const SELF_REGISTER_ROLES = ['clinic', 'depo'] as const

export type SelfRegisterRole = (typeof SELF_REGISTER_ROLES)[number]

export type RegisterProfileInput = {
  role: string
  company_name: string
  tax_number?: string | null
  phone?: string | null
  store_description?: string | null
}

export function normalizeSelfRegisterRole(role: string): SelfRegisterRole {
  if (role === 'clinic' || role === 'depo') {
    return role
  }

  throw new Error('Geçersiz rol seçimi')
}

export function isValidTurkishTaxNumber(value: string) {
  return /^[0-9]{10}$/.test(value)
}

export function buildProfileDefaults(role: SelfRegisterRole) {
  return {
    is_active: role === 'clinic',
  }
}

export function slugifyStoreName(companyName: string) {
  const slug = companyName
    .trim()
    .toLowerCase()
    .replace(/i̇/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || 'depo'
}

export function generateUniqueStoreSlug(baseSlug: string, existingSlugs: string[]) {
  const normalizedBase = slugifyStoreName(baseSlug)
  const used = new Set(existingSlugs.filter(Boolean))

  if (!used.has(normalizedBase)) {
    return normalizedBase
  }

  let suffix = 2
  while (used.has(`${normalizedBase}-${suffix}`)) {
    suffix += 1
  }

  return `${normalizedBase}-${suffix}`
}

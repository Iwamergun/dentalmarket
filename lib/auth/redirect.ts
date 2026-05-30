const DEFAULT_REDIRECT_PATH = '/'

export function sanitizeRedirectPath(redirectPath: string | null | undefined) {
  if (!redirectPath) {
    return null
  }

  const normalized = redirectPath.trim()
  if (!normalized.startsWith('/') || normalized.startsWith('//')) {
    return null
  }

  return normalized
}

export function resolvePostLoginRedirect(redirectPath: string | null | undefined, fallback = '/profil') {
  return sanitizeRedirectPath(redirectPath) ?? fallback
}

export function buildLoginRedirectPath(pathname: string, search = '') {
  const safePath = sanitizeRedirectPath(pathname)
  if (!safePath) {
    return DEFAULT_REDIRECT_PATH
  }

  const safeSearch = search.startsWith('?') ? search : ''
  return `${safePath}${safeSearch}`
}

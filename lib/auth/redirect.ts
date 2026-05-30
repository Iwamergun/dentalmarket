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

function sanitizeRedirectSearch(search: string) {
  if (!search.startsWith('?')) {
    return ''
  }

  const params = new URLSearchParams(search.slice(1))
  const sanitized = new URLSearchParams()

  for (const [key, value] of params.entries()) {
    const safeKey = /^[a-zA-Z0-9_]+$/.test(key)
    const safeValue = !/[\u0000-\u001F]/.test(value)
    if (safeKey && safeValue) {
      sanitized.set(key, value)
    }
  }

  const normalized = sanitized.toString()
  return normalized ? `?${normalized}` : ''
}

export function buildLoginRedirectPath(pathname: string, search = '') {
  const safePath = sanitizeRedirectPath(pathname)
  if (!safePath) {
    return DEFAULT_REDIRECT_PATH
  }

  const safeSearch = sanitizeRedirectSearch(search)
  return `${safePath}${safeSearch}`
}

export function buildLoginUrlWithRedirect(pathname: string, search = '') {
  const redirectPath = buildLoginRedirectPath(pathname, search)
  return `/giris?redirect=${encodeURIComponent(redirectPath)}`
}

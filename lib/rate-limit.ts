// Basit in-memory rate limiter
// Production'da Redis tabanlı bir çözüme geçilmeli

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Her 60 saniyede bir temizlik yap (memory leak önleme)
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60_000)

interface RateLimitConfig {
  /** İzin verilen maximum istek sayısı */
  limit: number
  /** Zaman penceresi (milisaniye) */
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, windowMs: 60_000 }
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    // Yeni pencere başlat
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return { success: true, remaining: config.limit - 1, resetTime: now + config.windowMs }
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return { success: true, remaining: config.limit - entry.count, resetTime: entry.resetTime }
}

/**
 * Request'ten IP adresini al
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return 'unknown'
}

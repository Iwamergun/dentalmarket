import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { hasAdminAccess, hasCatalogAdminAccess, hasSupplierPanelAccess } from '@/lib/auth/access'
import { buildLoginRedirectPath } from '@/lib/auth/redirect'

const ADMIN_PRODUCT_EDIT_PATH = /^\/admin\/products\/[^/]+\/edit$/
const SUPPLIER_OFFER_EDIT_PATH = /^\/supplier\/urunler\/[^/]+\/duzenle$/
const DEPO_PUBLISH_PATHS = new Set([
  '/admin/products/new',
  '/supplier/urunler/yeni',
])
const ADMIN_ONLY_PATH_PREFIXES = ['/admin/categories', '/admin/brands', '/admin/customers', '/admin/reports', '/admin/settings', '/admin/orders', '/admin/suppliers']

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/giris'
  url.searchParams.set('redirect', buildLoginRedirectPath(request.nextUrl.pathname, request.nextUrl.search))
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Admin route kontrolü
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return redirectToLogin(request)
    }

    // Profile kontrolü
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (!hasAdminAccess(profile?.role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    const isRestrictedCatalogProductPath = ADMIN_PRODUCT_EDIT_PATH.test(pathname)
    const isPlatformAdminOnlyPath = ADMIN_ONLY_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    if ((isRestrictedCatalogProductPath || isPlatformAdminOnlyPath) && !hasCatalogAdminAccess(profile?.role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    const isAdminDepoPublishPath = DEPO_PUBLISH_PATHS.has(pathname) || ADMIN_PRODUCT_EDIT_PATH.test(pathname)
    if (isAdminDepoPublishPath && hasSupplierPanelAccess(profile?.role) && profile?.is_active === false) {
      const url = request.nextUrl.clone()
      url.pathname = '/supplier/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Supplier route kontrolü
  if (pathname.startsWith('/supplier')) {
    if (!user) {
      return redirectToLogin(request)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (!hasSupplierPanelAccess(profile?.role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    const isSupplierDepoPublishPath = DEPO_PUBLISH_PATHS.has(pathname) || SUPPLIER_OFFER_EDIT_PATH.test(pathname)
    if (isSupplierDepoPublishPath && profile?.is_active === false) {
      const url = request.nextUrl.clone()
      url.pathname = '/supplier/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Dashboard route kontrolü
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return redirectToLogin(request)
    }
  }

  // Checkout route kontrolü
  if (pathname === '/odeme' || pathname.startsWith('/odeme/')) {
    if (!user) {
      return redirectToLogin(request)
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/supplier/:path*', '/dashboard/:path*', '/odeme/:path*'],
}

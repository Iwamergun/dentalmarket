import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './lib/supabase';

// Paths to skip middleware processing
const SKIP_PATHS = [
  '/_next',
  '/api',
  '/robots.txt',
  '/favicon.ico',
];

const SKIP_PATH_PATTERNS = [
  /^\/sitemap/,
];

function shouldSkipPath(pathname: string): boolean {
  // Check exact matches
  if (SKIP_PATHS.some(path => pathname.startsWith(path))) {
    return true;
  }
  
  // Check pattern matches
  if (SKIP_PATH_PATTERNS.some(pattern => pattern.test(pathname))) {
    return true;
  }
  
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip middleware for specific paths
  if (shouldSkipPath(pathname)) {
    return NextResponse.next();
  }

  try {
    // Query the seo_redirects table
    const { data, error } = await supabase
      .from('seo_redirects')
      .select('*')
      .eq('from_path', pathname)
      .eq('is_active', true)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .order('priority', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      // No redirect found or database error - continue normally
      if (error.code === 'PGRST116') {
        // No rows returned - this is expected behavior
        return NextResponse.next();
      }
      console.error('Supabase query error:', error);
      return NextResponse.next();
    }

    if (data) {
      const statusCode = data.status_code;

      // Handle 410 Gone status
      if (statusCode === 410) {
        return new NextResponse(null, {
          status: 410,
          statusText: 'Gone',
        });
      }

      // Handle 301 and 302 redirects
      if (statusCode === 301 || statusCode === 302) {
        const toPath = data.to_path;
        
        // Construct the redirect URL with preserved querystring
        const redirectUrl = new URL(toPath, request.url);
        
        // Preserve original querystring
        if (search) {
          redirectUrl.search = search;
        }

        return NextResponse.redirect(redirectUrl, statusCode);
      }
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }

  // Continue to the requested page if no redirect applies
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

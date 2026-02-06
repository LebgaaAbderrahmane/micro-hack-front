import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Handle i18n routing first
  const handleI18n = createMiddleware(routing);
  let response = handleI18n(request);

  // 2. Setup Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          
          // Re-generate response to include fresh cookies if needed
          // Some versions of next-intl middleware might benefit from this
          response = handleI18n(request);
          
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Get user session (refreshes if needed)
  const { data: { user } } = await supabase.auth.getUser();

  // Define public paths (login, register, and auth callback)
  const isAuthPage = /\/(login|register|auth\/callback)/.test(pathname);

  // 4. Protection Logic
  if (!user && !isAuthPage) {
    // Redirect unauthenticated users to login
    const locale = pathname.split('/')[1];
    const finalLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
    
    const redirectUrl = new URL(`/${finalLocale}/login`, request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // Crucial: Copy cookies and headers from the base modified response (e.g. session tokens, locale headers)
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    response.headers.forEach((value, key) => {
      redirectResponse.headers.set(key, value);
    });
    
    return redirectResponse;
  }

  if (user) {
    // Prevent authenticated users from accessing login/register
    if (isAuthPage && !pathname.includes('auth/callback')) {
      const locale = pathname.split('/')[1];
      const finalLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
      const redirectUrl = new URL(`/${finalLocale}`, request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options);
      });
      response.headers.forEach((value, key) => {
        redirectResponse.headers.set(key, value);
      });
      
      return redirectResponse;
    }

    // Role-based protection
    const isAdminRoute = /\/(terminals|users)/.test(pathname);
    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "ADMIN") {
        console.warn(`[Middleware] Non-admin user ${user.id} attempted to access ${pathname}`);
        const locale = pathname.split('/')[1];
        const finalLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
        const redirectUrl = new URL(`/${finalLocale}`, request.url);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        
        response.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options);
        });
        response.headers.forEach((value, key) => {
          redirectResponse.headers.set(key, value);
        });
        
        return redirectResponse;
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

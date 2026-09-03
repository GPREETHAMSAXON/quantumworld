import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return url.match(/https:\/\/([^.]+)\./)?.[1] ?? '';
}

function injectTokenFromHeader(request: NextRequest): void {
  const token = request.headers.get('x-sb-token');
  if (!token) return;
  const hasCookie = request.cookies.getAll().some((c) => c.name.includes('auth-token'));
  if (hasCookie) return;
  request.cookies.set(`sb-${getProjectRef()}-auth-token`, token);
}

const ROLE_ROUTES: Record<string, string> = {
  admin: '/portal/admin',
  intern: '/portal/intern',
  mentor: '/portal/mentor',
};

export async function middleware(request: NextRequest) {
  injectTokenFromHeader(request);
  let supabaseResponse = NextResponse.next({ request });

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
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Portal routes protection
  if (pathname.startsWith('/portal')) {
    // Allow login and forgot-password pages without auth
    if (
      pathname === '/portal/login' ||
      pathname === '/portal/forgot-password'
    ) {
      // If already logged in, redirect to their dashboard
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', user.id)
          .single();

        if (profile && profile.status === 'active') {
          const dashboardPath = ROLE_ROUTES[profile.role as string];
          if (dashboardPath) {
            const url = request.nextUrl.clone();
            url.pathname = dashboardPath;
            return NextResponse.redirect(url);
          }
        }
      }
      return supabaseResponse;
    }

    // All other /portal/* routes require authentication
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/portal/login';
      return NextResponse.redirect(url);
    }

    // Fetch user profile to check role and status
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    // If no profile or account disabled/invited, redirect to login
    if (!profile || profile.status !== 'active') {
      const url = request.nextUrl.clone();
      url.pathname = '/portal/login';
      return NextResponse.redirect(url);
    }

    const userRole = profile.role as string;
    const allowedPath = ROLE_ROUTES[userRole];

    // Enforce role-based routing: redirect to own dashboard if accessing wrong area
    if (allowedPath && !pathname.startsWith(allowedPath)) {
      const url = request.nextUrl.clone();
      url.pathname = allowedPath;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

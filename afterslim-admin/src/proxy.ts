import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy: protect all admin routes.
 * - Browser routes: redirect to /login if no auth session.
 * - API routes: accept either a valid session (cookie) OR x-api-key (for external callers like agents/crons).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Public paths that skip all checks ─────────────────────
  if (
    pathname === "/login" ||
    pathname === "/api/health" ||
    pathname.startsWith("/api/checkout") ||
    pathname.startsWith("/api/leads") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    // Handle CORS preflight for public API routes
    if (request.method === "OPTIONS") {
      const origin = request.headers.get("origin") ?? "";
      const allowed = [
        "https://afterslim.com",
        "https://www.afterslim.com",
        "http://localhost:3000",
      ].includes(origin)
        ? origin
        : "https://afterslim.com";

      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": allowed,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
    return NextResponse.next();
  }

  // ── Build Supabase client to check session ────────────────
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── API routes: accept session OR API key ─────────────────
  if (pathname.startsWith("/api/")) {
    if (user) return response;

    const apiKey = request.headers.get("x-api-key");
    const expectedKey = process.env.API_SECRET;
    if (expectedKey && apiKey === expectedKey) return response;

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Browser routes: require auth session ──────────────────
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from /login
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and images.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

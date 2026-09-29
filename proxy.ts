import { NextResponse, type NextRequest } from "next/server";

/**
 * Strict Content Security Policy for the admin panel.
 *
 * Admin pages are rendered per request anyway (they read the session
 * cookie), so they can use a fresh nonce: only scripts Next.js stamps with it
 * will run, which shuts out injected inline scripts entirely. Style
 * attributes still need 'unsafe-inline' (the chart and bar widths use them).
 *
 * This is defence in depth only. Authentication is enforced by
 * requireAdmin() in every admin page and server action, not here.
 */
export function proxy(request: NextRequest) {
  // Server actions already compare Origin with Host and the session cookie is
  // SameSite=Lax; refusing browser-flagged cross-site POSTs is a third layer.
  if (
    request.method === "POST" &&
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return new NextResponse("Cross-site request refused.", { status: 403 });
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/admin/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  detectLocaleFromPath,
  SITE_LANG_HEADER,
  stripEnPrefix,
} from "@/lib/locale-path";
import { SITE_LANG_COOKIE, type SiteLang } from "@/lib/site-lang";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale: SiteLang = detectLocaleFromPath(pathname);
  const internalPath = stripEnPrefix(pathname);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(SITE_LANG_HEADER, locale);

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = internalPath;

  const response = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });

  response.cookies.set(SITE_LANG_COOKIE, locale, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

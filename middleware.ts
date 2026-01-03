import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { fallbackLng, languages, cookieName } from "./app/i18n/settings";

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and static files
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};

export function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName)) lng = req.cookies.get(cookieName)?.value;
  if (!lng) {
    const negotiatorHeaders: Record<string, string> = {};
    req.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
    const translations = new Negotiator({
      headers: negotiatorHeaders,
    }).languages(languages);
    lng = match(translations, languages, fallbackLng);
  }

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") || "");
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userAgent } from "next/server";
import { Lang, UserRole } from "need4deed-sdk";
import {
  decodeJwtPayload,
  getPathLanguage,
  getPathLanguagePrefix,
  isValidLanguage,
  localizedPath,
} from "./utils/helpers";

const DEFAULT_LOCALE = Lang.EN;
const DEFAULT_DEVICE_TYPE = "desktop";
const DEVICE_HEADER_NAME = "x-device-type";
const LANG_COOKIE = "preferred-lang";
const REFRESH = "refresh";

const authorizedRoutes = {
  AGENT: { regex: /^(?:\/[a-z]{2})?\/dashboard\/agents\/([0-9]+)$/, redirect: "/dashboard/agents" },
  NEW_OPPORTUNITIES: { regex: /^(?:\/[a-z]{2})?\/forms\/opportunity(?:\/|$)/ },
  DASHBOARD: { regex: /^(?:\/[a-z]{2})?\/dashboard(?:\/|$)/ },
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const currentLocale = getPathLanguage(pathname);

  const token = request.cookies.get(REFRESH)?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    const dashboardMatch = pathname.match(authorizedRoutes.DASHBOARD.regex);
    const newOppMatch = pathname.match(authorizedRoutes.NEW_OPPORTUNITIES.regex);
    if (dashboardMatch) {
      url.search = "";
      url.pathname = localizedPath(currentLocale, "/login");
      return NextResponse.redirect(url);
    }
    if (newOppMatch) {
      url.pathname = localizedPath(currentLocale, "/login");
      return NextResponse.redirect(url);
    }
  }

  if (token) {
    const userObject = decodeJwtPayload(token);
    const isAuthorized =
      (userObject && userObject.role === UserRole.ADMIN) || (userObject && userObject.role === UserRole.COORDINATOR);

    // Allowlist: any other role or an undecodable token is sent away.
    const adminRegex = /^(?:\/[a-z]{2})?\/dashboard\/admin(?:\/|$)/;
    if (!isAuthorized && adminRegex.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = localizedPath(currentLocale, "/dashboard");
      return NextResponse.redirect(url);
    }

    const volunteerRestrictedRegex = /^(?:\/[a-z]{2})?\/dashboard\/(volunteers|agents|posts|calendar)(?:\/|$)/;
    if (userObject?.role === UserRole.VOLUNTEER && volunteerRestrictedRegex.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = localizedPath(currentLocale, "/dashboard");
      return NextResponse.redirect(url);
    }

    const match = pathname.match(authorizedRoutes.AGENT.regex);
    if (match) {
      if (isAuthorized || userObject?.role === UserRole.AGENT) {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = localizedPath(currentLocale, authorizedRoutes.AGENT.redirect);
      const redirectResponse = NextResponse.redirect(url);
      return redirectResponse;
    }

    const agentRestrictedRegex = /^(?:\/[a-z]{2})?\/dashboard\/calendar(?:\/|$)/;
    if (userObject?.role === UserRole.AGENT && agentRestrictedRegex.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = localizedPath(currentLocale, "/dashboard");
      return NextResponse.redirect(url);
    }
  }

  if (!currentLocale) {
    const cookieLang = request.cookies.get(LANG_COOKIE)?.value;
    const preferredLocale = isValidLanguage(cookieLang) ? cookieLang : DEFAULT_LOCALE;
    const unsupportedPrefix = getPathLanguagePrefix(pathname);
    const unprefixedPath = unsupportedPrefix ? pathname.slice(unsupportedPrefix.length + 1) : pathname;
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(preferredLocale, unprefixedPath);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.cookies.set(LANG_COOKIE, currentLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const { device } = userAgent({ headers: request.headers });

  const deviceType = device.type || DEFAULT_DEVICE_TYPE;

  response.headers.set(DEVICE_HEADER_NAME, deviceType);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|api|health|.well-known|robots\\.txt|sitemap\\.xml|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.ico).*)",
  ],
};

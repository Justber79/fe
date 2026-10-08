import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userAgent } from "next/server";
import { supportedLangs } from "./config/constants";
import { Lang, UserRole } from "need4deed-sdk";
import { decodeJwtPayload } from "./utils";

const DEFAULT_LOCALE = Lang.EN;
const DEFAULT_DEVICE_TYPE = "desktop";
const DEVICE_HEADER_NAME = "x-device-type";
const LANG_COOKIE = "preferred-lang";
const REFRESH = "refresh";

const authorizedRoutes: Record<string, { regex: RegExp; redirect: string }> = {
  AGENT: { regex: /^(?:\/[a-z]{2})?\/dashboard\/agents\/([0-9]+)$/, redirect: "/dashboard/agents" },
  NEW_OPPORTUNITIES: { regex: /^(?:\/[a-z]{2})?\/forms\/opportunity(?:\/|$)/, redirect: "/login" },
  DASHBOARD: { regex: /^(?:\/[a-z]{2})?\/dashboard(?:\/|$)/, redirect: "/login" },
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(REFRESH)?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    const dashboardMatch = pathname.match(authorizedRoutes.DASHBOARD.regex);
    const newOppMatch = pathname.match(authorizedRoutes.NEW_OPPORTUNITIES.regex);
    if (dashboardMatch) {
      url.search = "";
      url.pathname = authorizedRoutes.DASHBOARD.redirect;
      return NextResponse.redirect(url);
    }
    if (newOppMatch) {
      url.pathname = authorizedRoutes.DASHBOARD.redirect;
      return NextResponse.redirect(url);
    }
  }

  if (token) {
    const userObject = decodeJwtPayload(token);
    const isAuthorized =
      (userObject && userObject.role === UserRole.ADMIN) || (userObject && userObject.role === UserRole.COORDINATOR);

    const volunteerRestrictedRegex = /^(?:\/[a-z]{2})?\/dashboard\/(volunteers|agents|posts|calendar)(?:\/|$)/;
    if (userObject?.role === UserRole.VOLUNTEER && volunteerRestrictedRegex.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    const match = pathname.match(authorizedRoutes.AGENT.regex);
    if (match) {
      if (isAuthorized || userObject.role === UserRole.AGENT) {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = authorizedRoutes.AGENT.redirect;
      const redirectResponse = NextResponse.redirect(url);
      return redirectResponse;
    }

    const calendarRegex = /^(?:\/[a-z]{2})?\/dashboard\/calendar(?:\/|$)/;
    if (userObject?.role === UserRole.AGENT && calendarRegex.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  const localePrefixRegex = /^\/([a-z]{2})(?:\/|$)/i;
  const match = pathname.match(localePrefixRegex);

  const currentLocale = match ? match[1] : null;

  const cookieLang = request.cookies.get(LANG_COOKIE)?.value;
  const preferredLocale = cookieLang && supportedLangs.includes(cookieLang) ? cookieLang : DEFAULT_LOCALE;

  let redirectNeeded = false;
  let newPathname = pathname;

  if (currentLocale) {
    const isSupportedLocale = supportedLangs.includes(currentLocale);

    if (!isSupportedLocale) {
      const pathWithoutLocalePrefix = pathname.substring(currentLocale.length + 1);

      newPathname = `/${preferredLocale}${pathWithoutLocalePrefix}`;
      redirectNeeded = true;
    }
  } else {
    newPathname = `/${preferredLocale}${pathname}`;
    redirectNeeded = true;
  }

  if (redirectNeeded) {
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    const redirectResponse = NextResponse.redirect(url);
    return redirectResponse;
  }

  const response = NextResponse.next();

  if (currentLocale && supportedLangs.includes(currentLocale)) {
    response.cookies.set(LANG_COOKIE, currentLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  const { device } = userAgent({ headers: request.headers });

  const deviceType = device.type || DEFAULT_DEVICE_TYPE;

  response.headers.set(DEVICE_HEADER_NAME, deviceType);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|api|health|.well-known|robots\\.txt|sitemap\\.xml|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico).*)",
  ],
};

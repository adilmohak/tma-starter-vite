import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isDevelopment } from "./lib/constants";

function isEthiopianUser(request: NextRequest): boolean {
  // Check multiple sources for country information
  const country =
    (request as any).geo?.country || // Next.js geo API (typing may not be updated yet)
    request.headers.get("X-Vercel-IP-Country") || // Vercel header
    request.headers.get("CF-IPCountry"); // Cloudflare header

  return country === "ET"; // Ethiopia's ISO country code
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isDevelopment || process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const isEthiopian = isEthiopianUser(request);

  // If Ethiopian user tries to access blocked page, redirect to home

  if (pathname === "/blocked" && isEthiopian) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Allow access to the blocked page for non-Ethiopian users
  if (pathname === "/blocked") {
    return NextResponse.next();
  }

  // Check if user is from Ethiopia
  if (!isEthiopian) {
    // Redirect to blocked page for non-Ethiopian users
    const blockedUrl = new URL("/blocked", request.url);
    return NextResponse.redirect(blockedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

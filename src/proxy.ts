// proxy.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const {pathname} = req.nextUrl;

  // 1) Przekierowania kolekcji "coming soon"
  if (pathname === "/womens" || pathname.startsWith("/womens/")) {
    return NextResponse.redirect(new URL("/coming-soon?c=womens", req.url));
  }

  if (pathname === "/kids" || pathname.startsWith("/kids/")) {
    return NextResponse.redirect(new URL("/coming-soon?c=kids", req.url));
  }
  // ochrona admina
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (token.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/admin/:path*", "/womens/:path*", "/kids/:path*"],
};
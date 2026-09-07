import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // GitHub's redirect parameters are untrusted and unnecessary for this static
  // guide. Remove them before rendering any page or loading website analytics.
  if (request.nextUrl.search) {
    const destination = request.nextUrl.clone();
    destination.search = "";
    const response = NextResponse.redirect(destination, 303);
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
  return NextResponse.next();
}

export const config = { matcher: "/setup" };

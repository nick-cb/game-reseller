import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (
    !request.headers.get("next-url") &&
    request.nextUrl.searchParams.get("type")
  ) {
    console.log("RUN");
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname, request.url),
    );
  }
}

export const config = {
  matcher: ["/login", "/signup"],
};

// import bodyParser from "body-parser";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
  if (
    (request.nextUrl.href.includes("login") ||
      request.nextUrl.href.includes("signup")) &&
    !request.headers.get("next-url") &&
    request.nextUrl.searchParams.get("type")
  ) {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname, request.url),
    );
  }
  // if (request.nextUrl.href.includes("webhook")) {
  //   const parser = bodyParser.raw({ type: "application/json" });
  //   return parser(request, response, NextResponse.next);
  // }
}

export const config = {
  matcher: ["/login", "/signup"],
};

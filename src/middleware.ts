// import bodyParser from "body-parser";
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  if (
    (request.nextUrl.href.includes('login') || request.nextUrl.href.includes('signup')) &&
    !request.headers.get('next-url') &&
    request.nextUrl.searchParams.get('type')
  ) {
    return NextResponse.redirect(new URL(request.nextUrl.pathname, request.url));
  }
}

export const config = {
  matcher: ['/login', '/signup'],
};

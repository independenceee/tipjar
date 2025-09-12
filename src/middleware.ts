import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const isAuthenticated = !!token;
    const url = request.nextUrl.clone();

    if (!isAuthenticated) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: "/dashboard/:path*",
};

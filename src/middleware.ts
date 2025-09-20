/**
 * @description Next.js Middleware function.
 *
 * - This middleware will run for all routes matching `/dashboard/:path*`.
 * - You can use it to handle authentication, logging, headers, etc.
 * - Currently, it is an empty function (no logic implemented).
 */
export async function middleware() {}

/**
 * @description Configuration for middleware matcher.
 *
 * - `matcher` defines which routes this middleware applies to.
 * - In this case, it applies to all routes under `/dashboard/*`.
 */
export const config = {
    matcher: "/dashboard/:path*",
};

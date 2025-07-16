import {clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher} from '@clerk/nextjs/server';
import {NextResponse, NextRequest} from "next/server";
import {get} from '@vercel/edge-config';

const isPrivateRoute = createRouteMatcher([
    '/upload(.*)',
    '/admin(.*)',
    '/teachers(.*)',
    '/olympiads(.*)',
    '/revision(.*)',
    '/ucas(.*)',
    '/',
])


export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request: NextRequest) => {
    // Check maintenance mode first
    const isInMaintenanceMode = await get('maintenance');
    if (isInMaintenanceMode && process.env.ONLINE === 'true') {
        request.nextUrl.pathname = `/maintenance`;
        return NextResponse.rewrite(request.nextUrl);
    }

    // Then handle authentication
    if (isPrivateRoute(request)) {
        await auth.protect();
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)', '/api/:path*'],
};
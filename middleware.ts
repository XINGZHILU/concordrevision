import {clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher} from '@clerk/nextjs/server';
import {NextResponse, NextRequest} from "next/server";
import {get} from '@vercel/edge-config';

const isPrivateRoute = createRouteMatcher([
    '/upload(.*)',
    '/admin(.*)',
])

const isPublicRoute = createRouteMatcher([
    '/api/webhooks/clerk(.*)',
])


export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request: NextRequest) => {
    // Check maintenance mode first
    const isInMaintenanceMode = await get('maintenance');
    if (isInMaintenanceMode && process.env.ONLINE === 'true') {
        request.nextUrl.pathname = `/maintenance`;
        return NextResponse.rewrite(request.nextUrl);
    }

    if (isPublicRoute(request)) {
        return NextResponse.next();
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
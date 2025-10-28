// File: src/types/next.d.ts

import { ParsedUrlQuery } from 'querystring';
import { NextPage } from 'next';

// Define a type for the user object in the session
export interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    teacher?: boolean;
}

// Extend the Next.js types to allow params in page props
declare module 'next' {
    export type PageProps = {
        params?: ParsedUrlQuery | { [key: string]: string | string[] | undefined };
    };

    export type NextPageWithParams<P = object, IP = P> = NextPage<P & PageProps, IP>;
}
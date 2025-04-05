// File: src/types/next.d.ts

import { ParsedUrlQuery } from 'querystring';
import { NextPage } from 'next';

// Extend the Next.js types to allow params in page props
declare module 'next' {
    export type PageProps = {
        params?: ParsedUrlQuery | { id: string };
        [key: string]: any;
    };

    export type NextPageWithParams<P = {}, IP = P> = NextPage<P & PageProps, IP>;
}
// custom.d.ts
// This file helps TypeScript understand the react-pdf module

declare module 'react-pdf' {
    import { ComponentType, ReactElement, ReactNode } from 'react';

    export interface DocumentProps {
        file: string | File | ArrayBuffer;
        onLoadSuccess?: OnDocumentLoadSuccess;
        onLoadError?: (error: Error) => void;
        loading?: ReactNode;
        className?: string;
        children?: ReactNode;
    }

    export interface PageProps {
        pageNumber: number;
        scale?: number;
        width?: number;
        height?: number;
        loading?: ReactNode;
        renderTextLayer?: boolean;
        renderAnnotationLayer?: boolean;
        className?: string;
    }

    export interface PDFDocumentProxy {
        numPages: number;
        fingerprint?: string;
        [key: string]: any;
    }

    export type OnDocumentLoadSuccess = (pdf: PDFDocumentProxy) => void;

    export const Document: ComponentType<DocumentProps>;
    export const Page: ComponentType<PageProps>;
    export const pdfjs: {
        GlobalWorkerOptions: {
            workerSrc: string;
        };
        version: string;
    };
}
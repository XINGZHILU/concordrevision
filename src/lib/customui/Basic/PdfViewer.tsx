'use client';

import '@/lib/polyfill';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

interface PdfContextType {
    numPages: number | null;
    setNumPages: (numPages: number | null) => void;
    pageNumber: number;
    setPageNumber: (pageNumber: number) => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export const PdfProvider = ({ children }: { children: ReactNode }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    return (
        <PdfContext.Provider value={{ numPages, setNumPages, pageNumber, setPageNumber }}>
            {children}
        </PdfContext.Provider>
    );
};

export const usePdf = () => {
    const context = useContext(PdfContext);
    if (context === undefined) {
        throw new Error('usePdf must be used within a PdfProvider');
    }
    return context;
};

interface PdfViewerProps {
  url: string;
}

const Viewer = ({ url }: PdfViewerProps) => {
    const { setNumPages, pageNumber } = usePdf();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    function onDocumentLoadError(error: Error) {
        console.error('Failed to load PDF document:', error.message);
    }

    return (
        <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
        >
            <Page pageNumber={pageNumber} />
        </Document>
    );
};

const Pagination = () => {
    const { pageNumber, numPages, setPageNumber } = usePdf();

    if (!numPages) {
        return null;
    }

    return (
        <nav className="flex justify-between items-center mt-4 max-w-2xl mx-auto">
            <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
            >
                Previous
            </button>
            <span>
                Page {pageNumber} of {numPages}
            </span>
            <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
            >
                Next
            </button>
        </nav>
    );
}

export default function PdfViewer({ url }: PdfViewerProps) {
    return (
        <PdfProvider>
            <div className="min-h-screen h-full w-full p-4">
                <div className="flex justify-center">
                    <Viewer url={url} />
                </div>
                <Pagination />
            </div>
        </PdfProvider>
    );
}

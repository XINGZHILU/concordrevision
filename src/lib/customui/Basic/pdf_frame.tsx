'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Ensure this is only included on the client side
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js`;
}

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js`;

interface PDFViewerProps {
    url: string;
    title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
        setIsLoading(false);
        console.log(`PDF "${title}" loaded successfully with ${numPages} pages`);
    }

    function onDocumentLoadError(error: Error) {
        setIsLoading(false);
        console.error(`Error loading PDF "${title}":`, error);
    }

    function changePage(offset: number) {
        if (!numPages) return;
        setPageNumber(prevPageNumber => {
            const newPageNumber = prevPageNumber + offset;
            return Math.max(1, Math.min(numPages, newPageNumber));
        });
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <div className="pdf-viewer" style={{ width: '100%' }}>
            <div className="pdf-controls" style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    style={{ marginRight: '10px', padding: '5px 10px' }}
                >
                    Previous
                </button>
                <span>
          Page {pageNumber} of {numPages || '--'}
        </span>
                <button
                    onClick={nextPage}
                    disabled={numPages === null || pageNumber >= numPages}
                    style={{ marginLeft: '10px', padding: '5px 10px' }}
                >
                    Next
                </button>
            </div>

            <div className="pdf-container" style={{ textAlign: 'center' }}>
                {isLoading && <div>Loading PDF...</div>}
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<div>Loading PDF...</div>}
                    noData={<div>No PDF file specified</div>}
                    error={<div>An error occurred!</div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        width={window.innerWidth > 800 ? 800 : window.innerWidth - 40}
                        error={<div>Error loading page</div>}
                    />
                </Document>
            </div>
        </div>
    );
};

export default PDFViewer;
'use client';

// components/PDFViewer.tsx
import React, {useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
// In your actual project, you'll need to configure this to work with Next.js
// This is typically done in a _app.tsx file or similar
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export default function PDFViewer({pdfUrl, title}: {
    pdfUrl: string,
    title: string
}) {
    const width = 800;
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    function onDocumentLoadSuccess({numPages}: { numPages: number }): void {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(error: Error): void {
        console.error('Error while loading PDF:', error);
        setError('Failed to load PDF document. Please try again later.');
        setLoading(false);
    }

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => {
            const newPageNumber = prevPageNumber + offset;
            return numPages ? Math.min(Math.max(1, newPageNumber), numPages) : 1;
        });
    };

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    return (
        <div className="pdf-viewer">
            <div className="pdf-viewer-controls">
                <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    className="pdf-control-button"
                >
                    Previous
                </button>
                {numPages && (
                    <span className="pdf-page-indicator">
            Page {pageNumber} of {numPages}
          </span>
                )}
                <button
                    onClick={nextPage}
                    disabled={numPages !== null && pageNumber >= numPages}
                    className="pdf-control-button"
                >
                    Next
                </button>
            </div>

            <div className="pdf-document-container">
                {loading && <div className="pdf-loading">Loading PDF...</div>}
                {error && <div className="pdf-error">{error}</div>}
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<div className="pdf-loading">Loading PDF...</div>}
                    error={<div className="pdf-error">Failed to load PDF. Please try again.</div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        width={width}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                    />
                </Document>
            </div>

            <style jsx>{`
                .pdf-viewer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    font-family: sans-serif;
                }

                .pdf-viewer-controls {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    width: 100%;
                    max-width: ${width}px;
                    justify-content: space-between;
                }

                .pdf-control-button {
                    padding: 8px 16px;
                    background-color: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .pdf-control-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }

                .pdf-page-indicator {
                    font-size: 14px;
                }

                .pdf-document-container {
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    padding: 20px;
                    background-color: #f8f8f8;
                    min-height: 500px;
                    display: flex;
                    justify-content: center;
                    position: relative;
                }

                .pdf-loading, .pdf-error {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .pdf-error {
                    color: #e53e3e;
                }
            `}</style>
        </div>
    );
};
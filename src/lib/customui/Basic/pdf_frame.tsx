// src/components/GraphicsPDFViewer.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';

interface GraphicsPDFViewerProps {
    url: string;
    title: string;
}

// This helper loads PDF.js from CDN for maximum compatibility
const loadPDFjs = async () => {
    if (typeof window === 'undefined') return null;

    // Only load PDF.js if not already loaded
    if (window.pdfjsLib) return window.pdfjsLib;

    try {
        // Load PDF.js library from CDN
        const pdfjsScript = document.createElement('script');
        pdfjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
        pdfjsScript.integrity = 'sha512-Y/RMvJcGMpOU5bI/1wJKAoRCGhy74xQIxT0/CbNnXZc1yCu9W/QfIZOpS2CFvhFnvr3GhwHQkjV3nNkuZUVWKw==';
        pdfjsScript.crossOrigin = 'anonymous';
        pdfjsScript.referrerPolicy = 'no-referrer';

        // Create a promise that resolves when the script loads
        const scriptLoaded = new Promise((resolve, reject) => {
            pdfjsScript.onload = resolve;
            pdfjsScript.onerror = reject;
        });

        // Add the script to the document
        document.head.appendChild(pdfjsScript);

        // Wait for the script to load
        await scriptLoaded;

        // Set worker source for PDF.js
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

        return window.pdfjsLib;
    } catch (error) {
        console.error('Failed to load PDF.js:', error);
        return null;
    }
};

// Add type definition for PDF.js on window object
declare global {
    interface Window {
        pdfjsLib: any;
    }
}

const GraphicsPDFViewer: React.FC<GraphicsPDFViewerProps> = ({ url, title }) => {
    const [pdfDoc, setPdfDoc] = useState<any | null>(null);
    const [pageNum, setPageNum] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingLib, setLoadingLib] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scale, setScale] = useState(1.5);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load PDF.js library
    useEffect(() => {
        const initPDFjs = async () => {
            try {
                setLoadingLib(true);
                await loadPDFjs();
                setLoadingLib(false);
            } catch (err) {
                console.error('Failed to load PDF.js library:', err);
                setError('Failed to load PDF renderer');
                setLoadingLib(false);
            }
        };

        initPDFjs();
    }, []);

    // Load the PDF document once PDF.js is loaded
    useEffect(() => {
        if (loadingLib || !window.pdfjsLib || !url) return;

        const loadPdf = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch the PDF
                let dataBuffer: ArrayBuffer;

                if (url.startsWith('blob:')) {
                    // Handle blob URLs
                    const response = await fetch(url);
                    dataBuffer = await response.arrayBuffer();
                } else {
                    // Handle regular URLs
                    const response = await fetch(url);
                    dataBuffer = await response.arrayBuffer();
                }

                // Load the PDF document
                const loadingTask = window.pdfjsLib.getDocument({ data: dataBuffer });
                const pdf = await loadingTask.promise;

                setPdfDoc(pdf);
                setPageCount(pdf.numPages);
                setPageNum(1);
                setLoading(false);
            } catch (err: any) {
                console.error('Error loading PDF:', err);
                setError(err.message || 'Failed to load PDF');
                setLoading(false);
            }
        };

        loadPdf();
    }, [url, loadingLib]);

    // Render the current page
    useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return;

        const renderPage = async () => {
            try {
                // Get the page
                const page = await pdfDoc.getPage(pageNum);

                // Get the canvas element
                const canvas = canvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext('2d');
                if (!context) return;

                // Calculate the viewport to fit the container width
                let viewport = page.getViewport({ scale: 1.0 });

                // Adjust scale to fit container width with some padding
                if (containerRef.current) {
                    const containerWidth = containerRef.current.clientWidth - 40; // 20px padding on each side
                    const calculatedScale = containerWidth / viewport.width;
                    setScale(calculatedScale);
                    viewport = page.getViewport({ scale: calculatedScale });
                }

                // Set canvas dimensions to match viewport
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render the page
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                await page.render(renderContext).promise;
            } catch (err: any) {
                console.error('Error rendering page:', err);
                setError(`Error rendering page ${pageNum}: ${err.message || 'Unknown error'}`);
            }
        };

        renderPage();
    }, [pdfDoc, pageNum, containerRef.current?.clientWidth]);

    // Navigation functions
    const prevPage = () => setPageNum(prev => Math.max(prev - 1, 1));
    const nextPage = () => setPageNum(prev => Math.min(prev + 1, pageCount));

    // Handle download
    const handleDownload = () => {
        // Create an anchor and trigger a download
        const a = document.createElement('a');
        a.href = url;
        a.download = title || 'document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="graphics-pdf-viewer" style={{ width: '100%' }}>
            <div style={{
                padding: '10px',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                backgroundColor: '#f8f9fa'
            }}>
                <h2 style={{ margin: '0', fontSize: '1.2rem' }}>{title}</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={prevPage}
                        disabled={pageNum <= 1 || loading || loadingLib}
                        style={{
                            padding: '5px 10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: pageNum <= 1 ? '#f0f0f0' : '#fff',
                            cursor: pageNum <= 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Previous
                    </button>

                    <span>
            Page {pageNum} of {pageCount || '?'}
          </span>

                    <button
                        onClick={nextPage}
                        disabled={pageNum >= pageCount || loading || loadingLib}
                        style={{
                            padding: '5px 10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: pageNum >= pageCount ? '#f0f0f0' : '#fff',
                            cursor: pageNum >= pageCount ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Next
                    </button>

                    <button
                        onClick={handleDownload}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        Download
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    minHeight: '500px',
                    backgroundColor: '#f1f1f1'
                }}
            >
                {(loading || loadingLib) && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 10
                    }}>
                        {loadingLib ? 'Loading PDF renderer...' : 'Loading PDF...'}
                    </div>
                )}

                {error && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        backgroundColor: 'rgba(255,200,200,0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 10
                    }}>
                        <p>Error: {error}</p>
                        <button
                            onClick={handleDownload}
                            style={{
                                display: 'inline-block',
                                margin: '10px 0',
                                padding: '5px 10px',
                                backgroundColor: '#0070f3',
                                color: 'white',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Download PDF
                        </button>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    style={{
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        display: loading || loadingLib ? 'none' : 'block',
                        backgroundColor: 'white'
                    }}
                />
            </div>
        </div>
    );
};

export default GraphicsPDFViewer;
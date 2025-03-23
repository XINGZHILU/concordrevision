'use client';

// src/components/CanvasPDFViewer.tsx
import React, { useState, useEffect, useRef } from 'react';

// Import PDF.js with proper worker configuration
// Note: We dynamically import to avoid SSR issues
const loadPdfJs = async () => {
    // Only import in browser environment
    if (typeof window === 'undefined') return null;

    try {
        // Dynamic import of pdfjs
        const pdfjs = await import('pdfjs-dist');

        // Configure the worker
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

        return pdfjs;
    } catch (error) {
        console.error('Error loading PDF.js:', error);
        return null;
    }
};

interface CanvasPDFViewerProps {
    url: string;
    title: string;
}

const CanvasPDFViewer: React.FC<CanvasPDFViewerProps> = ({ url, title }) => {
    const [pdfDoc, setPdfDoc] = useState<any | null>(null);
    const [pageNum, setPageNum] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scale, setScale] = useState(1.5);
    const [pdfjs, setPdfjs] = useState<any | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load PDF.js library
    useEffect(() => {
        const initPdfJs = async () => {
            try {
                const pdfJsModule = await loadPdfJs();
                setPdfjs(pdfJsModule);
            } catch (err) {
                console.error("Failed to load PDF.js:", err);
                setError("Failed to load PDF renderer. Please try a different browser.");
                setLoading(false);
            }
        };

        initPdfJs();
    }, []);

    // Load the PDF document once pdfjs is available
    useEffect(() => {
        if (!pdfjs || !url) return;

        setLoading(true);
        setError(null);
        setPdfDoc(null);

        const loadPdf = async () => {
            try {
                // Use arrayBuffer for better compatibility
                const arrayBuffer = await fetchPdfAsArrayBuffer(url);
                const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;

                setPdfDoc(pdf);
                setPageCount(pdf.numPages);
                setPageNum(1);
                setLoading(false);
            } catch (err: any) {
                console.error("Error loading PDF:", err);
                setError(err.message || "Failed to load PDF");
                setLoading(false);
            }
        };

        loadPdf();
    }, [pdfjs, url]);

    // Fetch PDF as ArrayBuffer (better for cross-browser compatibility)
    const fetchPdfAsArrayBuffer = async (pdfUrl: string): Promise<ArrayBuffer> => {
        // Handle blob URLs differently
        if (pdfUrl.startsWith('blob:')) {
            try {
                const response = await fetch(pdfUrl);
                return await response.arrayBuffer();
            } catch (err) {
                throw new Error(`Failed to fetch blob URL: ${err}`);
            }
        }

        // Handle normal URLs
        try {
            const response = await fetch(pdfUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.arrayBuffer();
        } catch (err) {
            throw new Error(`Failed to fetch PDF: ${err}`);
        }
    };

    // Render the current page
    useEffect(() => {
        if (!pdfDoc || !canvasRef.current || !pdfjs) return;

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
                console.error("Error rendering page:", err);
                setError(`Error rendering page ${pageNum}: ${err.message || "Unknown error"}`);
            }
        };

        renderPage();
    }, [pdfDoc, pageNum, containerRef.current?.clientWidth, pdfjs]);

    // Add window resize handler to adjust scaling
    useEffect(() => {
        const handleResize = () => {
            // This will trigger the useEffect above to recalculate scaling
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // Force a re-render by updating a state
                setScale(prevScale => {
                    // Just toggle between very close values to force a re-render
                    return prevScale === 1.5 ? 1.501 : 1.5;
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Navigation functions
    const prevPage = () => setPageNum(prev => Math.max(prev - 1, 1));
    const nextPage = () => setPageNum(prev => Math.min(prev + 1, pageCount));

    return (
        <div className="canvas-pdf-viewer" style={{ width: '100%' }}>
            <div style={{
                padding: '10px',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <h2 style={{ margin: '0', fontSize: '1.2rem' }}>{title}</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={prevPage}
                        disabled={pageNum <= 1 || loading}
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
            Page {pageNum} of {pageCount}
          </span>

                    <button
                        onClick={nextPage}
                        disabled={pageNum >= pageCount || loading}
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
                </div>
            </div>

            <div
                ref={containerRef}
                style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    minHeight: '500px'
                }}
            >
                {loading && (
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
                        Loading PDF...
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
                        <a
                            href={url}
                            download={title}
                            style={{
                                display: 'inline-block',
                                margin: '10px 0',
                                padding: '5px 10px',
                                backgroundColor: '#0070f3',
                                color: 'white',
                                borderRadius: '4px',
                                textDecoration: 'none'
                            }}
                        >
                            Download PDF
                        </a>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    style={{
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        display: loading ? 'none' : 'block'
                    }}
                />
            </div>
        </div>
    );
};

export default CanvasPDFViewer;
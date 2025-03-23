"use client"

// components/PDFViewer.tsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs, OnDocumentLoadSuccess, DocumentProps, PDFDocumentProxy } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker path (required for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
}

interface WindowSize {
  width: number;
  height: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });
  
  // Handle window resize for responsive behavior
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Adjust scale based on screen size
  useEffect(() => {
    if (windowSize.width < 768) {
      setScale(windowSize.width / 768);
    } else {
      setScale(1.0);
    }
  }, [windowSize]);
  
  // Handle successful document loading
  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy): void => {
    setNumPages(numPages);
    setLoading(false);
  };
  
  // Handle document loading error
  const onDocumentLoadError = (error: Error): void => {
    setError(`Error loading PDF: ${error.message}`);
    setLoading(false);
  };
  
  // Handle page navigation
  const changePage = (offset: number): void => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(newPageNumber, numPages || 1));
    });
  };
  
  return (
    <div className="pdf-viewer-container">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading PDF...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}
      
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="loading">Loading document...</div>}
        className="pdf-document"
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          width={Math.min(windowSize.width * 0.9, 900)}
          loading={<div className="loading">Loading page...</div>}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="pdf-page"
        />
      </Document>
      
      {!loading && !error && numPages && (
        <div className="controls">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className="control-button"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {pageNumber} of {numPages}
          </span>
          
          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            className="control-button"
          >
            Next
          </button>
          
          <div className="zoom-controls">
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
              className="control-button"
            >
              Zoom Out
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(2.0, prev + 0.1))}
              className="control-button"
            >
              Zoom In
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .pdf-viewer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 1rem;
          min-height: 70vh;
          position: relative;
        }
        
        .pdf-document {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .pdf-page {
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          margin-bottom: 1rem;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 200px;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .controls {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem 0;
          width: 100%;
        }
        
        .page-info {
          margin: 0 0.5rem;
          font-size: 0.9rem;
        }
        
        .control-button {
          padding: 0.4rem 0.8rem;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }
        
        .control-button:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
        
        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .zoom-controls {
          display: flex;
          align-items: center;
          margin-left: 1rem;
        }
        
        .zoom-level {
          margin: 0 0.5rem;
          width: 3rem;
          text-align: center;
          font-size: 0.9rem;
        }
        
        .error-container {
          color: #d32f2f;
          padding: 1rem;
          text-align: center;
          border: 1px solid #ffcdd2;
          background-color: #ffebee;
          border-radius: 4px;
          margin: 1rem 0;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
            gap: 0.8rem;
          }
          
          .zoom-controls {
            margin-left: 0;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;
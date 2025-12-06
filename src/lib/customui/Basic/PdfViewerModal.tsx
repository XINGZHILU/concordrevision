'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut, Loader2, Download } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fileName: string;
  download?: boolean;
}

/**
 * Modal popup for viewing PDFs with react-pdf
 * Allows users to view PDFs without leaving the current page
 */
export default function PdfViewerModal({ isOpen, onClose, pdfUrl, fileName, download }: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens with new PDF
  useEffect(() => {
    if (isOpen) {
      setScale(1.0);
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, pdfUrl]);

  // Generate array of page numbers for rendering all pages
  const pageNumbers = useMemo(() => {
    return Array.from({ length: numPages }, (_, i) => i + 1);
  }, [numPages]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF document');
    setIsLoading(false);
  }, []);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Render modal at document body level to avoid z-index stacking context issues
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-[95vw] h-[95vh] bg-background rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground truncate flex-1">
            {fileName}
          </h2>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-4">
            {/* Page count */}
            <span className="text-sm text-muted-foreground">
              {numPages > 0 ? `${numPages} pages` : '...'}
            </span>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
              <button
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="p-2 hover:bg-muted rounded-md transition-colors border border-border disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={scale >= 3.0}
                className="p-2 hover:bg-muted rounded-md transition-colors border border-border disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Download button - only shown when download prop is true */}
            {download === true && (
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-primary hover:text-primary-foreground rounded-md transition-colors border border-border ml-2"
                aria-label="Download"
                title="Download PDF"
              >
                <Download className="w-5 h-5" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors border border-border ml-2"
              aria-label="Close"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 relative bg-muted/30 overflow-auto">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg text-foreground">Loading PDF...</p>
                <p className="text-sm text-muted-foreground mt-2">Please wait...</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="text-center p-8 max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Failed to Load PDF</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* PDF Document - All pages scrollable */}
          <div className="flex justify-center p-4">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              className="flex flex-col items-center gap-4"
            >
              {pageNumbers.map((pageNum) => (
                <Page
                  key={pageNum}
                  pageNumber={pageNum}
                  scale={scale}
                  className="shadow-lg"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { loadAdobeSDK } from '@/lib/utils/adobeSDK';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fileName: string;
}

/**
 * Modal popup for viewing PDFs with Adobe Embed API
 * Allows users to view PDFs without leaving the current page
 */
export default function PdfViewerModal({ isOpen, onClose, pdfUrl, fileName }: PdfViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerInstanceRef = useRef<any>(null);
  const containerIdRef = useRef(`adobe-dc-view-modal-${Date.now()}`);
  const lastPdfRef = useRef<string>('');
  const mountedRef = useRef(true);

  // Initialize viewer - memoized to prevent recreating the function
  const initializeViewer = useCallback(async () => {
    if (!mountedRef.current || !isOpen) return;

    try {
      // Load Adobe SDK (cached after first load)
      await loadAdobeSDK();
      
      if (!mountedRef.current || !window.AdobeDC) {
        throw new Error("Adobe SDK not available");
      }

      // Clean up previous viewer instance if it exists
      if (viewerInstanceRef.current) {
        const container = document.getElementById(containerIdRef.current);
        if (container) {
          container.innerHTML = '';
        }
        viewerInstanceRef.current = null;
      }

      // Only create a new viewer if the PDF URL has changed or there's no viewer
      const pdfChanged = lastPdfRef.current !== pdfUrl;
      
      if (pdfChanged || !viewerInstanceRef.current) {
        lastPdfRef.current = pdfUrl;
        
        // Create new viewer instance
        viewerInstanceRef.current = new window.AdobeDC.View({
          clientId: "4535a4cd7b104484b535e22386736738",
          divId: containerIdRef.current,
        });

        viewerInstanceRef.current.previewFile(
          {
            content: {
              location: {
                url: pdfUrl,
              },
            },
            metaData: { fileName: fileName },
          },
          {
            embedMode: "LIGHT_BOX",
            defaultViewMode: "FIT_WIDTH",
            showDownloadPDF: true,
            showPrintPDF: true,
            showLeftHandPanel: false,
            enableFormFilling: false,
            enableSearchAPIs: false,
            dockPageControls: true,
          }
        );
      }

      // Hide loading after viewer is ready
      setTimeout(() => {
        if (mountedRef.current) setIsLoading(false);
      }, 500);

    } catch (err) {
      console.error("Error initializing Adobe PDF viewer:", err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to initialize PDF viewer");
        setIsLoading(false);
      }
    }
  }, [isOpen, pdfUrl, fileName]);

  // Initialize viewer when modal opens or PDF changes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setError(null);
      return;
    }

    mountedRef.current = true;
    setIsLoading(true);
    setError(null);
    initializeViewer();

    return () => {
      mountedRef.current = false;
      // Note: We keep the viewer instance alive for better performance
      // It will be cleaned up when the component unmounts or PDF changes
    };
  }, [isOpen, initializeViewer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const container = document.getElementById(containerIdRef.current);
      if (container) {
        container.innerHTML = '';
      }
      viewerInstanceRef.current = null;
      lastPdfRef.current = '';
    };
  }, []);

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
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors border border-border"
              aria-label="Close"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 relative bg-background">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg text-foreground">Loading PDF viewer...</p>
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

          {/* Adobe PDF viewer */}
          <div
            id={containerIdRef.current}
            className="w-full h-full"
          ></div>
        </div>
      </div>
    </div>,
    document.body
  );
}


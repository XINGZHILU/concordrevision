'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Type declarations for Adobe DC View SDK
 * Extends the Window interface to include AdobeDC global object
 */
declare global {
  interface Window {
    AdobeDC?: {
      View: new (config: {
        clientId: string;
        divId: string;
      }) => {
        previewFile: (
          fileConfig: {
            content: {
              location: {
                url: string;
              };
            };
            metaData: {
              fileName: string;
            };
          },
          viewerConfig: Record<string, unknown>
        ) => void;
      };
    };
  }
}

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

  useEffect(() => {
    if (!isOpen) return;

    // Reset state when modal opens
    setIsLoading(true);
    setError(null);

    let readyHandlerAdded = false;
    let mounted = true;

    const handleReady = () => {
      if (!mounted) return;
      
      try {
        const adobeDCView = new window.AdobeDC!.View({
          clientId: "4535a4cd7b104484b535e22386736738", // real Adobe Client ID
          divId: "adobe-dc-view-modal",
        });

        adobeDCView.previewFile(
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
            dockPageControls: true,
          }
        );

        // Hide loading after a short delay
        setTimeout(() => {
          if (mounted) setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error initializing Adobe PDF viewer:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize PDF viewer");
          setIsLoading(false);
        }
      }
    };

    const initializeViewer = () => {
      if (!window.AdobeDC) {
        console.warn("Adobe SDK not ready yet");
        return;
      }

      // If SDK is ready, initialize immediately
      handleReady();
    };

    // Only run in the browser
    const loadAdobeSDK = () => {
      if (window.AdobeDC) {
        // SDK already loaded - initialize immediately
        initializeViewer();
      } else {
        // Check if script is already in the document
        const existingScript = document.querySelector('script[src*="acrobatservices.adobe.com"]');
        
        if (!existingScript) {
          // Load SDK dynamically
          const script = document.createElement("script");
          script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
          script.async = true;
          script.onload = () => {
            // Wait for the ready event
            document.addEventListener("adobe_dc_view_sdk.ready", handleReady, { once: true });
            readyHandlerAdded = true;
          };
          script.onerror = () => {
            if (mounted) {
              setError("Failed to load Adobe PDF SDK");
              setIsLoading(false);
            }
          };
          document.head.appendChild(script);
        } else {
          // Script is loading or loaded, wait for ready event
          document.addEventListener("adobe_dc_view_sdk.ready", handleReady, { once: true });
          readyHandlerAdded = true;
        }
      }
    };

    loadAdobeSDK();

    return () => {
      mounted = false;
      if (readyHandlerAdded) {
        document.removeEventListener("adobe_dc_view_sdk.ready", handleReady);
      }
      const container = document.getElementById("adobe-dc-view-modal");
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isOpen, pdfUrl, fileName]);

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
            id="adobe-dc-view-modal"
            className="w-full h-full"
          ></div>
        </div>
      </div>
    </div>,
    document.body
  );
}


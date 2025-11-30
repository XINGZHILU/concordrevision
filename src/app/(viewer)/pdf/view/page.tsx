"use client"; // needed only in App Router

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
          viewerConfig: {
            embedMode: string;
            showDownloadPDF?: boolean;
            showPrintPDF?: boolean;
            showLeftHandPanel?: boolean;
          }
        ) => void;
      };
    };
  }
}

/**
 * Adobe PDF Viewer component with optimized loading
 */
function AdobePdfViewerContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get PDF URL and filename from query parameters
  const pdfUrl = searchParams?.get('url');
  const fileName = searchParams?.get('name') || "Document.pdf";

  useEffect(() => {
    if (!pdfUrl) {
      setError("No PDF URL provided");
      setIsLoading(false);
      return;
    }

    // Clear any existing content
    const container = document.getElementById("adobe-dc-view");
    if (container) {
      container.innerHTML = '';
    }

    let isInitialized = false;

    const initializeViewer = () => {
      if (isInitialized) return;
      isInitialized = true;

      try {
        if (!window.AdobeDC) {
          setError("Adobe SDK not loaded");
          setIsLoading(false);
          return;
        }

        const adobeDCView = new window.AdobeDC.View({
          clientId: "4535a4cd7b104484b535e22386736738",
          divId: "adobe-dc-view",
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
            embedMode: "FULL_WINDOW",
            showDownloadPDF: true,
            showPrintPDF: true,
            showLeftHandPanel: true,
          }
        );

        // Hide loading after a short delay to ensure viewer is rendered
        setTimeout(() => setIsLoading(false), 1000);
      } catch (err) {
        console.error("Error initializing Adobe PDF viewer:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize PDF viewer");
        setIsLoading(false);
      }
    };

    // Load Adobe SDK
    if (window.AdobeDC) {
      // SDK already loaded
      initializeViewer();
    } else {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="acrobatservices.adobe.com"]');
      
      if (existingScript) {
        // Script is loading, wait for it
        existingScript.addEventListener('load', initializeViewer);
      } else {
        // Load the script
        const script = document.createElement("script");
        script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
        script.async = true;
        script.onload = initializeViewer;
        script.onerror = () => {
          setError("Failed to load Adobe PDF SDK");
          setIsLoading(false);
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      const container = document.getElementById("adobe-dc-view");
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [pdfUrl, fileName]);

  // Error state
  if (error) {
    return (
      <main className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Failed to Load PDF</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full relative bg-background">
      {/* Loading overlay - shows while Adobe SDK initializes */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-foreground mb-2">Loading PDF Viewer...</p>
            <p className="text-sm text-muted-foreground">Initializing Adobe PDF Embed API</p>
            <p className="text-xs text-muted-foreground mt-4">This may take a few seconds on first load</p>
          </div>
        </div>
      )}

      {/* Adobe PDF viewer container */}
      <div
        id="adobe-dc-view"
        className="h-full w-full"
      ></div>
    </main>
  );
}

/**
 * Main component with Suspense wrapper for useSearchParams
 */
export default function AdobePdfViewer() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-foreground">Preparing PDF viewer...</p>
        </div>
      </div>
    }>
      <AdobePdfViewerContent />
    </Suspense>
  );
}


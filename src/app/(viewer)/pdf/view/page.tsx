"use client"; // needed only in App Router

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { loadAdobeSDK } from "@/lib/utils/adobeSDK";

/**
 * Adobe PDF Viewer component with optimized loading
 */
function AdobePdfViewerContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerInstanceRef = useRef<any>(null);
  const mountedRef = useRef(true);
  
  // Get PDF URL and filename from query parameters
  const pdfUrl = searchParams?.get('url');
  const fileName = searchParams?.get('name') || "Document.pdf";

  const initializeViewer = useCallback(async () => {
    if (!pdfUrl) {
      setError("No PDF URL provided");
      setIsLoading(false);
      return;
    }

    if (!mountedRef.current) return;

    try {
      // Load Adobe SDK (cached after first load)
      await loadAdobeSDK();

      if (!mountedRef.current || !window.AdobeDC) {
        throw new Error("Adobe SDK not available");
      }

      // Clean up previous instance
      if (viewerInstanceRef.current) {
        const container = document.getElementById("adobe-dc-view");
        if (container) {
          container.innerHTML = '';
        }
      }

      // Create new viewer instance
      viewerInstanceRef.current = new window.AdobeDC.View({
        clientId: "4535a4cd7b104484b535e22386736738",
        divId: "adobe-dc-view",
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
          embedMode: "FULL_WINDOW",
          defaultViewMode: "FIT_WIDTH",
          showDownloadPDF: true,
          showPrintPDF: true,
          showLeftHandPanel: false,
          enableFormFilling: false,
          enableSearchAPIs: false,
          dockPageControls: true,
        }
      );

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
  }, [pdfUrl, fileName]);

  useEffect(() => {
    mountedRef.current = true;
    initializeViewer();

    return () => {
      mountedRef.current = false;
      const container = document.getElementById("adobe-dc-view");
      if (container) {
        container.innerHTML = '';
      }
      viewerInstanceRef.current = null;
    };
  }, [initializeViewer]);

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


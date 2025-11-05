"use client"; // needed only in App Router

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Type declarations for Adobe DC View SDK
 * Extends the Window interface to include AdobeDC global object
 */
declare global {
  interface Window {
    AdobeDC: {
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

function AdobeViewerContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get PDF URL and filename from query parameters
  const pdfUrl = searchParams?.get('url') || "https://acrobatservices.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf";
  const fileName = searchParams?.get('name') || "Document.pdf";

  useEffect(() => {
    console.log("PDF Viewer - Initializing with URL:", pdfUrl);
    console.log("PDF Viewer - File name:", fileName);

    // Clear the container before initializing
    const container = document.getElementById("adobe-dc-view");
    if (container) {
      container.innerHTML = '';
    }

    let readyListenerAdded = false;

    const initializeAdobe = () => {
      console.log("PDF Viewer - Adobe SDK ready, initializing viewer");
      try {
        const adobeDCView = new window.AdobeDC.View({
          clientId: "4535a4cd7b104484b535e22386736738", // real Adobe Client ID
          divId: "adobe-dc-view",
        });

        console.log("PDF Viewer - Attempting to preview file:", pdfUrl);

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

        console.log("PDF Viewer - PreviewFile called successfully");
        setIsLoading(false);
      } catch (error) {
        console.error("PDF Viewer - Error initializing Adobe PDF viewer:", error);
        setError(error instanceof Error ? error.message : "Failed to load PDF viewer");
        setIsLoading(false);
      }
    };

    const onAdobeReady = () => {
      console.log("PDF Viewer - adobe_dc_view_sdk.ready event fired");
      initializeAdobe();
    };

    // Only run in the browser
    const loadAdobeSDK = () => {
      if (window.AdobeDC) {
        console.log("PDF Viewer - Adobe SDK already loaded");
        // SDK already loaded, but still wait for the ready event
        if (!readyListenerAdded) {
          document.addEventListener("adobe_dc_view_sdk.ready", onAdobeReady);
          readyListenerAdded = true;
        }
        // Also try to initialize directly in case the event already fired
        initializeAdobe();
      } else {
        console.log("PDF Viewer - Adobe SDK not loaded, loading script");
        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="acrobatservices.adobe.com"]');
        if (existingScript) {
          console.log("PDF Viewer - Script already exists, waiting for load");
          existingScript.addEventListener('load', () => {
            if (window.AdobeDC && !readyListenerAdded) {
              document.addEventListener("adobe_dc_view_sdk.ready", onAdobeReady);
              readyListenerAdded = true;
            }
          });
        } else {
          // Load SDK dynamically
          console.log("PDF Viewer - Loading Adobe SDK script");
          const script = document.createElement("script");
          script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
          script.async = true;
          script.onload = () => {
            console.log("PDF Viewer - Adobe SDK script loaded");
            if (window.AdobeDC && !readyListenerAdded) {
              document.addEventListener("adobe_dc_view_sdk.ready", onAdobeReady);
              readyListenerAdded = true;
            }
          };
          script.onerror = () => {
            console.error("PDF Viewer - Failed to load Adobe PDF Embed SDK");
          };
          document.body.appendChild(script);
        }
      }
    };

    loadAdobeSDK();

    // Cleanup function
    return () => {
      if (readyListenerAdded) {
        document.removeEventListener("adobe_dc_view_sdk.ready", onAdobeReady);
      }
      const container = document.getElementById("adobe-dc-view");
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [pdfUrl, fileName]);

  return (
    <main className="h-screen w-full relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-foreground">Loading PDF viewer...</p>
            <p className="text-sm text-muted-foreground mt-2">Initializing Adobe PDF Embed API</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Failed to Load PDF</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Please check the browser console for more details.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* PDF viewer container */}
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
export default function AdobeViewer() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-lg">Loading PDF viewer...</div>
      </div>
    }>
      <AdobeViewerContent />
    </Suspense>
  );
}


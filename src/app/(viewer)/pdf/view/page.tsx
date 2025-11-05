"use client"; // needed only in App Router

import { useEffect, Suspense } from "react";
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
  
  // Get PDF URL and filename from query parameters
  const pdfUrl = searchParams?.get('url') || "https://acrobatservices.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf";
  const fileName = searchParams?.get('name') || "Document.pdf";

  useEffect(() => {
    // Clear the container before initializing
    const container = document.getElementById("adobe-dc-view");
    if (container) {
      container.innerHTML = '';
    }

    const initializeAdobe = () => {
      try {
        const adobeDCView = new window.AdobeDC.View({
          clientId: "4535a4cd7b104484b535e22386736738", // real Adobe Client ID
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
      } catch (error) {
        console.error("Error initializing Adobe PDF viewer:", error);
      }
    };

    // Only run in the browser
    const loadAdobeSDK = () => {
      if (window.AdobeDC) {
        // SDK already loaded, initialize immediately
        initializeAdobe();
      } else {
        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="acrobatservices.adobe.com"]');
        if (existingScript) {
          // Wait for it to load
          existingScript.addEventListener('load', () => {
            if (window.AdobeDC) {
              initializeAdobe();
            }
          });
        } else {
          // Load SDK dynamically
          const script = document.createElement("script");
          script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
          script.async = true;
          script.onload = () => {
            if (window.AdobeDC) {
              initializeAdobe();
            }
          };
          script.onerror = () => {
            console.error("Failed to load Adobe PDF Embed SDK");
          };
          document.body.appendChild(script);
        }
      }
    };

    loadAdobeSDK();

    // Cleanup function
    return () => {
      const container = document.getElementById("adobe-dc-view");
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [pdfUrl, fileName]);

  return (
    <main className="h-screen w-full">
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


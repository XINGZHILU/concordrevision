"use client"; // needed only in App Router

import { useEffect } from "react";

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

export default function AdobeViewer() {
  useEffect(() => {
    // Only run in the browser
    const loadAdobeSDK = () => {
      if (window.AdobeDC) {
        initializeAdobe();
      } else {
        // Load SDK dynamically
        const script = document.createElement("script");
        script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
        script.async = true;
        script.onload = () => initializeAdobe();
        document.body.appendChild(script);
      }
    };

    const initializeAdobe = () => {
      document.addEventListener("adobe_dc_view_sdk.ready", () => {
        const adobeDCView = new window.AdobeDC.View({
          clientId: "4535a4cd7b104484b535e22386736738", // real Adobe Client ID
          divId: "adobe-dc-view",
        });

        adobeDCView.previewFile(
          {
            content: {
              location: {
                url: "https://acrobatservices.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf",
              },
            },
            metaData: { fileName: "Bodea Brochure.pdf" },
          },
          {
            embedMode: "FULL_WINDOW",
            showDownloadPDF: true,
            showPrintPDF: true,
            showLeftHandPanel: true,
          }
        );
      });
    };

    loadAdobeSDK();
  }, []);

  return (
    <main className="h-screen w-full">
      <div
        id="adobe-dc-view"
        className="h-full w-full"
      ></div>
    </main>
  );
}

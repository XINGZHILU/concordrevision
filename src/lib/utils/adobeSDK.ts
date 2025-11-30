/**
 * Adobe PDF Embed SDK loader
 * Loads the SDK once and reuses it across the application
 */

declare global {
  interface Window {
    AdobeDC?: {
      View: new (config: {
        clientId: string;
        divId: string;
      }) => AdobeViewInstance;
    };
  }
}

interface AdobeViewInstance {
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
}

let sdkLoading = false;
let sdkLoaded = false;
const sdkCallbacks: (() => void)[] = [];

/**
 * Loads the Adobe SDK once and caches it
 * Returns a promise that resolves when SDK is ready
 */
export function loadAdobeSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (sdkLoaded && window.AdobeDC) {
      resolve();
      return;
    }

    // If currently loading, queue the callback
    if (sdkLoading) {
      sdkCallbacks.push(() => resolve());
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="acrobatservices.adobe.com"]');
    
    if (existingScript && window.AdobeDC) {
      sdkLoaded = true;
      resolve();
      return;
    }

    // Start loading
    sdkLoading = true;

    const handleReady = () => {
      sdkLoaded = true;
      sdkLoading = false;
      resolve();
      
      // Execute queued callbacks
      sdkCallbacks.forEach(cb => cb());
      sdkCallbacks.length = 0;
      
      // Clean up event listener
      document.removeEventListener("adobe_dc_view_sdk.ready", handleReady);
    };

    if (!existingScript) {
      // Create and load the SDK script
      const script = document.createElement("script");
      script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
      script.async = true;
      
      script.onload = () => {
        // Wait for the ready event
        document.addEventListener("adobe_dc_view_sdk.ready", handleReady, { once: true });
      };
      
      script.onerror = () => {
        sdkLoading = false;
        sdkLoaded = false;
        reject(new Error("Failed to load Adobe PDF SDK"));
        
        // Reject queued callbacks
        sdkCallbacks.forEach(() => reject(new Error("Failed to load Adobe PDF SDK")));
        sdkCallbacks.length = 0;
      };
      
      document.head.appendChild(script);
    } else {
      // Script exists, wait for ready event
      document.addEventListener("adobe_dc_view_sdk.ready", handleReady, { once: true });
    }
  });
}

/**
 * Check if Adobe SDK is loaded
 */
export function isAdobeSDKLoaded(): boolean {
  return sdkLoaded && !!window.AdobeDC;
}


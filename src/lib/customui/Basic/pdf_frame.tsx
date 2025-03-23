// components/PDFViewer.tsx
"use client"; // Mark as client component

import { useEffect, useState, useRef } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

const PDFViewer = ({ pdfUrl, title = "PDF Viewer" }: PDFViewerProps) => {
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isIPad: false,
    isAndroid: false,
    isMobile: false
  });
  
  // Use direct URL approach for iOS since embedded viewers can have issues
  const [viewerMode, setViewerMode] = useState<'default' | 'ios' | 'android'>('default');
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check platform - only runs on client
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    // Specific iPad detection
    const isIPad = /iPad/.test(userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Detect Android
    const isAndroid = /android/i.test(userAgent);
    
    // General mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Set the viewer mode based on device
    if (isIOS || isIPad) {
      setViewerMode('ios');
    } else if (isAndroid) {
      setViewerMode('android');
    } else {
      setViewerMode('default');
    }
    
    setDeviceInfo({
      isIOS,
      isIPad,
      isAndroid,
      isMobile
    });
    
    console.log(`Device: iOS: ${isIOS}, iPad: ${isIPad}, Android: ${isAndroid}, Mode: ${isIOS || isIPad ? 'ios' : isAndroid ? 'android' : 'default'}`);
  }, []);

  // For iOS devices (iPhone/iPad)
  if (viewerMode === 'ios') {
    return (
      <div className="w-full h-screen flex flex-col" ref={containerRef}>
        <div className="p-4 bg-gray-100 border-b border-gray-300 text-center">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="text-sm text-gray-500 mt-1">
            {deviceInfo.isIPad ? "iPad Mode" : "iOS Mode"}
          </div>
        </div>
        
        {/* iOS-specific approach using Google PDF Viewer as a service */}
        <div className="flex-1 w-full overflow-hidden">
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + pdfUrl)}&embedded=true`}
            className="w-full h-full border-none"
            style={{ height: "90vh" }}
            title={title}
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
    );
  }

  // For Android devices
  if (viewerMode === 'android') {
    return (
      <div className="w-full h-screen flex flex-col" ref={containerRef}>
        <div className="p-4 bg-gray-100 border-b border-gray-300 text-center">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="text-sm text-gray-500 mt-1">Android Mode</div>
        </div>
        
        <div className="flex-1 w-full overflow-hidden">
          <iframe 
            src={pdfUrl}
            className="w-full h-full border-none"
            style={{ height: "90vh" }}
            title={title}
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
    );
  }

  // Default approach for desktop browsers
  return (
    <div className="w-full h-screen flex flex-col" ref={containerRef}>
      <div className="p-4 bg-gray-100 border-b border-gray-300 text-center">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="text-sm text-gray-500 mt-1">Desktop Mode</div>
      </div>
      
      <div className="flex-1 w-full overflow-hidden">
        <object
          className="w-full h-full border-none"
          data={pdfUrl}
          type="application/pdf"
        >
          <div className="p-5 text-center text-gray-600">
            <p>Your browser doesn't support embedded PDFs.</p>
          </div>
        </object>
      </div>
    </div>
  );
};

export default PDFViewer;
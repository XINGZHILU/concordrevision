// components/PDFViewer.jsx
"use client"; // Mark as client component

import { useEffect, useState, useRef } from 'react';

const PDFViewer = ({ pdfUrl, title} : {
    pdfUrl: string,
    title: string
}) => {
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isIPad: false,
    isAndroid: false,
    isMobile: false
  });
  
  const iframeRef = useRef(null);
  
  useEffect(() => {
    // Check platform - only runs on client
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Detect iOS
    // @ts-ignore
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    // Specific iPad detection
    const isIPad = /iPad/.test(userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Detect Android
    const isAndroid = /android/i.test(userAgent);
    
    // General mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    setDeviceInfo({
      isIOS,
      isIPad,
      isAndroid,
      isMobile
    });
    
    console.log(`Device detection: iOS: ${isIOS}, iPad: ${isIPad}, Android: ${isAndroid}, Mobile: ${isMobile}`);
  }, []);

  // Determine which rendering approach to use based on device
  const renderPDFViewer = () => {
    // For iPad, use iframe approach which has better scrolling support
    if (deviceInfo.isIPad) {
      return (
        <div className="w-full h-full overflow-auto webkit-overflow-scrolling-touch">
          <iframe 
            ref={iframeRef}
            src={`${pdfUrl}#toolbar=1&navpanes=1`}
            className="w-full h-full border-none"
            style={{ 
              minHeight: "85vh", 
              WebkitOverflowScrolling: "touch" // Enables momentum scrolling on iOS
            }}
            title={title}
            allow="fullscreen"
          />
        </div>
      );
    }
    
    // For all other devices, use standard object with iframe fallback
    return (
      <object
        className="w-full h-full border-none"
        data={pdfUrl}
        type="application/pdf"
      >
        {/* Fallback for browsers with poor PDF support */}
        <div className="p-5 text-center text-gray-600">
          <p>Your browser might not be displaying the PDF inline.</p>
          
          {/* Alternative using iframe */}
          <iframe 
            src={`${pdfUrl}#toolbar=1&navpanes=1`}
            className="w-full mt-4"
            style={{ height: "70vh" }}
            title={title}
            allow="fullscreen"
          >
            This browser does not support embedded PDFs.
          </iframe>
          
          {/* Download option as final fallback */}
          <a
            href={pdfUrl}
            className="block mx-auto w-48 mt-3 p-2 bg-blue-600 text-white no-underline rounded"
            download
          >
            Download PDF
          </a>
        </div>
      </object>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-gray-100 border-b border-gray-300 text-center">
        <h1 className="text-xl font-bold">{title}</h1>
        {deviceInfo.isMobile && (
          <div className="text-sm text-gray-500 mt-1">
            {deviceInfo.isIPad ? "iPad" : deviceInfo.isIOS ? "iOS Device" : deviceInfo.isAndroid ? "Android Device" : "Mobile Device"}
          </div>
        )}
      </div>
      
      <div className="flex-1 w-full relative" style={{ 
        overflow: deviceInfo.isIPad ? "auto" : "hidden",
        WebkitOverflowScrolling: "touch"
      }}>
        {renderPDFViewer()}
      </div>
      
      {/* Optional controls based on device type */}
      <div className="p-3 bg-gray-100 border-t border-gray-300 flex justify-center space-x-4">
        <button 
          onClick={() => window.open(pdfUrl, '_blank')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open in New Tab
        </button>
        <a 
          href={pdfUrl} 
          download
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 no-underline text-center"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default PDFViewer;
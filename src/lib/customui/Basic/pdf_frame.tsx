// components/PDFViewer.tsx
"use client";

import {useEffect, useState, useRef} from 'react';

interface PDFViewerProps {
    pdfUrl: string;
    title?: string;
}

const PDFViewer = ({pdfUrl, title = "PDF Viewer"}: PDFViewerProps) => {
    const [viewerMode, setViewerMode] = useState<'default' | 'ios' | 'android'>('default');
    const containerRef = useRef<HTMLDivElement>(null);

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

        // Detect Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

        // Detect Android
        const isAndroid = /android/i.test(userAgent);

        // Set the viewer mode based on device
        if (isIOS || isIPad) {
            setViewerMode('ios');
        } else if (isAndroid) {
            setViewerMode('android');
        } else {
            setViewerMode('default');
        }

        console.log(`Device info: iOS: ${isIOS}, iPad: ${isIPad}, Safari: ${isSafari}, Android: ${isAndroid}`);
    }, []);

    // For iOS devices (iPhone/iPad)
    if (viewerMode === 'ios') {
        // Safari on iOS has built-in PDF viewer that works when PDF is embedded in an iframe
        return (
            <div className="w-full h-screen flex flex-col" ref={containerRef}>
                <div className="p-3 bg-gray-100 border-b border-gray-300 text-center">
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>

                {/* Safari on iOS/iPadOS supports PDF viewing via iframe with proper settings */}
                <div
                    className="flex-1 w-full"
                    style={{
                        overflowY: 'scroll',
                        WebkitOverflowScrolling: 'touch',
                        height: 'calc(100vh - 56px)' // Account for header height
                    }}
                >
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-none"
                        style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'scroll',
                            border: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                        title={title}
                    ></iframe>
                </div>
            </div>
        );
    }

    // For Android devices
    if (viewerMode === 'android') {
        return (
            <div className="w-full h-screen flex flex-col" ref={containerRef}>
                <div className="p-3 bg-gray-100 border-b border-gray-300 text-center">
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>

                <div className="flex-1 w-full overflow-hidden">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-none"
                        style={{height: 'calc(100vh - 56px)'}}
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
            <div className="p-3 bg-gray-100 border-b border-gray-300 text-center">
                <h1 className="text-xl font-bold">{title}</h1>
            </div>

            <div className="flex-1 w-full overflow-hidden">
                <object
                    className="w-full h-full border-none"
                    data={pdfUrl}
                    type="application/pdf"
                    style={{height: 'calc(100vh - 56px)'}}
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
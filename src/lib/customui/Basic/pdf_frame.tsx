'use client';

// components/PdfViewer.tsx
import { useState, useEffect, useRef } from 'react';

interface PdfViewerProps {
    url: string;
    title?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title = "PDF Viewer" }) => {
    const [fallbackVisible, setFallbackVisible] = useState(false);
    const [useFallbackViewer, setUseFallbackViewer] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Detect iOS to proactively use a better approach
    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isIOS) {
            // On iOS, use the object tag approach which provides better navigation
            setUseFallbackViewer(true);
        }
    }, []);

    useEffect(() => {
        // Check if standard iframe loaded correctly after a short delay
        if (!useFallbackViewer) {
            const timeoutId = setTimeout(() => {
                if (iframeRef.current) {
                    try {
                        const iframeDoc = iframeRef.current.contentDocument ||
                            (iframeRef.current.contentWindow?.document);

                        if (!iframeDoc || iframeDoc.body.innerHTML === '') {
                            setFallbackVisible(true);
                        }
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (e) {
                        // Cross-origin issues may prevent access to iframe content
                        // We'll use the alternative approach
                        setFallbackVisible(true);
                    }
                }
            }, 1500);

            return () => clearTimeout(timeoutId);
        }
    }, [url, useFallbackViewer]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div className="w-full h-screen max-h-[80vh] border border-gray-300 rounded-lg overflow-hidden relative">
                {/* Standard iframe approach - works well on most browsers */}
                {!useFallbackViewer && !fallbackVisible && (
                    <iframe
                        ref={iframeRef}
                        className="w-full h-full border-none"
                        src={url}
                        title="PDF viewer"
                    />
                )}

                {/* Object tag approach - better for iOS */}
                {useFallbackViewer && (
                    <object
                        data={url}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-50">
                            <p className="text-gray-700 mb-4">Unable to display PDF. Please try downloading it.</p>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Download PDF
                            </a>
                        </div>
                    </object>
                )}

                {/* Complete fallback if neither approach works */}
                {fallbackVisible && !useFallbackViewer && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-50">
                        <p className="text-gray-700 mb-4">Your device does not seem to support embedded PDFs.</p>
                        <div className="space-y-4">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
                            >
                                Download PDF
                            </a>
                            <button
                                onClick={() => setUseFallbackViewer(true)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors block w-full"
                            >
                                Try Alternative Viewer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfViewer;
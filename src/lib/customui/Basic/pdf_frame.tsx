'use client';

// components/PdfViewer.tsx
import { useState, useEffect, useRef } from 'react';


export default function PdfViewer({ url, title } : {
    url: string;
    title: string;
}) {
    const [fallbackVisible, setFallbackVisible] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // Check if iframe loaded correctly after a short delay
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
                    // We'll leave the iframe visible unless proven it doesn't work
                }
            }
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [url]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div className="w-full h-screen max-h-[80vh] border border-gray-300 rounded-lg overflow-hidden relative">
                <iframe
                    ref={iframeRef}
                    className={`w-full h-full border-none ${fallbackVisible ? 'hidden' : 'block'}`}
                    src={url}
                    title="PDF viewer"
                />

                {fallbackVisible && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-50">
                        <p className="text-gray-700 mb-4">Your device does not seem to support embedded PDFs.</p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Download PDF
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

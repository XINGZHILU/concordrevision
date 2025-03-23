// components/PDFViewer.jsx
"use client"; // Mark as client component

import {useEffect, useState} from 'react';

export default function PDFViewer(
    {pdfUrl, title}: { pdfUrl: string, title: string }
) {
    const [deviceInfo, setDeviceInfo] = useState({
        isIOS: false,
        isAndroid: false,
        isMobile: false
    });

    useEffect(() => {
        // Check platform - only runs on client
        // @ts-ignore
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Detect iOS
        // @ts-ignore
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

        // Detect Android
        const isAndroid = /android/i.test(userAgent);

        // General mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

        setDeviceInfo({
            isIOS,
            isAndroid,
            isMobile
        });

        console.log(`Device detection: iOS: ${isIOS}, Android: ${isAndroid}, Mobile: ${isMobile}`);
    }, []);

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="p-4 bg-gray-100 border-b border-gray-300 text-center">
                <h1 className="text-xl font-bold">{title}</h1>
                {deviceInfo.isMobile && (
                    <div className="text-sm text-gray-500 mt-1">
                        {deviceInfo.isIOS ? "iOS Device" : deviceInfo.isAndroid ? "Android Device" : "Mobile Device"}
                    </div>
                )}
            </div>

            <div className="flex-1 w-full overflow-hidden relative">
                {/* Primary PDF Viewer */}
                <object
                    className="w-full h-full border-none"
                    data={pdfUrl}
                    type="application/pdf"
                >
                    {/* Fallback for browsers with poor PDF support */}
                    <div className="p-5 text-center text-gray-600">
                        <p>Your browser might not be displaying the PDF inline.</p>

                        {/* Alternative using iframe for better cross-platform support */}
                        <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0`}
                            className="w-full mt-4"
                            style={{height: "70vh"}}
                            title={title}
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

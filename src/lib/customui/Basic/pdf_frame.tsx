'use client';

// src/components/EnhancedPDFViewer.tsx
import React, { useState, useEffect } from 'react';

interface EnhancedPDFViewerProps {
    url: string;
    title: string;
}

const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({ url, title }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [urlType, setUrlType] = useState<string>('unknown');

    useEffect(() => {
        // Reset states when URL changes
        setLoading(true);
        setError(null);

        // Determine URL type for debugging
        if (url.startsWith('blob:')) {
            setUrlType('blob');
        } else if (url.startsWith('data:')) {
            setUrlType('data');
        } else if (url.startsWith('/')) {
            setUrlType('relative');
        } else if (url.startsWith('http')) {
            setUrlType('absolute');
        } else {
            setUrlType('unknown');
        }

        // Simulate loading completion
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [url]);

    // Function to handle iframe load event
    const handleIframeLoad = () => {
        setLoading(false);
    };

    // Function to handle iframe error
    const handleIframeError = () => {
        setError('Failed to load PDF in iframe');
    };

    return (
        <div className="pdf-viewer" style={{ width: '100%', height: '800px', position: 'relative' }}>
            {/* Header with title */}
            <div style={{ padding: '10px', marginBottom: '10px', textAlign: 'center' }}>
                <h2>{title}</h2>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    URL Type: {urlType} {urlType === 'blob' && '(Uploaded File)'}
                </div>
            </div>

            {/* Loading indicator */}
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    padding: '20px',
                    borderRadius: '8px',
                    zIndex: 10
                }}>
                    Loading PDF...
                </div>
            )}

            {/* Error message */}
            {error && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255,200,200,0.9)',
                    padding: '20px',
                    borderRadius: '8px',
                    zIndex: 10
                }}>
                    <p>Error: {error}</p>
                    <p><a href={url} target="_blank" rel="noopener noreferrer">Open PDF directly</a></p>
                </div>
            )}

            {/* Main PDF viewer with both iframe and object as fallbacks */}
            <div style={{ height: 'calc(100% - 70px)', width: '100%' }}>
                {/* Try iframe first - works better in Safari */}
                <iframe
                    src={`${url}#toolbar=1&navpanes=1`}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: error ? 'none' : 'block'
                    }}
                    title={title}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                />

                {/* Display download link as a fallback */}
                <div style={{
                    display: error ? 'flex' : 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    backgroundColor: '#f8f8f8',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <p>Unable to display PDF in browser.</p>
                    <a
                        href={url}
                        download={title}
                        style={{
                            display: 'inline-block',
                            margin: '20px 0',
                            padding: '10px 15px',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            borderRadius: '4px',
                            textDecoration: 'none'
                        }}
                    >
                        Download PDF
                    </a>
                    <p>Debug info: URL type is {urlType}</p>
                </div>
            </div>
        </div>
    );
};

export default EnhancedPDFViewer;
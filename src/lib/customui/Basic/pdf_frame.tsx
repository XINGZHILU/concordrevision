// src/components/SafariPDFViewer.tsx
"use client";

import React, { useState } from 'react';

interface SafariPDFViewerProps {
    url: string;
    title: string;
}

const SafariPDFViewer: React.FC<SafariPDFViewerProps> = ({ url, title }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleLoad = () => {
        setLoading(false);
    };

    const handleError = () => {
        setError('Unable to display PDF');
    };

    return (
        <div className="safari-pdf-viewer" style={{ width: '100%', height: '800px', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{
                padding: '10px',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8f8f8'
            }}>
                <h2 style={{ margin: 0 }}>{title}</h2>

                <a
                    href={url}
                    download={title}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#007aff',
                        color: 'white',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px'
                    }}
                >
                    Download PDF
                </a>
            </div>

            {/* Loading state */}
            {loading && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    Loading PDF...
                </div>
            )}

            {/* PDF Content */}
            <div style={{ flex: 1, position: 'relative' }}>
                <object
                    data={url}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{ border: 'none' }}
                >
                    {error ? (
                        <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: '#fff4f4',
                            border: '1px solid #ffcdd2',
                            borderRadius: '4px',
                            margin: '20px'
                        }}>
                            <p>Unable to display PDF. Please download it instead.</p>
                            <a
                                href={url}
                                download={title}
                                style={{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    backgroundColor: '#007aff',
                                    color: 'white',
                                    borderRadius: '4px',
                                    textDecoration: 'none',
                                    marginTop: '10px'
                                }}
                            >
                                Download PDF
                            </a>
                        </div>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <p>Your browser does not support embedded PDFs. Please download the file instead:</p>
                            <a
                                href={url}
                                download={title}
                                style={{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    backgroundColor: '#007aff',
                                    color: 'white',
                                    borderRadius: '4px',
                                    textDecoration: 'none',
                                    marginTop: '10px'
                                }}
                            >
                                Download PDF
                            </a>
                        </div>
                    )}
                </object>
            </div>
        </div>
    );
};

export default SafariPDFViewer;
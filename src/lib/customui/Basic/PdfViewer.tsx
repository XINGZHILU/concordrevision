'use client';

import React, { useState, useRef } from 'react';
import { usePdf } from '@mikecousins/react-pdf';

interface PdfViewerProps {
  url: string;
  title: string;
}

export default function PdfViewer({ url, title }: PdfViewerProps) {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument } = usePdf({
    file: url,
    page,
    canvasRef,
  });

  return (
    <div className="min-h-screen h-full w-full p-4">
      {!pdfDocument && <div className="text-center">Loading...</div>}
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      {pdfDocument && pdfDocument.numPages > 1 && (
        <nav className="flex justify-between items-center mt-4 max-w-2xl mx-auto">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {pdfDocument.numPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={page === pdfDocument.numPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
} 
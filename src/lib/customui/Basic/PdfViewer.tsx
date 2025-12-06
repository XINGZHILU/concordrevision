import { useEffect, useRef } from "react";

interface PDFViewerProps {
  src: string;
  height?: string;
}

export default function PDFViewer({ src, height = "500px" }: PDFViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the div has a unique ID
    if (!viewerRef.current?.id) {
      viewerRef.current!.id =
        "pdf-viewer-" + Math.random().toString(36).slice(2);
    }

    // Create module script
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import EmbedPDF from "https://snippet.embedpdf.com/embedpdf.js";

      if (!window.__embedPDFInit) {
        window.__embedPDFInit = {};
      }

      const targetId = "${viewerRef.current!.id}";
      const target = document.getElementById(targetId);

      if (target && !window.__embedPDFInit[targetId]) {
        window.__embedPDFInit[targetId] = true;

        EmbedPDF.init({
          type: "container",
          target,
          src: "${src}"
        });
      }
    `;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src]);

  return <div ref={viewerRef} style={{ height, width: "100%" }} />;
}

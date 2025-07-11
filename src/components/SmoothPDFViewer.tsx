import { useDebouncer } from "#/hooks/useDebouncer";
import { PDFViewer } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import { PDFDocument } from "./PDFDocument";
import { PDFErrorBoundary } from "./PDFErrorBoundary";
import type { DocumentData } from "#/types";

interface SmoothPDFViewerProps {
  documentData: DocumentData;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export function SmoothPDFViewer({
  documentData,
  width = "100%",
  height = "100%",
  style
}: SmoothPDFViewerProps) {
  const [debouncedData, setDebouncedData] = useState(documentData);
  const [pdfKey, setPdfKey] = useState(Date.now());
  const { debounce } = useDebouncer(1000);

  useEffect(() => {
    debounce(() => {
      setDebouncedData(documentData);
      // Générer une nouvelle clé seulement quand les données sont mises à jour
      setPdfKey(Date.now());
    });
  }, [documentData, debounce]);

  const isTyping = debouncedData !== documentData;

  return (
    <div style={{
      width,
      height,
      position: 'relative',
      ...style
    }}>
      {isTyping && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
          background: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          Mise à jour en cours...
        </div>
      )}

      <div style={{
        width: '100%',
        height: '100%',
        opacity: isTyping ? 0.6 : 1,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        <PDFErrorBoundary>
          <PDFViewer
            key={pdfKey}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            showToolbar={false}
          >
            <PDFDocument documentData={debouncedData} />
          </PDFViewer>
        </PDFErrorBoundary>
      </div>
    </div>
  );
}

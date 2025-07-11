import type { DocumentData } from "#/types";
import { exportToJSON } from "#/utils";
import { css } from "#styled-system/css";
import { hstack } from "#styled-system/patterns";
import { pdf } from "@react-pdf/renderer";
import { useRef } from "react";
import { PDFDocument } from "./PDFDocument";

interface ExportButtonsProps {
  documentData: DocumentData;
  onImport?: (data: DocumentData) => void;
}

export function ExportButtons({ documentData, onImport }: ExportButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const filename = `${documentData.type}_${documentData.number}`;
    exportToJSON(documentData, filename);
  };

  const handleExportPDF = async () => {
    try {
      const filename = `${documentData.type}_${documentData.number}.pdf`;
      const blob = await pdf(<PDFDocument documentData={documentData} />).toBlob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        if (importedData && typeof importedData === 'object') {
          localStorage.setItem('invoiceData', JSON.stringify(importedData));
          window.location.reload();
        } else {
          alert('Format de fichier invalide');
        }
      } catch (error) {
        alert('Erreur lors de l\'import du fichier');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportButtonClass = css({
    padding: '0.5rem 1rem',
    borderRadius: 'md',
    fontWeight: 'medium',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    fontSize: 'sm',
    backgroundColor: '#2563eb',
    color: 'white',
    _hover: {
      backgroundColor: '#1d4ed8'
    }
  });

  const importButtonClass = css({
    padding: '0.5rem 1rem',
    borderRadius: 'md',
    fontWeight: 'medium',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    fontSize: 'sm',
    backgroundColor: '#059669',
    color: 'white',
    _hover: {
      backgroundColor: '#047857'
    }
  });

  const pdfButtonClass = css({
    padding: '0.5rem 1rem',
    borderRadius: 'md',
    fontWeight: 'medium',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    fontSize: 'sm',
    backgroundColor: '#dc2626',
    color: 'white',
    _hover: {
      backgroundColor: '#b91c1c'
    }
  });

  return (
    <div className={hstack({ gap: '0.5rem' })}>
      <button
        onClick={handleExportPDF}
        className={pdfButtonClass}
        title="Exporter en PDF"
      >
        📄 Export PDF
      </button>

      <button
        onClick={handleExportJSON}
        className={exportButtonClass}
        title="Exporter les données en JSON"
      >
        💾 Exporter
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className={importButtonClass}
        title="Importer des données depuis un fichier JSON"
      >
        📂 Importer
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJSON}
        style={{ display: 'none' }}
      />
    </div>
  );
}
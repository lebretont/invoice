import type { DocumentLine } from "#/types";
import { formatCurrency } from "#/utils";
import { css } from "#styled-system/css";

interface LinesTableProps {
  lines: DocumentLine[];
  onUpdate: (lines: DocumentLine[]) => void;
}

export function LinesTable({ lines, onUpdate }: LinesTableProps) {
  const updateLine = (index: number, updates: Partial<DocumentLine>) => {
    const newLines = [...lines];
    const updatedLine = { ...newLines[index], ...updates };

    if ('quantity' in updates || 'unitPrice' in updates) {
      updatedLine.total = Number((updatedLine.quantity * updatedLine.unitPrice).toFixed(2));
    }

    newLines[index] = updatedLine;
    onUpdate(newLines);
  };

  const addLine = () => {
    const newLine: DocumentLine = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      unit: 'Forfait',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    onUpdate([...lines, newLine]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      const newLines = lines.filter((_, i) => i !== index);
      onUpdate(newLines);
    }
  };

  const tableClass = css({
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'sm'
  });

  const thClass = css({
    backgroundColor: '#f9fafb',
    padding: '0.75rem 0.5rem',
    textAlign: 'left',
    fontWeight: 'medium',
    color: '#374151',
    borderBottom: '1px solid',
    borderColor: '#e5e7eb'
  });

  const tdClass = css({
    padding: '0.5rem',
    borderBottom: '1px solid',
    borderColor: '#e5e7eb',
    verticalAlign: 'top'
  });

  const inputClass = css({
    width: '100%',
    padding: '0.25rem',
    border: '1px solid',
    borderColor: '#d1d5db',
    borderRadius: 'sm',
    fontSize: 'sm',
    _focus: {
      outline: 'none',
      borderColor: '#3b82f6'
    }
  });

  const buttonClass = css({
    padding: '0.25rem 0.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: 'sm',
    cursor: 'pointer',
    fontSize: 'xs',
    _hover: {
      backgroundColor: '#dc2626'
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  });

  return (
    <div>
      <div className={css({ overflowX: 'auto' })}>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass} style={{ width: '35%' }}>Description</th>
              <th className={thClass} style={{ width: '10%' }}>Quantité</th>
              <th className={thClass} style={{ width: '10%' }}>Unité</th>
              <th className={thClass} style={{ width: '15%' }}>Prix unitaire</th>
              <th className={thClass} style={{ width: '15%' }}>Total</th>
              <th className={thClass} style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={line.id}>
                <td className={tdClass}>
                  <input
                    type="text"
                    value={line.title}
                    onChange={(e) => updateLine(index, { title: e.target.value })}
                    className={css({
                      width: '100%',
                      padding: '0.25rem',
                      border: '1px solid',
                      borderColor: '#d1d5db',
                      borderRadius: 'sm',
                      fontSize: 'sm',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem',
                      _focus: {
                        outline: 'none',
                        borderColor: '#3b82f6'
                      }
                    })}
                    placeholder="Titre de la prestation..."
                  />
                  <textarea
                    value={line.description}
                    onChange={(e) => updateLine(index, { description: e.target.value })}
                    className={css({
                      width: '100%',
                      padding: '0.25rem',
                      border: '1px solid',
                      borderColor: '#d1d5db',
                      borderRadius: 'sm',
                      fontSize: 'sm',
                      resize: 'vertical',
                      minHeight: '2rem',
                      _focus: {
                        outline: 'none',
                        borderColor: '#3b82f6'
                      }
                    })}
                    placeholder="Description détaillée..."
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, { quantity: parseFloat(e.target.value) || 0 })}
                    className={inputClass}
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="text"
                    value={line.unit}
                    onChange={(e) => updateLine(index, { unit: e.target.value })}
                    className={inputClass}
                    placeholder="Unité"
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                    className={inputClass}
                    placeholder="0,00"
                  />
                </td>
                <td className={tdClass}>
                  <div className={css({
                    padding: '0.25rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: 'sm',
                    textAlign: 'right',
                    fontWeight: 'medium'
                  })}>
                    {formatCurrency(line.total)}
                  </div>
                </td>
                <td className={tdClass}>
                  <button
                    onClick={() => removeLine(index)}
                    disabled={lines.length === 1}
                    className={buttonClass}
                    title="Supprimer cette ligne"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={css({ marginTop: '1rem' })}>
        <button
          onClick={addLine}
          className={css({
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 'md',
            cursor: 'pointer',
            fontSize: 'sm',
            fontWeight: 'medium',
            _hover: {
              backgroundColor: '#2563eb'
            }
          })}
        >
          + Ajouter une ligne
        </button>
      </div>
    </div>
  );
}
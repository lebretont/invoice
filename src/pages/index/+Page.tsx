import { useState, useEffect, useCallback } from 'react';
import type { DocumentData, DocumentLine, Company, Client, ExpirationDays } from '../../types';
import { ClientComponent } from '#/components/ClientComponent';
import { loadFromLocalStorage, calculateDocumentTotals, saveToLocalStorage } from '#/utils';
import { css } from '#styled-system/css';
import { DocumentForm } from '#/components/DocumentForm';
import { SmoothPDFViewer } from '#/components/SmoothPDFViewer';
import { ExportButtons } from '#/components/ExportButtons';

const defaultCompany: Company = {
  name: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  email: '',
  siret: '',
  vatNumber: ''
};

const defaultClient: Client = {
  name: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  email: ''
};

const defaultLine: DocumentLine = {
  id: '1',
  title: '',
  description: '',
  unit: 'Forfait',
  quantity: 1,
  unitPrice: 0,
  total: 0
};

export default function Page() {
  const [documentData, setDocumentData] = useState<DocumentData>({
    id: crypto.randomUUID(),
    type: 'quote',
    number: 0,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expirationDays: 30,
    company: defaultCompany,
    client: defaultClient,
    lines: [defaultLine],
    vatRate: 20,
    subtotal: 0,
    vatAmount: 0,
    total: 0,
    notes: '',
    bankName: '',
    iban: '',
    bic: ''
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadFromLocalStorage<DocumentData>('invoiceData');
    if (saved) {
      const mergedData = {
        ...documentData,
        ...saved,
        company: {
          ...defaultCompany,
          ...saved.company
        },
        client: {
          ...defaultClient,
          ...saved.client
        },
        lines: saved.lines?.map(line => ({
          ...defaultLine,
          ...line
        })) || [defaultLine],
        notes: saved.notes || '',
        bankName: saved.bankName || '',
        iban: saved.iban || '',
        bic: saved.bic || ''
      };
      setDocumentData(mergedData);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const totals = calculateDocumentTotals(documentData.lines, documentData.vatRate);
    const updatedData = {
      ...documentData,
      ...totals
    };

    // Only update if totals have changed
    if (
      documentData.subtotal !== totals.subtotal ||
      documentData.vatAmount !== totals.vatAmount ||
      documentData.total !== totals.total
    ) {
      setDocumentData(updatedData);
    }

    // Save to localStorage whenever documentData changes (only after initial load)
    if (isLoaded) {
      saveToLocalStorage('invoiceData', documentData);
    }
  }, [documentData, isLoaded]);

  const updateDocumentData = useCallback((updates: Partial<DocumentData>) => {
    setDocumentData(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleDocumentType = useCallback(() => {
    const newType = documentData.type === 'quote' ? 'invoice' : 'quote'

    const newId = crypto.randomUUID();

    updateDocumentData({
      id: newId,
      type: newType,
      dueDate: newType === 'invoice' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
      expirationDate: newType === 'quote' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
      expirationDays: newType === 'quote' ? 30 : undefined
    });
  }, [documentData.type]);

  const resetForm = useCallback(() => {
    const newData = {
      id: crypto.randomUUID(),
      type: documentData.type,
      number: 0,
      date: new Date().toISOString().split('T')[0],
      dueDate: documentData.type === 'invoice' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
      expirationDate: documentData.type === 'quote' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
      expirationDays: documentData.type === 'quote' ? 30 as ExpirationDays : undefined,
      company: defaultCompany,
      client: defaultClient,
      lines: [{ ...defaultLine, id: crypto.randomUUID() }],
      vatRate: 20,
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      notes: '',
      bankName: '',
      iban: '',
      bic: ''
    };
    setDocumentData(newData);
  }, [documentData.type]);

  return (
    <div className={css({
      height: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column'
    })}>
      {/* Header fixe */}
      <header className={css({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem',
        boxShadow: 'sm',
        height: '4rem'
      })}>
        <div className={css({
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        })}>
          <h1 className={css({
            fontSize: 'xl',
            fontWeight: 'bold',
            color: '#1f2937'
          })}>
            Éditeur de {documentData.type === 'quote' ? 'Devis' : 'Factures'}
          </h1>
        </div>
      </header>

      <main className={css({
        flex: 1,
        paddingTop: '4rem', // Espace pour header fixe
        paddingBottom: '4rem',
        mdDown: {
          paddingBottom: '4.5rem'
        },
        overflow: 'hidden',
        minHeight: 0 // Force flex shrinking
      })}>
        <div className={css({
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1rem',
          height: '100%'
        })}>
          <div className={css({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            height: '100%',
            mdDown: {
              gridTemplateColumns: '1fr',
              gridTemplateRows: '1fr min-content',
              gap: '1rem'
            }
          })}>
            <div className={css({
              backgroundColor: 'white',
              borderRadius: 'lg',
              boxShadow: 'sm',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            })}>
              <div className={css({
                padding: '1.5rem',
                overflowY: 'auto',
                flex: 1
              })}>
                <DocumentForm
                  documentData={documentData}
                  onUpdate={updateDocumentData}
                />
              </div>
            </div>

            <div className={css({
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              mdDown: {
                minHeight: '40vh'
              }
            })}>
              <div className={css({
                overflowY: 'auto',
                flex: 1
              })}>
                <ClientComponent>
                  <SmoothPDFViewer documentData={documentData} />
                </ClientComponent>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={css({
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '1rem',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        height: '4rem',
        mdDown: {
          padding: '0.75rem',
          height: 'auto',
          minHeight: '3.5rem'
        }
      })}>
        <div className={css({
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          mdDown: {
            flexWrap: 'wrap',
            gap: '0.5rem'
          }
        })}>
          <button
            onClick={toggleDocumentType}
            className={css({
              padding: '0.5rem 1rem',
              backgroundColor: documentData.type === 'quote' ? '#3b82f6' : '#10b981',
              color: 'white',
              borderRadius: 'md',
              fontWeight: 'medium',
              cursor: 'pointer',
              _hover: {
                backgroundColor: documentData.type === 'quote' ? '#2563eb' : '#059669'
              },
              mdDown: {
                padding: '0.4rem 0.8rem',
                fontSize: 'sm'
              }
            })}
          >
            Mode: {documentData.type === 'quote' ? 'Devis' : 'Facture'}
          </button>

          <button
            onClick={resetForm}
            className={css({
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              borderRadius: 'md',
              fontWeight: 'medium',
              cursor: 'pointer',
              _hover: {
                backgroundColor: '#4b5563'
              },
              mdDown: {
                padding: '0.4rem 0.8rem',
                fontSize: 'sm'
              }
            })}
          >
            Nouveau
          </button>

          <ExportButtons documentData={documentData} />
        </div>
      </footer>
    </div>
  );
}
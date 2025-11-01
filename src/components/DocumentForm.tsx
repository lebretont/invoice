import type { DocumentData, ExpirationDays } from "#/types";
import { calculateExpirationDate } from "#/utils";
import { css } from "#styled-system/css";
import { vstack } from "#styled-system/patterns";
import { CollapsibleSection } from "./CollapsibleSection";
import { LinesTable } from "./LinesTable";

interface DocumentFormProps {
  documentData: DocumentData;
  onUpdate: (updates: Partial<DocumentData>) => void;
}

export function DocumentForm({ documentData, onUpdate }: DocumentFormProps) {
  const inputClass = css({
    width: '100%',
    padding: '0.5rem',
    border: '1px solid',
    borderColor: '#d1d5db',
    borderRadius: 'md',
    fontSize: 'sm',
    _focus: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 1px rgb(59 130 246)'
    }
  });

  const labelClass = css({
    display: 'block',
    fontSize: 'sm',
    fontWeight: 'medium',
    color: '#374151',
    marginBottom: '0.25rem'
  });

  const gridClass = css({
    display: 'grid',
    gridTemplateColumns: { base: '1fr 1fr' },
    gap: '1rem'
  });

  const handleExpirationDaysChange = (days: ExpirationDays) => {
    const expirationDate = calculateExpirationDate(documentData.date, days);
    onUpdate({
      expirationDays: days,
      expirationDate
    });
  };

  const handleDueDaysChange = (days: number | null) => {
    if (!days || days <= 0) {
      onUpdate({
        dueDays: undefined,
        dueDate: ''
      });
      return;
    }

    const dueDate = calculateExpirationDate(documentData.date, days);
    onUpdate({
      dueDays: days,
      dueDate
    });
  };

  return (
    <div className={vstack({ alignItems: 'stretch', gap: '0' })}>
      <CollapsibleSection title="Informations générales" defaultExpanded={false}>
        <div className={gridClass}>
          <div>
            <label className={labelClass}>
              Numéro
            </label>
            <input
              type="text"
              value={documentData.number}
              onChange={(e) => onUpdate({ number: parseInt(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Date
            </label>
            <input
              type="date"
              value={documentData.date}
              onChange={(e) => {
                const newDate = e.target.value;
                const updates: Partial<DocumentData> = { date: newDate };

                if (documentData.type === 'quote' && documentData.expirationDays) {
                  updates.expirationDate = calculateExpirationDate(newDate, documentData.expirationDays);
                }

                if (documentData.type === 'invoice' && documentData.dueDays && documentData.dueDays > 0) {
                  updates.dueDate = calculateExpirationDate(newDate, documentData.dueDays);
                }

                onUpdate(updates);
              }}
              className={inputClass}
            />
          </div>
          {documentData.type === 'invoice' && (
            <div className={css({ gridColumn: 'span 2' })}>
              <label className={labelClass}>
                Échéance
              </label>
              <div className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: '0.5rem'
              })}>
                <label className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                })}>
                  <input
                    type="radio"
                    name="dueDays"
                    value="30"
                    checked={documentData.dueDays === 30}
                    onChange={() => handleDueDaysChange(30)}
                  />
                  <span>30 jours</span>
                </label>
                <div className={css({
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                })}>
                  <label className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  })}>
                    <input
                      type="radio"
                      name="dueDays"
                      value="custom"
                      checked={documentData.dueDays !== 30}
                      onChange={() => {
                        if (documentData.dueDays === 30) {
                          onUpdate({
                            dueDays: undefined,
                            dueDate: ''
                          });
                        }
                      }}
                    />
                    <span>Personnalisé</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Nombre de jours"
                    value={documentData.dueDays !== undefined && documentData.dueDays !== 30 ? documentData.dueDays : ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (Number.isNaN(value)) {
                        onUpdate({
                          dueDays: undefined,
                          dueDate: ''
                        });
                        return;
                      }
                      handleDueDaysChange(value);
                    }}
                    className={css({
                      width: '8rem',
                      padding: '0.5rem',
                      border: '1px solid',
                      borderColor: '#d1d5db',
                      borderRadius: 'md',
                      fontSize: 'sm',
                      _focus: {
                        outline: 'none',
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 1px rgb(59 130 246)'
                      }
                    })}
                    disabled={documentData.dueDays === 30}
                  />
                </div>
              </div>
              {documentData.dueDate && (
                <div className={css({
                  marginTop: '0.5rem',
                  fontSize: 'sm',
                  color: '#6b7280'
                })}>
                  Échéance : {new Date(documentData.dueDate).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          )}
          {documentData.type === 'quote' && (
            <div className={css({ gridColumn: 'span 2' })}>
              <label className={labelClass}>
                Date d'expiration
              </label>
              <div className={css({
                display: 'flex',
                gap: '1rem',
                marginTop: '0.5rem'
              })}>
                {[15, 30, 45].map((days) => (
                  <label key={days} className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  })}>
                    <input
                      type="radio"
                      name="expirationDays"
                      value={days}
                      checked={documentData.expirationDays === days}
                      onChange={() => handleExpirationDaysChange(days as ExpirationDays)}
                    />
                    <span>{days} jours</span>
                  </label>
                ))}
              </div>
              {documentData.expirationDate && (
                <div className={css({
                  marginTop: '0.5rem',
                  fontSize: 'sm',
                  color: '#6b7280'
                })}>
                  Échéance: {new Date(documentData.expirationDate).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          )}
          <div>
            <label className={labelClass}>
              Taux TVA (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={documentData.vatRate}
              onChange={(e) => onUpdate({ vatRate: parseFloat(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Votre entreprise" defaultExpanded={false}>
        <div className={gridClass}>
          <div>
            <label className={labelClass}>
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={documentData.company.name}
              onChange={(e) => onUpdate({
                company: { ...documentData.company, name: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Email
            </label>
            <input
              type="email"
              value={documentData.company.email}
              onChange={(e) => onUpdate({
                company: { ...documentData.company, email: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Téléphone
            </label>
            <input
              type="tel"
              value={documentData.company.phone}
              onChange={(e) => onUpdate({
                company: { ...documentData.company, phone: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              SIRET
            </label>
            <input
              type="text"
              value={documentData.company.siret}
              onChange={(e) => onUpdate({
                company: { ...documentData.company, siret: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div className={css({ gridColumn: 'span 2' })}>
            <label className={labelClass}>
              Adresse
            </label>
            <input
              type="text"
              value={documentData.company.address}
              onChange={(e) => onUpdate({
                company: { ...documentData.company, address: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Code postal
            </label>
            <input
              type="text"
              value={documentData.company.postalCode}
              onChange={(e) => onUpdate({
                company: { ...documentData.company, postalCode: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Ville
            </label>
            <input
              type="text"
              value={documentData.company.city}
              onChange={(e) => onUpdate({
                company: { ...documentData.company, city: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              N° TVA
            </label>
            <input
              type="text"
              value={documentData.company.vatNumber}
              onChange={(e) => onUpdate({
                company: { ...documentData.company, vatNumber: e.target.value }
              })}
              className={inputClass}
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Informations bancaires" defaultExpanded={false}>
        <div className={gridClass}>
          <div>
            <label className={labelClass}>
              Banque
            </label>
            <input
              type="text"
              value={documentData.bankName || ''}
              onChange={(e) => onUpdate({ bankName: e.target.value })}
              className={inputClass}
              placeholder="Nom de la banque"
            />
          </div>
          <div>
            <label className={labelClass}>
              BIC/SWIFT
            </label>
            <input
              type="text"
              value={documentData.bic || ''}
              onChange={(e) => onUpdate({ bic: e.target.value })}
              className={inputClass}
              placeholder="Code BIC/SWIFT"
            />
          </div>
          <div className={css({ gridColumn: 'span 2' })}>
            <label className={labelClass}>
              IBAN
            </label>
            <input
              type="text"
              value={documentData.iban || ''}
              onChange={(e) => onUpdate({ iban: e.target.value })}
              className={inputClass}
              placeholder="FR76 1234 5678 9012 3456 7890 123"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Client" defaultExpanded={true}>
        <div className={gridClass}>
          <div>
            <label className={labelClass}>
              Nom du client
            </label>
            <input
              type="text"
              value={documentData.client.name}
              onChange={(e) => onUpdate({
                client: { ...documentData.client, name: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Email
            </label>
            <input
              type="email"
              value={documentData.client.email}
              onChange={(e) => onUpdate({
                client: { ...documentData.client, email: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Téléphone
            </label>
            <input
              type="tel"
              value={documentData.client.phone}
              onChange={(e) => onUpdate({
                client: { ...documentData.client, phone: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              SIRET
            </label>
            <input
              type="text"
              value={documentData.client.siret}
              onChange={(e) => onUpdate({
                client: { ...documentData.client, siret: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              N° TVA
            </label>
            <input
              type="text"
              value={documentData.client.vatNumber}
              onChange={(e) => onUpdate({
                client: { ...documentData.client, vatNumber: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Code postal
            </label>
            <input
              type="text"
              value={documentData.client.postalCode}
              onChange={(e) => onUpdate({
                client: { ...documentData.client, postalCode: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div className={css({ gridColumn: 'span 2' })}>
            <label className={labelClass}>
              Adresse
            </label>
            <input
              type="text"
              value={documentData.client.address}
              onChange={(e) => onUpdate({
                client: { ...documentData.client, address: e.target.value }
              })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Ville
            </label>
            <input
              type="text"
              value={documentData.client.city}
              onChange={(e) => onUpdate({
                client: { ...documentData.client, city: e.target.value }
              })}
              className={inputClass}
            />
          </div>
        </div>
      </CollapsibleSection>

      <div className={css({
        marginBottom: '1.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb'
      })}>
        <h3 className={css({
          fontSize: 'lg',
          fontWeight: 'semibold',
          color: '#1f2937',
          marginBottom: '1rem'
        })}>
          Prestations
        </h3>
        <LinesTable
          lines={documentData.lines}
          onUpdate={(lines) => onUpdate({ lines })}
        />
      </div>

      {documentData.type === 'quote' && (
        <div className={css({ marginBottom: '1rem' })}>
          <label className={labelClass}>
            Conditions de règlement
          </label>
          <textarea
            value={documentData.paymentTerms || ''}
            onChange={(e) => onUpdate({ paymentTerms: e.target.value })}
            rows={4}
            className={css({
              width: '100%',
              padding: '0.5rem',
              border: '1px solid',
              borderColor: '#d1d5db',
              borderRadius: 'md',
              fontSize: 'sm',
              resize: 'vertical',
              _focus: {
                outline: 'none',
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 1px rgb(59 130 246)'
              }
            })}
            placeholder="Conditions de règlement (laisser vide pour ne pas afficher)"
          />
        </div>
      )}

      <div>
        <label className={labelClass}>
          Notes
        </label>
        <textarea
          value={documentData.notes || ''}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          rows={3}
          className={css({
            width: '100%',
            padding: '0.5rem',
            border: '1px solid',
            borderColor: '#d1d5db',
            borderRadius: 'md',
            fontSize: 'sm',
            resize: 'vertical',
            _focus: {
              outline: 'none',
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 1px rgb(59 130 246)'
            }
          })}
          placeholder="Notes complémentaires..."
        />
      </div>
    </div>
  );
}

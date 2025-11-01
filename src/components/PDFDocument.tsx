import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { DocumentData } from '#/types';
import { formatCurrency, formatDate, getDocumentNumber } from '#/utils';

interface PDFDocumentProps {
  documentData: DocumentData;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    paddingBottom: 80,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  companiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyBlock: {
    width: '45%',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 11,
    marginBottom: 2,
  },
  table: {
    width: '100%',
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableCell: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    display: 'flex',
    justifyContent: 'center'
  },
  tableCellHeader: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    fontWeight: 'bold',
    fontSize: 11,
  },
  descriptionCell: {
    width: '48%'
  },
  quantityCell: {
    width: '12%',
    textAlign: 'center'
  },
  priceCell: {
    width: '14%',
    textAlign: 'right'
  },
  vatCell: {
    width: '12%',
    textAlign: 'center'
  },
  totalCell: {
    width: '14%',
    textAlign: 'right'
  },
  lineTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 11,
  },
  lineDescription: {
    fontSize: 10,
    marginBottom: 1,
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  totalsTable: {
    width: '35%',
    alignSelf: 'flex-end',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  totalsRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  quoteConditions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  conditionsBlock: {
    width: '45%',
  },
  conditionsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  conditionsText: {
    fontSize: 11,
    marginBottom: 4,
  },
  signatureBlock: {
    width: '40%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  signatureTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 11,
    marginBottom: 4,
  },
  quoteDisclaimer: {
    textAlign: 'center',
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 11,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 12,
  },
  footerRow: {
    marginBottom: 2,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    right: 30,
    fontSize: 10,
    color: '#666',
  },
});

export const PDFDocument = React.memo(function PDFDocument({ documentData }: PDFDocumentProps) {
  const TableRows = () => {
    return documentData.lines.map((line) => {

      return (
        <View key={line.id} style={styles.tableRow} wrap={false}>
          <View style={[styles.tableCell, styles.descriptionCell]}>
            {line.title && (
              <Text style={styles.lineTitle}>{line.title}</Text>
            )}
            {line.description && line.description.split('\n').map((desc, i) => (
              <Text key={i} style={styles.lineDescription}>{desc}</Text>
            ))}
          </View>
          <View style={[styles.tableCell, styles.quantityCell]}>
            <Text>{line.quantity || 0} {line.unit || ''}</Text>
          </View>
          <View style={[styles.tableCell, styles.priceCell]}>
            <Text>{formatCurrency(line.unitPrice || 0)}</Text>
          </View>
          <View style={[styles.tableCell, styles.vatCell]}>
            <Text>{documentData.vatRate || 0}%</Text>
          </View>
          <View style={[styles.tableCell, styles.totalCell]}>
            <Text>{formatCurrency(line.total || 0)}</Text>
          </View>
        </View>
      );
    });
  };

  const Footer = () => (
    <View style={styles.footer} fixed>
      {(documentData.bankName || documentData.iban || documentData.bic) && (
        <>
          {documentData.bankName && (
            <Text style={styles.footerRow}>Banque : {documentData.bankName}</Text>
          )}
          {documentData.iban && (
            <Text style={styles.footerRow}>IBAN : {documentData.iban}</Text>
          )}
          {documentData.bic && (
            <Text style={styles.footerRow}>SWIFT/BIC : {documentData.bic}</Text>
          )}
        </>
      )}
    </View>
  );

  return (
    <Document title={`${documentData.type === 'quote' ? 'Devis' : 'Facture'} ${getDocumentNumber(documentData.type, documentData.number)}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {documentData.type === 'quote' ? 'Devis' : 'Facture'}
          </Text>
          <Text style={styles.subtitle}>
            Date : {formatDate(documentData.date)}
          </Text>
          <Text style={styles.subtitle}>
            Référence : {getDocumentNumber(documentData.type, documentData.number)}
          </Text>
          {documentData.type === 'quote' && documentData.expirationDate && (
            <Text style={styles.subtitle}>
              Date d'expiration : {formatDate(documentData.expirationDate)}
            </Text>
          )}
          {documentData.type === 'invoice' && documentData.dueDate && (
            <Text style={styles.subtitle}>
              Date d'échéance : {formatDate(documentData.dueDate)}
            </Text>
          )}
        </View>

        <View style={styles.companiesRow}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{documentData.company.name}</Text>
            {documentData.company.address && (
              <Text style={styles.companyDetails}>{documentData.company.address}</Text>
            )}
            {(documentData.company.postalCode || documentData.company.city) && (
              <Text style={styles.companyDetails}>
                {documentData.company.postalCode} {documentData.company.city}
              </Text>
            )}
            {documentData.company.siret && (
              <Text style={styles.companyDetails}>N° Siret : {documentData.company.siret}</Text>
            )}
            {documentData.company.vatNumber && (
              <Text style={styles.companyDetails}>N° TVA intra. : {documentData.company.vatNumber}</Text>
            )}
          </View>

          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{documentData.client.name}</Text>
            {documentData.client.address && (
              <Text style={styles.companyDetails}>{documentData.client.address}</Text>
            )}
            {(documentData.client.postalCode || documentData.client.city) && (
              <Text style={styles.companyDetails}>
                {documentData.client.postalCode} {documentData.client.city}
              </Text>
            )}
            {documentData.client.siret && (
              <Text style={styles.companyDetails}>N° Siret : {documentData.client.siret}</Text>
            )}
            {documentData.client.vatNumber && (
              <Text style={styles.companyDetails}>N° TVA intra. : {documentData.client.vatNumber}</Text>
            )}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.descriptionCell]}>Description</Text>
            <Text style={[styles.tableCellHeader, styles.quantityCell]}>Qté</Text>
            <Text style={[styles.tableCellHeader, styles.priceCell]}>Prix unitaire</Text>
            <Text style={[styles.tableCellHeader, styles.vatCell]}>TVA (%)</Text>
            <Text style={[styles.tableCellHeader, styles.totalCell]}>Total HT</Text>
          </View>
          <TableRows />
        </View>

        <View style={styles.totalsSection}>
          <Text />

          <View style={styles.totalsTable}>
            <View style={{ textAlign: 'right', color: 'grey', marginBottom: 5 }}>
              {documentData.vatRate === 0 && (
                <Text style={styles.companyDetails}>TVA non applicable, art.293 B du CGI.</Text>
              )}
            </View>

            <View style={styles.totalsRow}>
              <Text>Total HT</Text>
              <Text>{formatCurrency(documentData.subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text>Total TVA</Text>
              <Text>{formatCurrency(documentData.vatAmount)}</Text>
            </View>
            <View style={styles.totalsRowFinal}>
              <Text>Total TTC</Text>
              <Text>{formatCurrency(documentData.total)}</Text>
            </View>
          </View>
        </View>

        {documentData.type === 'quote' && (
          <>
            <View style={styles.quoteConditions} wrap={false}>
              <View style={styles.conditionsBlock}>
                {documentData.paymentTerms && (
                  <>
                    <Text style={styles.conditionsTitle}>Conditions de règlement</Text>
                    {documentData.paymentTerms.split('\n').map((line, index) => (
                      <Text key={index} style={styles.conditionsText}>{line}</Text>
                    ))}
                  </>
                )}
              </View>
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureTitle}>Bon pour accord</Text>
                <Text style={styles.signatureText}>A ____________, le ___/___/_____</Text>
                <Text style={styles.signatureText}> </Text>
                <Text style={{ ...styles.signatureText, marginBottom: 70 }}>Signature et cachet</Text>
                <Text style={{ ...styles.signatureText, marginBottom: 15 }}>Qualité de signataire</Text>
              </View>
            </View>
            <Text style={styles.quoteDisclaimer}>
              La signature du présent devis vaut acceptation sans réserve des Conditions Générales de Vente en vigueur.
            </Text>
          </>
        )}

        <Footer />

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}, (prevProps, nextProps) => {
  // Comparaison personnalisée pour éviter les re-rendus inutiles
  const prev = prevProps.documentData;
  const next = nextProps.documentData;

  // Vérification rapide des références
  if (prev === next) return true;

  return (
    prev.type === next.type &&
    prev.number === next.number &&
    prev.date === next.date &&
    prev.dueDate === next.dueDate &&
    prev.dueDays === next.dueDays &&
    prev.expirationDate === next.expirationDate &&
    prev.vatRate === next.vatRate &&
    prev.subtotal === next.subtotal &&
    prev.vatAmount === next.vatAmount &&
    prev.total === next.total &&
    prev.notes === next.notes &&
    prev.bankName === next.bankName &&
    prev.iban === next.iban &&
    prev.bic === next.bic &&
    JSON.stringify(prev.company) === JSON.stringify(next.company) &&
    JSON.stringify(prev.client) === JSON.stringify(next.client) &&
    JSON.stringify(prev.lines) === JSON.stringify(next.lines)
  );
});

import type { DocumentLine, DocumentTotals } from './types';


export const calculateDocumentTotals = (lines: DocumentLine[], vatRate: number): DocumentTotals => {
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    vatAmount: Number(vatAmount.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  })
    .format(amount)
    // Remplace les espaces insécables fines (U+202F) et normales (U+00A0) par des espaces standard
    .replace(/\u202F|\u00A0/g, ' ');
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR');
};

export const getDocumentNumber = (type: 'quote' | 'invoice', number: number): string => {
  const prefix = type === 'quote' ? 'D' : 'F';
  const date = new Date();
  const year = date.getFullYear().toString();
  const paddedNumber = number.toString().padStart(3, '0');
  return `${prefix}-${year}-${paddedNumber}`;
};

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const calculateExpirationDate = (baseDate: string, days: number): string => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const exportToJSON = (data: any, filename: string): void => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `${filename}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

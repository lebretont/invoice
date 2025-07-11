export interface DocumentLine {
  id: string;
  title: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Company {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  siret: string;
  vatNumber: string;
}

export interface Client {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

export type ExpirationDays = 15 | 30 | 45;

export interface DocumentData {
  id: string;
  type: 'quote' | 'invoice';
  number: number;
  date: string;
  dueDate?: string;
  expirationDate?: string;
  expirationDays?: ExpirationDays;
  company: Company;
  client: Client;
  lines: DocumentLine[];
  vatRate: number;
  subtotal: number;
  vatAmount: number;
  total: number;
  notes?: string;
  bankName?: string;
  iban?: string;
  bic?: string;
}

export interface DocumentTotals {
  subtotal: number;
  vatAmount: number;
  total: number;
}
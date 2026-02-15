// Draft Invoice Types

export interface DraftInvoiceItem {
  id?: number;
  itemName: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
  category?: string;
}

export interface DraftBillFrom {
  email: string;
  fullName: string;
  phone: string;
  address: string;
}

export interface DraftBillTo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  customerType: string;
}

export interface DraftAppliedTax {
  id: number;
  taxName: string;
  taxRate: number;
  taxAmount: number;
}

export interface DraftInvoiceResponse {
  id: string;
  billFrom: DraftBillFrom;
  billTo: DraftBillTo;
  title: string;
  invoiceNumber: string;
  invoiceColor: string;
  logoUrl?: string;
  signatureUrl?: string;
  creationDate: string;
  dueDate: string;
  status: 'DRAFT' | 'UNPAID';
  currency: string;
  items: DraftInvoiceItem[];
  appliedTaxes: DraftAppliedTax[];
  subtotal: number;
  totalTaxAmount: number;
  totalDue: number;
  note?: string;
  termsAndConditions?: string;
  paymentTerms?: string;
  accountNumber?: string;
  accountName?: string;
  bank?: string;
}

export interface GetDraftResponse {
  success: boolean;
  data: DraftInvoiceResponse | 'no draft exists';
}

export interface SaveDraftRequest {
  fullName?: string;
  email?: string;
  address?: string;
  phone?: string;
  businessName?: string;
  title?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  currency?: string;
  invoiceColor?: string;
  clientId?: string;
  paymentTerms?: string;
  accountNumber?: string;
  accountName?: string;
  bank?: string;
  subtotal?: number;
  totalDue?: number;
  note?: string;
  termsAndConditions?: string;
  language?: string;
  logo?: File;
  signature?: File;
  items?: string;
  taxIds?: string;
}

export interface SendDraftErrorResponse {
  error: string;
  message: string;
}

// Invoice response types from backend API

// Dashboard Analytics Types
export interface DashboardStats {
  totalInvoicesSent: {
    amount: number;
    count: number;
    percentageChange: string;
  };
  paidInvoices: {
    amount: number;
    count: number;
    percentageChange: string;
  };
  pendingInvoices: {
    amount: number;
    count: number;
    percentageChange: string;
  };
  overdueInvoices: {
    amount: number;
    count: number;
    percentageChange: string;
  };
  statusDistribution: {
    paid: {
      amount: number;
      percentage: number;
    };
    pending: {
      amount: number;
      percentage: number;
    };
    overdue: {
      amount: number;
      percentage: number;
    };
  };
}

export interface PaymentTrend {
  period: string;
  periodLabel: string;
  totalAmount: number;
  invoiceCount: number;
}

export interface RecentInvoice {
  id: string;
  date: string;
  client: string;
  invoiceId: string;
  status: string;
  dueDate: string;
  amount: number;
  balance: number;
}

export interface InvoiceStatsResponse {
  totalReceived: number;
  paid: number;
  overdue: number;
  pending: number;
  unpaid: number;
}

export interface InvoiceSenderResponse {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
}

export interface ClientResponse {
  id: string;
  customerType: string;
  title: string;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  country?: string;
}

export interface InvoiceItemResponse {
  id: number;
  itemName: string;
  category?: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceResponse {
  id: string;
  billFrom: InvoiceSenderResponse;
  billTo: ClientResponse;
  title: string;
  invoiceNumber: string;
  invoiceColor: string;
  logoUrl?: string;
  signatureUrl?: string;
  creationDate: string; // ISO date string
  dueDate: string; // ISO date string
  status: string;
  currency: string;
  items: InvoiceItemResponse[];
  appliedTaxes?: InvoiceTaxResponse[]; // Invoice-level taxes
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

export interface InvoiceTaxResponse {
  taxId: string;
  taxName: string;
  taxType: string;
  appliedRate: number;
  taxAmount: number;
  taxableAmount: number;
}

export interface InvoiceListResponse {
  invoices: InvoiceResponse[];
  totalCount?: number;
  page?: number;
  size?: number;

}

export interface ApiResponse<T>{
  isSuccessful: boolean,
  data: T
}

// Received Invoice Types
export interface ReceivedInvoiceResponse {
  id: string;
  billFrom: {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    address: string;
  };
  billTo: {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    address: string;
  };
  title: string;
  invoiceNumber: string;
  invoiceColor: string;
  logoUrl: string;
  signatureUrl: string;
  paymentEvidenceUrl: string;
  creationDate: string;
  dueDate: string;
  status: "PAID" | "PENDING" | "UNPAID" | "OVERDUE" | "OUTSTANDING";
  currency: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  appliedTaxes: Array<{
    taxName: string;
    taxRate: number;
    taxAmount: number;
  }>;
  subtotal: number;
  totalTaxAmount: number;
  totalDue: number;
  note: string;
  termsAndConditions: string;
  paymentTerms: string;
  accountNumber: string;
  accountName: string;
  bank: string;
}
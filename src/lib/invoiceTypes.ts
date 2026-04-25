// Invoice Types for API Integration
// Maps UI form fields to backend request body for POST /api/invoices/add (multipart/form-data)

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
  businessName?: string;
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

export interface ApiResponse<T> {
  isSuccessful: boolean;
  data: T;
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

// Business Profile Types
export interface BusinessProfileDto {
  id?: string;
  businessName?: string;
  businessFullName?: string;
  registeredBusinessAddress?: string;
  emailAddress?: string;
  phoneNumber?: string;
  businessType?: string;
  country?: string;
  businessRegistrationNumber?: string;
  businessLogoUrl?: string | null;
  isDefault?: boolean;
  isActive?: boolean;
  invoicePrefix?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: number;               // Required for UI components
  itemName: string;
  category?: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
  tax?: number;            
  taxIds?: string[];       
}

export interface BillFrom {
  fullName: string;
  email: string;
  address: string;
  phoneNumber: string;
  businessName: string;
}

export interface BillTo {
  clientId: string;        // UUID of selected client (for data transfer only, not stored in invoice)
  title: string;           // Invoice title
  invoiceNumber: string;   // Invoice number (e.g., INV-0012)
  paymentTerms: string;
  invoiceDate: string;     // Format: YYYY-MM-DD
  dueDate: string;         // Format: YYYY-MM-DD
  email?: string;          // Recipient email (can be edited in send modal)
}

export interface PaymentDetails {
  accountNumber: string;
  accountName: string;
  bank: string;
}

export interface CreateInvoiceData {
  // Logo (binary file)
  logo?: File | null;
  
  // Bill From section
  billFrom: BillFrom;
  
  // Bill To section
  billTo: BillTo;
  
  // Items section
  items: InvoiceItem[];
  
  // Item IDs (optional - for existing items)
  itemIds?: number[];
  
  // Tax IDs (for invoice-level taxes)
  taxIds?: string[];
  
  // Additional fields
  note?: string;
  termsAndConditions?: string;
  signature?: File | null;
  
  // Settings
  language: string;
  currency: string;
  invoiceColor: string;
  
  // Totals
  subtotal: number;
  totalDue: number;
  
  // Payment details
  paymentDetails: PaymentDetails;
}


export function buildInvoiceFormData(data: CreateInvoiceData): FormData {
  const formData = new FormData();

  // Logo (binary file) - optional
  if (data.logo) {
    formData.append('logo', data.logo);
  }

  // Signature (binary file) - optional
  if (data.signature) {
    formData.append('signature', data.signature);
  }

  // Bill From section (flat fields as per Swagger)
  formData.append('fullName', data.billFrom.fullName);
  formData.append('email', data.billFrom.email);
  if (data.billFrom.address) {
    formData.append('address', data.billFrom.address);
  }
  formData.append('phone', data.billFrom.phoneNumber);
  formData.append('businessName', data.billFrom.businessName);

  // Bill To section (flat fields as per Swagger)
  formData.append('title', data.billTo.title || '');
  formData.append('invoiceNumber', data.billTo.invoiceNumber || '');
  formData.append('invoiceDate', data.billTo.invoiceDate);
  formData.append('clientId', data.billTo.clientId);
  if (data.billTo.dueDate) {
    formData.append('dueDate', data.billTo.dueDate);
  }
  formData.append('paymentTerms', data.billTo.paymentTerms || '');
  
  // Add receiver email if provided (for sending invoice notification)
  if (data.billTo.email) {
    formData.append('receiverEmail', data.billTo.email);
  }

  // Settings
  formData.append('currency', data.currency);
  formData.append('invoiceColor', data.invoiceColor || '#2F80ED');
  formData.append('language', data.language || 'English');

  // Payment details (flat fields as per Swagger)
  formData.append('accountNumber', data.paymentDetails.accountNumber || '');
  formData.append('accountName', data.paymentDetails.accountName || '');
  formData.append('bank', data.paymentDetails.bank || '');

  // Totals
  formData.append('subtotal', data.subtotal.toString());
  formData.append('totalDue', data.totalDue.toString());

  // Tax IDs (for invoice-level taxes)
  if (data.taxIds && data.taxIds.length > 0) {
    data.taxIds.forEach((taxId) => {
      formData.append('taxIds[]', taxId);
    });
  }

  // Additional fields (optional)
  if (data.note) {
    formData.append('note', data.note);
  }
  if (data.termsAndConditions) {
    formData.append('termsAndConditions', data.termsAndConditions);
  }

  // Item IDs (optional - for existing items)
  if (data.itemIds && data.itemIds.length > 0) {
    data.itemIds.forEach((id) => {
      formData.append('itemIds', id.toString());
    });
  }

  // Items array (for new items)
  if (data.items && data.items.length > 0) {
    data.items.forEach((item, index) => {
      formData.append(`items[${index}].id`, item.id.toString());
      formData.append(`items[${index}].itemName`, item.itemName);
      if (item.category) {
        formData.append(`items[${index}].category`, item.category);
      }
      if (item.description) {
        formData.append(`items[${index}].description`, item.description);
      }
      formData.append(`items[${index}].quantity`, item.quantity.toString());
      formData.append(`items[${index}].rate`, item.rate.toString());
      formData.append(`items[${index}].amount`, item.amount.toString());
      if (item.tax !== undefined) {
        formData.append(`items[${index}].tax`, item.tax.toString());
      }
      if (item.taxIds && item.taxIds.length > 0) {
        item.taxIds.forEach((taxId) => {
          formData.append(`items[${index}].taxIds`, taxId);
        });
      }
    });
  }

  return formData;
}

/**
 * Converts a base64 data URL (from canvas) to a File object
 * Useful for signature canvas data
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Converts a base64 logo string to a File object
 */
export function base64ToFile(base64String: string, filename: string): File | null {
  if (!base64String || !base64String.startsWith('data:')) {
    return null;
  }
  return dataURLtoFile(base64String, filename);
}

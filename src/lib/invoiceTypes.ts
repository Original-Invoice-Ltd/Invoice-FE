// Invoice Types for API Integration
// Maps UI form fields to backend request body for POST /api/invoices/add (multipart/form-data)

export interface InvoiceItem {
  id?: number;              // Long in backend (null for new items)
  itemName: string;
  category?: string;
  description?: string;
  quantity: number;
  rate: number;
  tax?: number;             // Legacy field for backward compatibility
  amount: number;
  taxIds?: string[];        // List of tax UUIDs to apply to this item
}

export interface BillFrom {
  fullName: string;
  email: string;
  address: string;
  phoneNumber: string;
  businessName: string;
}

export interface BillTo {
  clientId: string;        // UUID of selected client
  title: string;           // Invoice title
  invoiceNumber: string;   // Invoice number (e.g., INV-0012)
  paymentTerms: string;
  invoiceDate: string;     // Format: YYYY-MM-DD
  dueDate: string;         // Format: YYYY-MM-DD
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

/**
 * Builds FormData for invoice creation API call (multipart/form-data)
 * Maps UI form data to backend CreateInvoiceRequest structure
 * 
 * Backend field mapping (from Swagger UI):
 * - fullName: String
 * - email: String
 * - address: String (optional)
 * - phone: String
 * - businessName: String
 * - title: String
 * - invoiceNumber: String
 * - logo: MultipartFile (binary, optional)
 * - signature: MultipartFile (binary, optional)
 * - invoiceDate: LocalDate (string format: YYYY-MM-DD)
 * - clientId: UUID (string)
 * - dueDate: LocalDate (string format: YYYY-MM-DD)
 * - currency: String
 * - invoiceColor: String
 * - paymentTerms: String
 * - accountNumber: String
 * - accountName: String
 * - bank: String
 * - language: String
 * - subtotal: Double (number)
 * - totalDue: Double (number)
 * - note: String (optional)
 * - termsAndConditions: String (optional)
 * - itemIds: Array of Long (optional)
 * - items: Array of InvoiceItemRequest
 */
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
      if (item.id) {
        formData.append(`items[${index}].id`, item.id.toString());
      }
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

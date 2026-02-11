import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api';
import { DraftInvoiceResponse } from '@/types/draft';

export interface DraftData {
  billFrom: {
    fullName: string;
    email: string;
    address: string;
    phoneNumber: string;
    businessName: string;
  };
  billTo: {
    customer: string;
    title: string;
    invoiceNumber: string;
    paymentTerms: string;
    invoiceDate: string;
    dueDate: string;
  };
  items: Array<{
    id: number;
    itemName: string;
    quantity: number;
    rate: number;
    amount: number;
    description?: string;
  }>;
  customerNote: string;
  termsAndConditions: string;
  currency: string;
  language: string;
  color: string;
  template: string;
  logo: string | null;
  signature: string | null;
  paymentDetails: {
    bankAccount: string;
    accountName: string;
    accountNumber: string;
  };
  vat: number;
  wht: number;
  selectedClientId: string;
  invoiceTaxRate: number;
}

export const useDraft = () => {
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const loadDraft = useCallback(async (): Promise<DraftInvoiceResponse | null> => {
    setIsLoadingDraft(true);
    setDraftError(null);
    
    try {
      const response = await ApiClient.getDraft();
      
      if (response.status === 200 && response.data) {
        if (response.data.success && response.data.data !== "no draft exists") {
          setHasDraft(true);
          return response.data.data as DraftInvoiceResponse;
        } else {
          setHasDraft(false);
          return null;
        }
      } else {
        setHasDraft(false);
        return null;
      }
    } catch (error) {
      setDraftError('Failed to load draft');
      setHasDraft(false);
      return null;
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  const saveDraft = useCallback(async (draftData: DraftData) => {
    setIsSavingDraft(true);
    setDraftError(null);

    try {
      const formData = new FormData();

      formData.append('fullName', draftData.billFrom.fullName || '');
      formData.append('email', draftData.billFrom.email || '');
      formData.append('address', draftData.billFrom.address || '');
      formData.append('phone', draftData.billFrom.phoneNumber || '');
      formData.append('businessName', draftData.billFrom.businessName || '');
      formData.append('title', draftData.billTo.title || '');
      formData.append('invoiceNumber', draftData.billTo.invoiceNumber || '');
      formData.append('invoiceDate', draftData.billTo.invoiceDate || '');
      formData.append('dueDate', draftData.billTo.dueDate || '');
      formData.append('paymentTerms', draftData.billTo.paymentTerms || '');
      
      if (draftData.selectedClientId) {
        formData.append('clientId', draftData.selectedClientId);
      }

      formData.append('currency', draftData.currency || 'NGN');
      formData.append('invoiceColor', draftData.color || '#2F80ED');
      formData.append('language', draftData.language || 'English');
      formData.append('note', draftData.customerNote || '');
      formData.append('termsAndConditions', draftData.termsAndConditions || '');

      formData.append('accountNumber', draftData.paymentDetails.accountNumber || '');
      formData.append('accountName', draftData.paymentDetails.accountName || '');
      formData.append('bank', draftData.paymentDetails.bankAccount || '');
      const subtotal = draftData.items.reduce((sum, item) => sum + item.amount, 0);
      const totalDue = subtotal;
    
      formData.append('subtotal', subtotal.toString());
      formData.append('totalDue', totalDue.toString());

      if (draftData.items.length > 0) {
        formData.append('items', JSON.stringify(draftData.items.map(item => ({
          itemName: item.itemName,
          description: item.description || '',
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }))));
      }

      if (draftData.logo && draftData.logo.startsWith('data:')) {
        const logoBlob = await fetch(draftData.logo).then(r => r.blob());
        formData.append('logo', logoBlob, 'logo.png');
      }

      if (draftData.signature && draftData.signature.startsWith('data:')) {
        const signatureBlob = await fetch(draftData.signature).then(r => r.blob());
        formData.append('signature', signatureBlob, 'signature.png');
      }

      const response = await ApiClient.saveDraft(formData);

      if (response.status === 200) {
        setHasDraft(true);
        return { success: true, data: response.data };
      } else {
        setDraftError(response.error || 'Failed to save draft');
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Error = ", error)
      setDraftError('Failed to save draft');
      return { success: false, error: 'Failed to save draft' };
    } finally {
      setIsSavingDraft(false);
    }
  }, []);

  const sendDraft = useCallback(async () => {
    try {
      const response = await ApiClient.sendDraft();
      
      if (response.status === 200) {
        setHasDraft(false);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to send draft' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to send draft' };
    }
  }, []);

  return {
    loadDraft,
    saveDraft,
    sendDraft,
    isLoadingDraft,
    isSavingDraft,
    hasDraft,
    draftError,
  };
};

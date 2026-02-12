import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api';
import { DraftInvoiceResponse } from '@/types/draft';
import { buildInvoiceFormData, CreateInvoiceData, dataURLtoFile, base64ToFile } from '@/lib/invoiceTypes';

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
  const [lastSavedDraft, setLastSavedDraft] = useState<DraftData | null>(null);
  const [loadedDraftData, setLoadedDraftData] = useState<DraftData | null>(null);

  const loadDraft = useCallback(async (): Promise<DraftInvoiceResponse | null> => {
    setIsLoadingDraft(true);
    setDraftError(null);
    
    try {
      const response = await ApiClient.getDraft();
      
      if (response.status === 200 && response.data) {
        if (response.data.success && response.data.data !== "no draft exists") {
          const draftResponse = response.data.data as DraftInvoiceResponse;
          setHasDraft(true);
          
          const loadedDraftData: DraftData = {
            billFrom: {
              fullName: draftResponse.billFrom.fullName,
              email: draftResponse.billFrom.email,
              address: draftResponse.billFrom.address,
              phoneNumber: draftResponse.billFrom.phone,
              businessName: draftResponse.billTo.businessName || draftResponse.billFrom.fullName,
            },
            billTo: {
              customer: draftResponse.billTo.fullName,
              title: draftResponse.title,
              invoiceNumber: draftResponse.invoiceNumber,
              paymentTerms: draftResponse.paymentTerms || '',
              invoiceDate: draftResponse.creationDate,
              dueDate: draftResponse.dueDate,
            },
            items: draftResponse.items.map(item => ({
              id: item.id || Date.now(),
              itemName: item.itemName,
              quantity: item.quantity,
              rate: item.rate,
              amount: item.amount,
              description: item.description,
            })),
            customerNote: draftResponse.note || '',
            termsAndConditions: draftResponse.termsAndConditions || '',
            currency: draftResponse.currency,
            language: 'English',
            color: draftResponse.invoiceColor,
            template: 'default',
            logo: draftResponse.logoUrl || null,
            signature: draftResponse.signatureUrl || null,
            paymentDetails: {
              bankAccount: draftResponse.bank || '',
              accountName: draftResponse.accountName || '',
              accountNumber: draftResponse.accountNumber || '',
            },
            vat: 0,
            wht: 0,
            selectedClientId: draftResponse.billTo.id,
            invoiceTaxRate: 0,
          };
          
          console.log('Transformed draft data:', loadedDraftData); // Debug log
          setLastSavedDraft(loadedDraftData);
          setLoadedDraftData(loadedDraftData);
          return draftResponse;
        } else {
          setHasDraft(false);
          setLastSavedDraft(null);
          setLoadedDraftData(null);
          return null;
        }
      } else {
        setHasDraft(false);
        setLastSavedDraft(null);
        setLoadedDraftData(null);
        return null;
      }
    } catch (error) {
      setDraftError('Failed to load draft');
      setHasDraft(false);
      setLastSavedDraft(null);
      setLoadedDraftData(null);
      return null;
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  const isDraftDataEqual = useCallback((data1: DraftData, data2: DraftData): boolean => {
    if (
      data1.currency !== data2.currency ||
      data1.language !== data2.language ||
      data1.color !== data2.color ||
      data1.template !== data2.template ||
      data1.customerNote !== data2.customerNote ||
      data1.termsAndConditions !== data2.termsAndConditions ||
      data1.vat !== data2.vat ||
      data1.wht !== data2.wht ||
      data1.selectedClientId !== data2.selectedClientId ||
      data1.invoiceTaxRate !== data2.invoiceTaxRate
    ) {
      return false;
    }

    const bf1 = data1.billFrom;
    const bf2 = data2.billFrom;
    if (
      bf1.fullName !== bf2.fullName ||
      bf1.email !== bf2.email ||
      bf1.address !== bf2.address ||
      bf1.phoneNumber !== bf2.phoneNumber ||
      bf1.businessName !== bf2.businessName
    ) {
      return false;
    }

    const bt1 = data1.billTo;
    const bt2 = data2.billTo;
    if (
      bt1.customer !== bt2.customer ||
      bt1.title !== bt2.title ||
      bt1.invoiceNumber !== bt2.invoiceNumber ||
      bt1.paymentTerms !== bt2.paymentTerms ||
      bt1.invoiceDate !== bt2.invoiceDate ||
      bt1.dueDate !== bt2.dueDate
    ) {
      return false;
    }

    const pd1 = data1.paymentDetails;
    const pd2 = data2.paymentDetails;
    if (
      pd1.bankAccount !== pd2.bankAccount ||
      pd1.accountName !== pd2.accountName ||
      pd1.accountNumber !== pd2.accountNumber
    ) {
      return false;
    }

    if ((data1.logo || '') !== (data2.logo || '')) {
      return false;
    }
    if ((data1.signature || '') !== (data2.signature || '')) {
      return false;
    }

    if (data1.items.length !== data2.items.length) {
      return false;
    }

    for (let i = 0; i < data1.items.length; i++) {
      const item1 = data1.items[i];
      const item2 = data2.items[i];
      
      if (
        item1.itemName !== item2.itemName ||
        item1.quantity !== item2.quantity ||
        item1.rate !== item2.rate ||
        item1.amount !== item2.amount ||
        (item1.description || '') !== (item2.description || '')
      ) {
        return false;
      }
    }

    return true;
  }, []);

  const saveDraft = useCallback(async (draftData: DraftData) => {
 
    if (lastSavedDraft && isDraftDataEqual(draftData, lastSavedDraft)) {
      return { success: true, data: null, unchanged: true };
    } 

    setIsSavingDraft(true);
    setDraftError(null);

    try {
      let logoFile: File | null = null;
      if (draftData.logo) {
        logoFile = base64ToFile(draftData.logo, 'logo.png');
      }

      let signatureFile: File | null = null;
      if (draftData.signature) {
        signatureFile = dataURLtoFile(draftData.signature, 'signature.png');
      }

      const subtotal = draftData.items.reduce((sum, item) => sum + item.amount, 0);
      const totalDue = subtotal;

      const invoiceData: CreateInvoiceData = {
        logo: logoFile,
        billFrom: {
          fullName: draftData.billFrom.fullName,
          email: draftData.billFrom.email,
          address: draftData.billFrom.address,
          phoneNumber: draftData.billFrom.phoneNumber,
          businessName: draftData.billFrom.businessName,
        },
        billTo: {
          clientId: draftData.selectedClientId,
          title: draftData.billTo.title,
          invoiceNumber: draftData.billTo.invoiceNumber,
          paymentTerms: draftData.billTo.paymentTerms,
          invoiceDate: draftData.billTo.invoiceDate,
          dueDate: draftData.billTo.dueDate,
        },
        items: draftData.items.map(item => ({
          id: item.id,
          itemName: item.itemName,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          description: item.description,
        })),
        note: draftData.customerNote,
        termsAndConditions: draftData.termsAndConditions,
        signature: signatureFile,
        language: draftData.language,
        currency: draftData.currency,
        invoiceColor: draftData.color,
        subtotal: subtotal,
        totalDue: totalDue,
        paymentDetails: {
          accountNumber: draftData.paymentDetails.accountNumber,
          accountName: draftData.paymentDetails.accountName,
          bank: draftData.paymentDetails.bankAccount,
        },
      };

      // Build FormData using the same function as createInvoice
      const formData = buildInvoiceFormData(invoiceData);

      const response = await ApiClient.saveDraft(formData);

      if (response.status === 200) {
        setHasDraft(true);
        setLastSavedDraft(draftData);
        setLoadedDraftData(draftData);
        return { success: true, data: response.data };
      } else {
        setDraftError(response.error || 'Failed to save draft');
        return { success: false, error: response.error };
      }
    } catch (error) {
      setDraftError('Failed to save draft');
      return { success: false, error: 'Failed to save draft' };
    } finally {
      setIsSavingDraft(false);
    }
  }, [lastSavedDraft, isDraftDataEqual]);

  const sendDraft = useCallback(async () => {
    try {
      const response = await ApiClient.sendDraft();
      
      if (response.status === 200) {
        setHasDraft(false);
        setLastSavedDraft(null);
        setLoadedDraftData(null);
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
    loadedDraftData,
  };
};

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { InvoiceResponse, InvoiceStatsResponse } from '@/types/invoice';

interface UseCustomerInvoicesResult {
  invoices: InvoiceResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCustomerInvoices = (): UseCustomerInvoicesResult => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiClient.getAllUserInvoices();
      
      if (response.status === 200 && response.data) {
        setInvoices(response.data);
      } else {
        setError(response.error || 'Failed to fetch invoices');
      }
    } catch (err) {
      setError('An error occurred while fetching invoices');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoices,
  };
};

interface UseInvoiceStatsResult {
  stats: InvoiceStatsResponse;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInvoiceStats = (email?: string): UseInvoiceStatsResult => {
  const [stats, setStats] = useState<InvoiceStatsResponse>({
    totalReceived: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    unpaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ApiClient.getInvoiceStats(email);
      
      if (response.status === 200 && response.data) {
        setStats({
          totalReceived: response.data.totalReceived || 0,
          paid: response.data.paid || 0,
          pending: response.data.pending || 0,
          overdue: response.data.overdue || 0,
          unpaid: response.data.unpaid || 0,
        });
      } else {
        setError(response.error || 'Failed to load statistics');
      }
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Failed to fetch invoice stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [email]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

interface UseInvoiceByIdResult {
  invoice: InvoiceResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInvoiceById = (id: string): UseInvoiceByIdResult => {
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = async () => {
    if (!id) {
      setError('Invalid invoice ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ApiClient.getInvoiceById(id);
      
      if (response.status === 200 && response.data) {
        setInvoice(response.data as InvoiceResponse);
      } else {
        setError(response.error || 'Failed to fetch invoice');
      }
    } catch (err) {
      setError('An error occurred while fetching the invoice');
      console.error('Error fetching invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  return {
    invoice,
    loading,
    error,
    refetch: fetchInvoice,
  };
};

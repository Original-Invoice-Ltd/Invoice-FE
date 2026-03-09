import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '@/lib/api';
import { DashboardStats, PaymentTrend, RecentInvoice } from '@/types/invoice';

interface DashboardData {
  stats: DashboardStats | null;
  paymentTrends: PaymentTrend[] | null;
  recentInvoices: RecentInvoice[] | null;
}

interface UseDashboardReturn {
  data: DashboardData;
  loading: {
    stats: boolean;
    trends: boolean;
    invoices: boolean;
  };
  error: string | null;
  refreshStats: () => Promise<void>;
  refreshTrends: (period: 'month' | 'year') => Promise<void>;
  refreshInvoices: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const useDashboard = (
  initialTrendsPeriod: 'month' | 'year' = 'month',
  recentLimit: number = 5
): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    paymentTrends: null,
    recentInvoices: null,
  });
  
  const [loading, setLoading] = useState({
    stats: true,
    trends: true,
    invoices: true,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Fetch dashboard stats (independent of period)
  const fetchStats = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      setError(null);

      const statsResponse = await ApiClient.getDashboardStats();
      
      if (statsResponse.status !== 200) {
        throw new Error(statsResponse.error || 'Failed to fetch dashboard stats');
      }

      setData(prev => ({ ...prev, stats: statsResponse.data }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Dashboard stats fetch error:', err);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, []);

  // Fetch payment trends (period-dependent) - only update trends loading state
  const fetchTrends = useCallback(async (period: 'month' | 'year') => {
    try {
      setLoading(prev => ({ ...prev, trends: true }));
      // Don't clear error for trends-only updates to avoid affecting other components
      
      const trendsResponse = await ApiClient.getPaymentTrends(period);
      
      if (trendsResponse.status !== 200) {
        throw new Error(trendsResponse.error || 'Failed to fetch payment trends');
      }

      setData(prev => ({ ...prev, paymentTrends: trendsResponse.data }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trends';
      // Only set error if this is initial load, not a period change
      if (!hasInitialLoad) {
        setError(errorMessage);
      }
      console.error('Payment trends fetch error:', err);
    } finally {
      setLoading(prev => ({ ...prev, trends: false }));
    }
  }, [hasInitialLoad]);

  // Fetch recent invoices (independent of period)
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, invoices: true }));
      setError(null);

      const invoicesResponse = await ApiClient.getRecentInvoices(recentLimit);
      
      if (invoicesResponse.status !== 200) {
        throw new Error(invoicesResponse.error || 'Failed to fetch recent invoices');
      }

      setData(prev => ({ ...prev, recentInvoices: invoicesResponse.data }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoices';
      setError(errorMessage);
      console.error('Recent invoices fetch error:', err);
    } finally {
      setLoading(prev => ({ ...prev, invoices: false }));
    }
  }, [recentLimit]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchTrends(initialTrendsPeriod),
      fetchInvoices(),
    ]);
    setHasInitialLoad(true);
  }, [fetchStats, fetchTrends, fetchInvoices, initialTrendsPeriod]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    loading,
    error,
    refreshStats: fetchStats,
    refreshTrends: fetchTrends,
    refreshInvoices: fetchInvoices,
    refreshAll: fetchAllData,
  };
};

// Auto-refresh hook for dashboard data
// export const useAutoRefreshDashboard = (
//   refreshFn: () => Promise<void>,
//   interval: number = 300000 // 5 minutes default
// ) => {
//   useEffect(() => {
//     const timer = setInterval(refreshFn, interval);
//     return () => clearInterval(timer);
//   }, [refreshFn, interval]);
// };
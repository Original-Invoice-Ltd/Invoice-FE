"use client";

import { useState, useEffect } from "react";
import ReportsHeader from "./ReportsHeader";
import KPICards from "./KPICards";
import RevenueChart, { StatusChart } from "./RevenueChart";
import RecentInvoicesTable from "./RecentInvoicesTable";
import { KPICardData } from "./types";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import Link from 'next/link';

const ReportsAnalytics = () => {
  const { user, loading: userLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [trendsPeriod, setTrendsPeriod] = useState<'month' | 'year'>('month');
  const { hasAccess, getFeatureUpgradeMessage } = usePlanAccess();
  
  // Use the same dashboard hook to fetch data
  const { data, loading, error, refreshTrends } = useDashboard('month', 10);

  // Format currency with abbreviations for large numbers
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    
    if (absAmount >= 1_000_000_000) {
      // Billions
      const billions = amount / 1_000_000_000;
      return `₦${billions.toFixed(billions >= 10 ? 0 : 1)}B`;
    } else if (absAmount >= 1_000_000) {
      // Millions
      const millions = amount / 1_000_000;
      return `₦${millions.toFixed(millions >= 10 ? 0 : 1)}M`;
    } else if (absAmount >= 1_000) {
      // Thousands
      const thousands = amount / 1_000;
      return `₦${thousands.toFixed(thousands >= 10 ? 0 : 1)}K`;
    }
    
    return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleTrendsPeriodChange = async () => {
    const newPeriod = trendsPeriod === 'month' ? 'year' : 'month';
    setTrendsPeriod(newPeriod);
    await refreshTrends(newPeriod);
  };

  const kpiCards: KPICardData[] = [
    {
      title: "Total Invoiced",
      value: loading.stats ? "Loading..." : (data.stats ? formatCurrency(data.stats.totalInvoicesSent.amount) : "₦0"),
    },
    {
      title: "Payments Received", 
      value: loading.stats ? "Loading..." : (data.stats ? formatCurrency(data.stats.paidInvoices.amount) : "₦0"),
    },
    {
      title: "Outstanding Amount",
      value: loading.stats ? "Loading..." : (data.stats ? formatCurrency(data.stats.pendingInvoices.amount) : "₦0"),
      badge: { text: "Pending", color: "yellow" },
    },
    {
      title: "Overdue Amount",
      value: loading.stats ? "Loading..." : (data.stats ? formatCurrency(data.stats.overdueInvoices.amount) : "₦0"),
      badge: { text: "Overdue", color: "red" },
    },
  ];

  // Transform payment trends data for chart
  const getChartData = () => {
    if (!data.paymentTrends) return [];
    return data.paymentTrends.map(trend => ({
      month: trend.periodLabel.split(' ')[0], // Extract month name
      revenue: trend.totalAmount
    }));
  };

  // Transform status distribution for pie chart
  const getStatusDistributionData = () => {
    if (!data.stats?.statusDistribution) return [];
    
    const { paid, pending, overdue } = data.stats.statusDistribution;
    return [
      { 
        name: 'Paid', 
        value: paid.amount, 
        color: '#10B981', 
        percentage: `${paid.percentage.toFixed(1)}%`,
        change: `+${paid.percentage.toFixed(1)}%` 
      },
      { 
        name: 'Pending', 
        value: pending.amount, 
        color: '#3B82F6', 
        percentage: `${pending.percentage.toFixed(1)}%`,
        change: `+${pending.percentage.toFixed(1)}%` 
      },
      { 
        name: 'Overdue', 
        value: overdue.amount, 
        color: '#EF4444', 
        percentage: `${overdue.percentage.toFixed(1)}%`,
        change: `+${overdue.percentage.toFixed(1)}%` 
      },
    ];
  };

  // Transform recent invoices data
  const getRecentInvoicesData = () => {
    if (!data.recentInvoices) return [];
    
    return data.recentInvoices.map(invoice => ({
      id: invoice.id,
      date: new Date(invoice.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      clientName: invoice.client,
      invoiceId: invoice.invoiceId,
      status: invoice.status as 'Paid' | 'Pending' | 'Overdue',
      dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      amount: invoice.amount,
      balanceDue: invoice.balance
    }));
  };

  const chartData = getChartData();
  const statusDistributionData = getStatusDistributionData();
  const recentInvoicesData = getRecentInvoicesData();

  // Loading state - show skeleton loaders that maintain sizes
  const isInitialLoading = loading.stats && loading.trends && loading.invoices;
  
  if (isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto mb-[200px] p-6">
        <div className="animate-pulse">
          <ReportsHeader />
          
          {/* KPI Cards skeleton */}
          <div className="flex mb-6 w-full max-w-[1108px] h-[119px] gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 bg-white p-6 rounded-xl border border-[#E4E7EC]">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          {/* Charts skeleton */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6 w-full">
            <div className="w-full lg:w-[692px] bg-white p-4 rounded-xl border border-[#E4E7EC]">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-[280px] bg-gray-100 rounded"></div>
            </div>
            <div className="w-full lg:w-[392px] bg-white p-4 rounded-xl border border-[#E4E7EC]">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-[280px] bg-gray-100 rounded"></div>
            </div>
          </div>
          
          {/* Table skeleton */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-[200px] bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto mb-[200px] p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Reports</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mb-[200px] p-6">
        <ReportsHeader />

        <KPICards data={kpiCards} />

        {hasAccess('advancedAnalytics') ? (
          <div className="flex flex-col lg:flex-row gap-6 mb-6 w-full">
            <div className="w-full lg:w-[692px]">
              <RevenueChart 
                data={chartData} 
                isEmpty={chartData.length === 0}
                period={trendsPeriod}
                onPeriodChange={handleTrendsPeriodChange}
                loading={loading.trends}
              />
            </div>
            <div className="w-full lg:w-[392px]">
              <StatusChart 
                data={statusDistributionData} 
                isEmpty={statusDistributionData.length === 0} 
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 mb-6 w-full">
            <div className="w-full lg:w-[692px] bg-white p-4 rounded-xl border border-[#E4E7EC] relative">
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 p-6">
                <div className="text-center max-w-md">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#101828] mb-2">Advanced Analytics</h3>
                  <p className="text-sm text-[#667085] mb-4">{getFeatureUpgradeMessage('advancedAnalytics')}</p>
                  <Link 
                    href="/dashboard/pricing"
                    className="inline-block px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] transition-colors"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
              <div className="opacity-20 pointer-events-none">
                <RevenueChart 
                  data={chartData} 
                  isEmpty={chartData.length === 0}
                  period={trendsPeriod}
                  onPeriodChange={handleTrendsPeriodChange}
                  loading={loading.trends}
                />
              </div>
            </div>
            <div className="w-full lg:w-[392px] bg-white p-4 rounded-xl border border-[#E4E7EC] relative">
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 p-6">
                <div className="text-center max-w-md">
                  <div className="mb-4">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <p className="text-xs text-[#667085] mb-3">Premium Feature</p>
                  <Link 
                    href="/dashboard/pricing"
                    className="inline-block px-4 py-2 bg-[#2F80ED] text-white rounded-lg text-xs font-medium hover:bg-[#2563EB] transition-colors"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
              <div className="opacity-20 pointer-events-none">
                <StatusChart 
                  data={statusDistributionData} 
                  isEmpty={statusDistributionData.length === 0} 
                />
              </div>
            </div>
          </div>
        )}

        <RecentInvoicesTable
          invoices={recentInvoicesData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
    </div>
  );
};

export default ReportsAnalytics;

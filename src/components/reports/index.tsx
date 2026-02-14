"use client";

import { useState, useEffect } from "react";
import ReportsHeader from "./ReportsHeader";
import KPICards from "./KPICards";
import RevenueChart, { StatusChart } from "./RevenueChart";
import RecentInvoicesTable from "./RecentInvoicesTable";
import { KPICardData } from "./types";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';

const ReportsAnalytics = () => {
  const { user, loading: userLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [trendsPeriod, setTrendsPeriod] = useState<'month' | 'year'>('month');
  
  // Use the same dashboard hook to fetch data
  const { data, loading, error, refreshTrends } = useDashboard('month', 10);

  const handleTrendsPeriodChange = async () => {
    const newPeriod = trendsPeriod === 'month' ? 'year' : 'month';
    setTrendsPeriod(newPeriod);
    await refreshTrends(newPeriod);
  };

  const kpiCards: KPICardData[] = [
    {
      title: "Total Invoiced",
      value: loading.stats ? "Loading..." : (data.stats ? `₦${data.stats.totalInvoicesSent.amount.toLocaleString()}` : "₦0"),
    },
    {
      title: "Payments Received", 
      value: loading.stats ? "Loading..." : (data.stats ? `₦${data.stats.paidInvoices.amount.toLocaleString()}` : "₦0"),
    },
    {
      title: "Outstanding Amount",
      value: loading.stats ? "Loading..." : (data.stats ? `₦${data.stats.pendingInvoices.amount.toLocaleString()}` : "₦0"),
      badge: { text: "Pending", color: "yellow" },
    },
    {
      title: "Overdue Amount",
      value: loading.stats ? "Loading..." : (data.stats ? `₦${data.stats.overdueInvoices.amount.toLocaleString()}` : "₦0"),
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

        <RecentInvoicesTable
          invoices={recentInvoicesData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
    </div>
  );
};

export default ReportsAnalytics;

"use client";

import { Search, ChevronDown, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
    useDashboard,
    // useAutoRefreshDashboard
} from '@/hooks/useDashboard';
import { useTranslation } from 'react-i18next';

const DashboardContent = () => {
    const { user, loading: userLoading } = useAuth();
    const { t } = useTranslation();
    const [isClient, setIsClient] = useState(false);
    const [trendsPeriod, setTrendsPeriod] = useState<'month' | 'year'>('month');
    
    // Fetch dashboard data with separated loading states
    const { data, loading, error, refreshTrends, refreshAll } = useDashboard('month', 5);
    
    // Auto-refresh all data every 5 minutes
    // useAutoRefreshDashboard(refreshAll);

    // Handle trends period change - only refresh trends data
    const handleTrendsPeriodChange = async () => {
        const newPeriod = trendsPeriod === 'month' ? 'year' : 'month';
        setTrendsPeriod(newPeriod);
        await refreshTrends(newPeriod);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Get user's first name for welcome message - wait for user to load
    const getFirstName = () => {
        if (userLoading) return t('loading');
        if (!user?.fullName) return 'User';
        return user.fullName.split(' ')[0];
    };

    // Transform payment trends data for chart
    const getChartData = () => {
        if (!data.paymentTrends) return [];
        return data.paymentTrends.map(trend => ({
            month: trend.periodLabel.split(' ')[0], // Extract month name
            value: trend.totalAmount
        }));
    };

    // Transform status distribution for pie chart
    const getStatusDistributionData = () => {
        if (!data.stats?.statusDistribution) return [];
        
        const { paid, pending, overdue } = data.stats.statusDistribution;
        return [
            { 
                name: t('paid'),
                value: paid.amount, 
                color: '#10B981', 
                percentage: `+${paid.percentage.toFixed(1)}%` 
            },
            { 
                name: t('pending'),
                value: pending.amount, 
                color: '#3B82F6', 
                percentage: `+${pending.percentage.toFixed(1)}%` 
            },
            { 
                name: t('overdue'),
                value: overdue.amount, 
                color: '#EF4444', 
                percentage: `+${overdue.percentage.toFixed(1)}%` 
            },
        ];
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PAID':
                return 'bg-[#ECFDF5] text-[#10B981]';
            case 'PENDING':
                return 'bg-[#FEF3C7] text-[#F59E0B]';
            case 'OVERDUE':
                return 'bg-[#FEE2E2] text-[#EF4444]';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    // Loading state - show skeleton loaders that maintain sizes
    const isInitialLoading = loading.stats && loading.trends && loading.invoices;
    
    if (isInitialLoading) {
        return (
            <div className="max-w-7xl mx-auto mb-[200px] p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    
                    {/* Action buttons skeleton */}
                    <div className="flex gap-3 mb-6">
                        <div className="h-12 bg-gray-200 rounded w-24"></div>
                        <div className="h-12 bg-gray-200 rounded w-32"></div>
                    </div>
                    
                    {/* Stats cards skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Charts skeleton */}
                    <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] mb-6">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-[280px] bg-gray-100 rounded"></div>
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
                    <h3 className="text-red-800 font-medium mb-2">{t('error_loading_invoices')}</h3>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <button 
                        onClick={refreshAll}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const chartData = getChartData();
    const statusDistributionData = getStatusDistributionData();

    return (
        <div className="max-w-7xl mx-auto mb-[200px] p-6">
            {/* Welcome Section */}
            <div className="mb-6">
                <h1 className="text-xl lg:text-2xl font-semibold text-[#101828] mb-1">
                    {userLoading ? (
                        <span className="inline-flex items-center gap-2">
                            {t('home')}, 
                            <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                        </span>
                    ) : (
                        `${t('home')}, ${getFirstName()}`
                    )}
                </h1>
                <p className="text-sm text-[#667085]">{t('performance_glance')}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <Link href="/dashboard/clients" className="flex-1 lg:flex-none lg:px-6 border border-[#2F80ED] text-[#2F80ED] rounded-lg text-sm font-medium hover:bg-[#EFF8FF] h-12 flex items-center justify-center">
                    {t('add_client')}
                </Link>
                <Link href="/dashboard/invoices/create" className="flex-1 lg:flex-none lg:px-6 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] h-12 flex items-center justify-center gap-2">
                    <Plus size={18} />
                    {t('create_invoice')}
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                    <p className="text-sm text-[#667085] mb-2">{t('total_invoiced')}</p>
                    {loading.stats ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between">
                            <h3 className="text-xl lg:text-2xl font-semibold text-[#101828]">
                                {data.stats ? formatCurrency(data.stats.totalInvoicesSent.amount) : '₦0'}
                            </h3>
                            {data.stats?.totalInvoicesSent.percentageChange && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                    data.stats.totalInvoicesSent.percentageChange.startsWith('+') 
                                        ? 'text-[#10B981] bg-[#ECFDF5]' 
                                        : 'text-[#EF4444] bg-[#FEE2E2]'
                                }`}>
                                    {data.stats.totalInvoicesSent.percentageChange}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                    <p className="text-sm text-[#667085] mb-2">{t('payments_received_total')}</p>
                    {loading.stats ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between">
                            <h3 className="text-xl lg:text-2xl font-semibold text-[#101828]">
                                {data.stats ? formatCurrency(data.stats.paidInvoices.amount) : '₦0'}
                            </h3>
                            {data.stats?.paidInvoices.percentageChange && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                    data.stats.paidInvoices.percentageChange.startsWith('+') 
                                        ? 'text-[#10B981] bg-[#ECFDF5]' 
                                        : 'text-[#EF4444] bg-[#FEE2E2]'
                                }`}>
                                    {data.stats.paidInvoices.percentageChange}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                    <p className="text-sm text-[#667085] mb-2">{t('pending')}</p>
                    {loading.stats ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between">
                            <h3 className="text-xl lg:text-2xl font-semibold text-[#101828]">
                                {data.stats ? formatCurrency(data.stats.pendingInvoices.amount) : '₦0'}
                            </h3>
                            {data.stats?.pendingInvoices.percentageChange && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                    data.stats.pendingInvoices.percentageChange.startsWith('+') 
                                        ? 'text-[#10B981] bg-[#ECFDF5]' 
                                        : 'text-[#EF4444] bg-[#FEE2E2]'
                                }`}>
                                    {data.stats.pendingInvoices.percentageChange}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                    <p className="text-sm text-[#667085] mb-2">{t('overdue')}</p>
                    {loading.stats ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between">
                            <h3 className="text-xl lg:text-2xl font-semibold text-[#101828]">
                                {data.stats ? formatCurrency(data.stats.overdueInvoices.amount) : '₦0'}
                            </h3>
                            {data.stats?.overdueInvoices.percentageChange && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                    data.stats.overdueInvoices.percentageChange.startsWith('+') 
                                        ? 'text-[#EF4444] bg-[#FEE2E2]' 
                                        : 'text-[#10B981] bg-[#ECFDF5]'
                                }`}>
                                    {data.stats.overdueInvoices.percentageChange}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Trends - Mobile & Desktop */}
            <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base lg:text-lg font-semibold text-[#101828]">{t('track_payments_title')}</h3>
                    <button 
                        onClick={handleTrendsPeriodChange}
                        disabled={loading.trends}
                        className="flex items-center gap-2 text-xs lg:text-sm text-[#667085] hover:text-[#2F80ED] disabled:opacity-50"
                    >
                        {trendsPeriod === 'month' ? t('monthly') : t('annually')}
                        <ChevronDown size={16} />
                    </button>
                </div>
                <div className="w-full h-[200px] lg:h-[280px]" style={{ minWidth: '300px', minHeight: '200px' }}>
                    {loading.trends ? (
                        <div className="animate-pulse h-full bg-gray-100 rounded flex items-center justify-center">
                            <div className="text-gray-400">{t('loading')}</div>
                        </div>
                    ) : isClient && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E8E9ED" />
                                <XAxis 
                                    dataKey="month" 
                                    tick={{ fill: '#333436', fontSize: 10 }}
                                    axisLine={{ stroke: '#E4E7EC' }}
                                />
                                <YAxis 
                                    tick={{ fill: '#667085', fontSize: 10 }}
                                    axisLine={{ stroke: '#E4E7EC' }}
                                    tickFormatter={(value) => `₦${value / 1000}k`}
                                />
                                <Tooltip 
                                    formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Amount']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '12px' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#2F80ED" 
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            {chartData.length === 0 ? t('no_invoices_found') : t('loading')}
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Section - Desktop Only (Side by Side) */}
            <div className="hidden lg:flex gap-6 mb-6">
                {/* Payment Trends - Desktop */}
                <div className="flex-1 bg-white p-4 rounded-xl border border-[#E4E7EC]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#101828]">{t('track_payments_title')}</h3>
                        <button 
                            onClick={handleTrendsPeriodChange}
                            disabled={loading.trends}
                            className="flex items-center gap-2 text-sm text-[#667085] hover:text-[#2F80ED] disabled:opacity-50"
                        >
                            {trendsPeriod === 'month' ? t('monthly') : t('annually')}
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <div className="w-full h-[280px]" style={{ minWidth: '400px', minHeight: '280px' }}>
                        {loading.trends ? (
                            <div className="animate-pulse h-full bg-gray-100 rounded flex items-center justify-center">
                                <div className="text-gray-400">{t('loading')}</div>
                            </div>
                        ) : isClient && chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E9ED" />
                                    <XAxis 
                                        dataKey="month" 
                                        tick={{ fill: '#333436', fontSize: 12 }}
                                        axisLine={{ stroke: '#E4E7EC' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#667085', fontSize: 12 }}
                                        axisLine={{ stroke: '#E4E7EC' }}
                                        tickFormatter={(value) => `₦${value / 1000}k`}
                                    />
                                    <Tooltip 
                                        formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Amount']}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #E4E7EC' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#2F80ED" 
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                {chartData.length === 0 ? t('no_invoices_found') : t('loading')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Distribution - Desktop */}
                <div className="w-[392px] bg-white p-4 rounded-xl border border-[#E4E7EC]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#101828]">{t('status')}</h3>
                        <button className="flex items-center gap-2 text-sm text-[#667085]">
                            {t('monthly')}
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <div className="w-full h-[180px] flex items-center justify-center" style={{ minWidth: '300px', minHeight: '180px' }}>
                        {isClient && statusDistributionData.length > 0 && (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        {(!isClient || statusDistributionData.length === 0) && (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                {statusDistributionData.length === 0 ? t('no_invoices_found') : t('loading')}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2 mt-4">
                        {statusDistributionData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-[#333436]">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium text-[#101828]">{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Distribution - Mobile Only */}
            <div className="lg:hidden bg-white p-4 rounded-xl border border-[#E4E7EC] mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-[#101828]">{t('status')}</h3>
                    <button className="flex items-center gap-2 text-xs text-[#667085]">
                        {t('monthly')}
                        <ChevronDown size={16} />
                    </button>
                </div>
                <div className="w-full h-[180px] flex items-center justify-center" style={{ minWidth: '250px', minHeight: '180px' }}>
                    {isClient && statusDistributionData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                    {(!isClient || statusDistributionData.length === 0) && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            {statusDistributionData.length === 0 ? t('no_invoices_found') : t('loading')}
                        </div>
                    )}
                </div>
                <div className="space-y-2 mt-4">
                    {statusDistributionData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm text-[#333436]">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#101828]">{formatCurrency(item.value)}</span>
                                <span className="text-xs text-[#10B981]">{item.percentage}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Invoice - Mobile */}
            <div className="lg:hidden bg-white rounded-xl border border-[#E4E7EC] mb-6">
                <div className="p-4 flex items-center justify-between border-b border-[#E4E7EC]">
                    <h3 className="text-base font-semibold text-[#101828]">Recent Invoice</h3>
                    <Search size={18} className="text-[#667085]" />
                </div>
                <div className="divide-y divide-[#E4E7EC]">
                    {data.recentInvoices && data.recentInvoices.length > 0 ? (
                        data.recentInvoices.slice(0, 3).map((invoice, index) => (
                            <div key={invoice.id} className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-xs text-[#667085] mb-1">Date</p>
                                        <p className="text-sm font-medium text-[#101828]">{formatDate(invoice.date)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-[#667085] mb-1">{t('client_name')}</p>
                                        <p className="text-sm font-medium text-[#101828]">{invoice.client}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                    <span className="text-sm font-medium text-[#101828]">{formatCurrency(invoice.amount)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No recent invoices available
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <Link href="/dashboard/invoices" className="w-full h-12 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] flex items-center justify-center">
                        View More
                    </Link>
                </div>
            </div>

            {/* Recent Invoice - Desktop */}
            <div className="hidden lg:block bg-white rounded-xl border border-[#E4E7EC]">
                <div className="p-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#101828]">{t('invoices')}</h3>
                    <div className="flex items-center gap-2 bg-[#F9FAFB] px-4 py-2 rounded-lg">
                        <Search size={18} className="text-[#667085]" />
                        <input
                            type="text"
                            placeholder={t('search_invoices')}
                            className="bg-transparent outline-none text-sm w-32"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB]">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">{t('date')}</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">{t('client_name')}</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">{t('invoice_id')}</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">{t('status')}</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">{t('due_date')}</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">{t('amount')}</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">{t('balance_due')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentInvoices && data.recentInvoices.length > 0 ? (
                                data.recentInvoices.map((invoice, index) => (
                                    <tr key={invoice.id} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                                        <td className="px-6 py-4 text-sm text-[#101828]">{formatDate(invoice.date)}</td>
                                        <td className="px-6 py-4 text-sm text-[#101828]">{invoice.client}</td>
                                        <td className="px-6 py-4 text-sm text-[#667085]">{invoice.invoiceId}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#667085]">{formatDate(invoice.dueDate)}</td>
                                        <td className="px-6 py-4 text-sm text-[#101828] font-medium">{formatCurrency(invoice.amount)}</td>
                                        <td className="px-6 py-4 text-sm text-[#101828] font-medium">{formatCurrency(invoice.balance)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        {t('no_invoices_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;

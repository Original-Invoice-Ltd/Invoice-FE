﻿"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, CreditCard, FileText } from "lucide-react";
import { AdminApi } from "@/lib/adminApi";

const AdminOverviewPage = () => {
    const [dateRange, setDateRange] = useState("monthly");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [stats, setStats] = useState<any>(null);
    const [paymentTrends, setPaymentTrends] = useState<any[]>([]);
    const [invoiceStatus, setInvoiceStatus] = useState<any[]>([]);
    const [subscriptionDist, setSubscriptionDist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [statsRes, trendsRes, invoiceRes, subRes] = await Promise.all([
                AdminApi.getOverviewStats(startDate || undefined, endDate || undefined),
                AdminApi.getPaymentTrends(dateRange),
                AdminApi.getInvoiceStatusBreakdown(),
                AdminApi.getSubscriptionDistribution(),
            ]);
            if (statsRes.data) setStats(statsRes.data);
            if (trendsRes.data) setPaymentTrends(Array.isArray(trendsRes.data) ? trendsRes.data : []);
            if (invoiceRes.data) setInvoiceStatus(Array.isArray(invoiceRes.data) ? invoiceRes.data : []);
            if (subRes.data) setSubscriptionDist(Array.isArray(subRes.data) ? subRes.data : []);
            console.log('[Overview] stats → status:', statsRes.status, '| data:', statsRes.data, '| error:', statsRes.error);
            console.log('[Overview] trends → status:', trendsRes.status, '| data:', trendsRes.data, '| error:', trendsRes.error);
            console.log('[Overview] invoiceStatus → status:', invoiceRes.status, '| data:', invoiceRes.data, '| error:', invoiceRes.error);
            console.log('[Overview] subDist → status:', subRes.status, '| data:', subRes.data, '| error:', subRes.error);
            setLoading(false);
        };
        fetchData();
    }, [dateRange, startDate, endDate]);

    const naira = "\u20A6";
    const fmt = (val: any) => `${naira}${(Number(val) || 0).toLocaleString()}`;
    const pct = (val: any) => (val != null ? `+${val}%` : "\u2014");

    const kpiCards = [
        {
            title: "Total Platform Revenue",
            value: fmt(stats?.totalRevenue),
            subtext: `Active Users: ${stats?.activeUsers ?? 0} | Total: ${stats?.totalUsers ?? 0}`,
            change: pct(stats?.revenueChange),
            icon: CreditCard,
        },
        {
            title: "Active Subscriptions",
            value: (stats?.totalSubscriptions ?? stats?.activeSubscriptions ?? 0).toLocaleString(),
            subtext: `Premium: ${stats?.premiumSubscriptions ?? 0} | Essentials: ${stats?.essentialsSubscriptions ?? 0} | Free: ${stats?.freeSubscriptions ?? 0}`,
            change: pct(stats?.subscriptionChange),
            icon: Users,
        },
        {
            title: "Total Users",
            value: (stats?.totalUsers ?? 0).toLocaleString(),
            subtext: `Active: ${stats?.activeUsers ?? 0} | Inactive: ${stats?.inactiveUsers ?? 0}`,
            change: pct(stats?.userChange),
            icon: TrendingUp,
        },
        {
            title: "Total Invoices Created",
            value: (stats?.totalInvoices ?? 0).toLocaleString(),
            subtext: "Platform-wide",
            change: pct(stats?.invoiceChange),
            icon: FileText,
        },
    ];

    const trends = paymentTrends.length ? paymentTrends : [];
    const invoiceData = invoiceStatus.length ? invoiceStatus : [];
    const subData = subscriptionDist.length ? subscriptionDist : [];

    const EmptyChart = ({ message }: { message: string }) => (
        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
            <FileText size={32} className="mb-2 opacity-40" />
            <p className="text-sm">{message}</p>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Platform overview and key metrics</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-[#E4E7EC] rounded-xl p-5 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {kpiCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <div key={idx} className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{card.title}</p>
                                        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                                        <p className="text-xs text-gray-500 mt-1 truncate">{card.subtext}</p>
                                    </div>
                                    <Icon size={22} className="text-gray-500 flex-shrink-0 ml-2" />
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <TrendingUp size={14} className="text-green-600" />
                                    <span className="text-xs sm:text-sm font-semibold text-green-600">{card.change}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Payment Trends</h2>
                    {trends.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#2F80ED" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <EmptyChart message="No payment trend data available" />}
                </div>

                <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Invoice Status</h2>
                    {invoiceData.length ? (
                        <>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={invoiceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                                        {invoiceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-3 space-y-2">
                                {invoiceData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }}></div>
                                            <span className="text-gray-600">{item.name}</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : <EmptyChart message="No invoice status data available" />}
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Subscription Distribution</h2>
                {subData.length ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={subData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#2F80ED" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <EmptyChart message="No subscription data available" />}
            </div>
        </div>
    );
};

export default AdminOverviewPage;

"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, CreditCard, FileText } from "lucide-react";
import { AdminApi } from "@/lib/adminApi";

const AdminOverviewPage = () => {
    const [dateRange, setDateRange] = useState("monthly");
    const [stats, setStats] = useState<any>(null);
    const [paymentTrends, setPaymentTrends] = useState<any[]>([]);
    const [invoiceStatus, setInvoiceStatus] = useState<any[]>([]);
    const [subscriptionDist, setSubscriptionDist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [statsRes, trendsRes, invoiceRes, subRes] = await Promise.all([
                AdminApi.getOverviewStats(),
                AdminApi.getPaymentTrends(dateRange),
                AdminApi.getInvoiceStatusBreakdown(),
                AdminApi.getSubscriptionDistribution(),
            ]);
            if (statsRes.data) setStats(statsRes.data);
            if (trendsRes.data) setPaymentTrends(trendsRes.data);
            if (invoiceRes.data) setInvoiceStatus(invoiceRes.data);
            if (subRes.data) setSubscriptionDist(subRes.data);
            setLoading(false);
        };
        fetchData();
    }, [dateRange]);

    const fallbackTrends = [
        { month: "Jan", revenue: 45000, invoices: 320 },
        { month: "Feb", revenue: 52000, invoices: 380 },
        { month: "Mar", revenue: 48000, invoices: 350 },
        { month: "Apr", revenue: 61000, invoices: 420 },
        { month: "May", revenue: 55000, invoices: 390 },
        { month: "Jun", revenue: 67000, invoices: 450 },
    ];

    const fallbackInvoiceStatus = [
        { name: "Paid", value: 65, fill: "#10B981" },
        { name: "Pending", value: 25, fill: "#F59E0B" },
        { name: "Overdue", value: 10, fill: "#EF4444" },
    ];

    const fallbackSubDist = [
        { name: "Free", value: 2500, fill: "#E5E7EB" },
        { name: "Essentials", value: 778, fill: "#3B82F6" },
        { name: "Premium", value: 456, fill: "#1E40AF" },
    ];

    const kpiCards = [
        {
            title: "Total Platform Revenue",
            value: stats ? `?${stats.totalRevenue?.toLocaleString()}` : "?0",
            subtext: `Current Month: ₦${stats?.currentMonthRevenue?.toLocaleString() ?? 0}`,
            change: stats ? `+${stats.revenueChange}%` : "—",
            icon: CreditCard,
        },
        {
            title: "Active Subscriptions",
            value: stats?.activeSubscriptions?.toLocaleString() ?? "0",
            subtext: `Premium: ${stats?.premiumCount ?? 0} | Essentials: ${stats?.essentialsCount ?? 0}`,
            change: stats ? `+${stats.subscriptionChange}%` : "—",
            icon: Users,
        },
        {
            title: "Monthly Recurring Revenue",
            value: stats ? `?${stats.monthlyRecurringRevenue?.toLocaleString()}` : "?0",
            subtext: "From paid subscriptions",
            change: stats ? `+${stats.mrrChange}%` : "—",
            icon: TrendingUp,
        },
        {
            title: "Total Invoices Created",
            value: stats?.totalInvoices?.toLocaleString() ?? "0",
            subtext: "This month",
            change: stats ? `+${stats.invoiceChange}%` : "—",
            icon: FileText,
        },
    ];

    const trends = paymentTrends.length ? paymentTrends : fallbackTrends;
    const invoiceData = invoiceStatus.length ? invoiceStatus : fallbackInvoiceStatus;
    const subData = subscriptionDist.length ? subscriptionDist : fallbackSubDist;

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Platform overview and key metrics</p>
                </div>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm font-medium"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
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
                </div>

                <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Invoice Status</h2>
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
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Subscription Distribution</h2>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={subData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2F80ED" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminOverviewPage;

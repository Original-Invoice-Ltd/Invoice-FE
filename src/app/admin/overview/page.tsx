"use client";

import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, CreditCard, FileText } from "lucide-react";

const AdminOverviewPage = () => {
    const [dateRange, setDateRange] = useState("monthly");

    const kpiCards = [
        { title: "Total Platform Revenue", value: "$125,430", subtext: "Current Month: $45,230", change: "+12.5%", icon: CreditCard, color: "bg-[#E8F2FE]" },
        { title: "Active Subscriptions", value: "1,234", subtext: "Premium: 456 | Essentials: 778", change: "+8.2%", icon: Users, color: "bg-green-100" },
        { title: "Monthly Recurring Revenue", value: "$45,230", subtext: "From paid subscriptions", change: "+5.3%", icon: TrendingUp, color: "bg-purple-100" },
        { title: "Total Invoices Created", value: "8,945", subtext: "This month", change: "+15.2%", icon: FileText, color: "bg-orange-100" }
    ];

    const paymentTrendData = [
        { month: "Jan", revenue: 45000, invoices: 320 },
        { month: "Feb", revenue: 52000, invoices: 380 },
        { month: "Mar", revenue: 48000, invoices: 350 },
        { month: "Apr", revenue: 61000, invoices: 420 },
        { month: "May", revenue: 55000, invoices: 390 },
        { month: "Jun", revenue: 67000, invoices: 450 }
    ];

    const invoiceStatusData = [
        { name: "Paid", value: 65, fill: "#10B981" },
        { name: "Pending", value: 25, fill: "#F59E0B" },
        { name: "Overdue", value: 10, fill: "#EF4444" }
    ];

    const subscriptionData = [
        { name: "Free", value: 2500, fill: "#E5E7EB" },
        { name: "Essentials", value: 778, fill: "#3B82F6" },
        { name: "Premium", value: 456, fill: "#1E40AF" }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Platform overview and key metrics</p>
                </div>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm font-medium">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white border border-[#E4E7EC] rounded-xl p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[14px] text-gray-600 font-medium">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{card.subtext}</p>
                                </div>
                                <div >
                                    <Icon size={24} className="text-gray-700" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <TrendingUp size={16} className="text-green-600" />
                                <span className="text-sm font-semibold text-green-600">{card.change}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-[#E4E7EC] rounded-xl p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={paymentTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#2F80ED" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Invoice Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={invoiceStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                                {invoiceStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {invoiceStatusData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                    <span className="text-gray-600">{item.name}</span>
                                </div>
                                <span className="font-semibold text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subscriptionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2F80ED" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminOverviewPage;

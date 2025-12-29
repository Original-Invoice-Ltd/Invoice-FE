"use client";

import { Search, ChevronDown, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

const DashboardContent = () => {
    // Sample data for charts
    const paymentTrendsData = [
        { month: 'Jan', value: 50000 },
        { month: 'Feb', value: 100000 },
        { month: 'Mar', value: 150000 },
        { month: 'Apr', value: 200000 },
        { month: 'May', value: 250000 },
        { month: 'Jun', value: 300000 },
    ];

    const statusDistributionData = [
        { name: 'Paid', value: 890000, color: '#10B981', percentage: '+55%' },
        { name: 'Pending', value: 320000, color: '#3B82F6', percentage: '+7%' },
        { name: 'Overdue', value: 135000, color: '#2F80ED', percentage: '+6%' },
    ];

    const recentInvoices = [
        { date: 'Oct 25, 2025', client: 'Tech Solutions Ltd', invoiceId: 'INV-00123', status: 'Paid', dueDate: 'Nov 25, 2025', amount: '₦450,000', balance: '₦450,000' },
        { date: 'Oct 23, 2025', client: 'Creative Hub', invoiceId: 'INV-00122', status: 'Pending', dueDate: 'Nov 25, 2025', amount: '₦85,000', balance: '₦85,000' },
        { date: 'Oct 15, 2025', client: 'Global Services', invoiceId: 'INV-00121', status: 'Paid', dueDate: 'Nov 25, 2025', amount: '₦112,000', balance: '₦112,000' },
        { date: 'Oct 15, 2025', client: 'Global Services', invoiceId: 'INV-00121', status: 'Overdue', dueDate: 'Nov 25, 2025', amount: '₦112,000', balance: '₦112,000' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid':
                return 'bg-[#ECFDF5] text-[#10B981]';
            case 'Pending':
                return 'bg-[#FEF3C7] text-[#F59E0B]';
            case 'Overdue':
                return 'bg-[#FEE2E2] text-[#EF4444]';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="w-full max-w-[1108px]">
            {/* Welcome Section */}
            <div className="mb-6">
                <h1 className="text-xl lg:text-2xl font-semibold text-[#101828] mb-1">Welcome, Victor</h1>
                <p className="text-sm text-[#667085]">Here's your business performance at a glance</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <Link href="/dashboard/clients" className="flex-1 lg:flex-none lg:px-6 border border-[#2F80ED] text-[#2F80ED] rounded-lg text-sm font-medium hover:bg-[#EFF8FF] h-12 flex items-center justify-center">
                    Add Client
                </Link>
                <Link href="/dashboard/invoices/create-enhanced" className="flex-1 lg:flex-none lg:px-6 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] h-12 flex items-center justify-center gap-2">
                    <Plus size={18} />
                    Create Invoice (Enhanced)
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                    <p className="text-sm text-[#667085] mb-2">Total Invoice Sent</p>
                    <h3 className="text-2xl lg:text-3xl font-semibold text-[#101828]">₦900,000</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                    <p className="text-sm text-[#667085] mb-2">Paid Invoices</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl lg:text-3xl font-semibold text-[#101828]">₦890,000</h3>
                        <span className="text-xs text-[#10B981] bg-[#ECFDF5] px-2 py-1 rounded">+15%</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                    <p className="text-sm text-[#667085] mb-2">Pending Invoice</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl lg:text-3xl font-semibold text-[#101828]">₦320,000</h3>
                        <span className="text-xs text-[#EF4444] bg-[#FEE2E2] px-2 py-1 rounded">-3%</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                    <p className="text-sm text-[#667085] mb-2">Overdue Invoice</p>
                    <h3 className="text-2xl lg:text-3xl font-semibold text-[#101828]">₦135,000</h3>
                </div>
            </div>

            {/* Payment Trends - Mobile & Desktop */}
            <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base lg:text-lg font-semibold text-[#101828]">Payment Trends</h3>
                    <button className="flex items-center gap-2 text-xs lg:text-sm text-[#667085]">
                        This Month
                        <ChevronDown size={16} />
                    </button>
                </div>
                <div className="h-[200px] lg:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={paymentTrendsData}>
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
                </div>
            </div>

            {/* Charts Section - Desktop Only (Side by Side) */}
            <div className="hidden lg:flex gap-6 mb-6">
                {/* Payment Trends - Desktop */}
                <div className="flex-1 bg-white p-4 rounded-xl border border-[#E4E7EC]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#101828]">Payment Trends</h3>
                        <button className="flex items-center gap-2 text-sm text-[#667085]">
                            This Month
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={paymentTrendsData}>
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
                    </div>
                </div>

                {/* Status Distribution - Desktop */}
                <div className="w-[392px] bg-white p-4 rounded-xl border border-[#E4E7EC]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#101828]">Status Distribution</h3>
                        <button className="flex items-center gap-2 text-sm text-[#667085]">
                            This Month
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <div className="h-[180px] flex items-center justify-center">
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
                    </div>
                    <div className="space-y-2 mt-4">
                        {statusDistributionData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-[#333436]">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium text-[#101828]">₦{item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Distribution - Mobile Only */}
            <div className="lg:hidden bg-white p-4 rounded-xl border border-[#E4E7EC] mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-[#101828]">Status Distribution</h3>
                    <button className="flex items-center gap-2 text-xs text-[#667085]">
                        This Month
                        <ChevronDown size={16} />
                    </button>
                </div>
                <div className="h-[180px] flex items-center justify-center">
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
                </div>
                <div className="space-y-2 mt-4">
                    {statusDistributionData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm text-[#333436]">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#101828]">₦{item.value.toLocaleString()}</span>
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
                    {recentInvoices.slice(0, 3).map((invoice, index) => (
                        <div key={index} className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-xs text-[#667085] mb-1">Date</p>
                                    <p className="text-sm font-medium text-[#101828]">{invoice.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#667085] mb-1">Client Name</p>
                                    <p className="text-sm font-medium text-[#101828]">{invoice.client}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4">
                    <button className="w-full h-12 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB]">
                        View More
                    </button>
                </div>
            </div>

            {/* Recent Invoice - Desktop */}
            <div className="hidden lg:block bg-white rounded-xl border border-[#E4E7EC]">
                <div className="p-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#101828]">Recent Invoice</h3>
                    <div className="flex items-center gap-2 bg-[#F9FAFB] px-4 py-2 rounded-lg">
                        <Search size={18} className="text-[#667085]" />
                        <input
                            type="text"
                            placeholder="Search invoice"
                            className="bg-transparent outline-none text-sm w-32"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB]">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Date</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Client Name</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Invoice ID</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Due Date</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Balance Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentInvoices.map((invoice, index) => (
                                <tr key={index} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                                    <td className="px-6 py-4 text-sm text-[#101828]">{invoice.date}</td>
                                    <td className="px-6 py-4 text-sm text-[#101828]">{invoice.client}</td>
                                    <td className="px-6 py-4 text-sm text-[#667085]">{invoice.invoiceId}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#667085]">{invoice.dueDate}</td>
                                    <td className="px-6 py-4 text-sm text-[#101828] font-medium">{invoice.amount}</td>
                                    <td className="px-6 py-4 text-sm text-[#101828] font-medium">{invoice.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;

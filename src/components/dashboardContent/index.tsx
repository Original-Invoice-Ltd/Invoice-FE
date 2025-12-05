"use client";

import { Search, ChevronDown, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardHeader from "../dashboardHeader";

const DashboardContent = () => {
    // Sample data for charts
    const paymentTrendsData = [
        { month: 'Jan', value: 50000 },
        { month: 'Feb', value: 100000 },
        { month: 'Mar', value: 150000 },
        { month: 'Apr', value: 200000 },
        { month: 'May', value: 250000 },
        { month: 'Jun', value: 300000 },
        { month: 'Jul', value: 320000 },
        { month: 'Aug', value: 350000 },
        { month: 'Sep', value: 380000 },
        { month: 'Oct', value: 400000 },
        { month: 'Nov', value: 420000 },
        { month: 'Dec', value: 450000 },
    ];

    const statusDistributionData = [
        { name: 'Paid', value: 890000, color: '#10B981' },
        { name: 'Pending', value: 320000, color: '#3B82F6' },
        { name: 'Overdue', value: 135000, color: '#2F80ED' },
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
                return 'bg-[black] text-gray-600';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <DashboardHeader />

            {/* Main Content */}
            <div className="p-4 lg:p-8">
                {/* Welcome Section, Action Buttons, and Stats Cards Container */}
                <div 
                    style={{
                        maxWidth: '1108px',
                        gap: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    className="mb-6"
                >
                    {/* Welcome Section and Action Buttons Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Welcome Section */}
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-semibold text-[#101828] mb-1">Welcome, Victor</h1>
                            <p className="text-sm text-[#667085]">Here's your business performance at a glance</p>
                        </div>

                        {/* Action Buttons - Desktop */}
                        <div className="hidden lg:flex gap-3">
                            <button className="px-6 py-3 border border-[#2F80ED] text-[#2F80ED] rounded-lg text-sm font-medium hover:bg-[#EFF8FF]">
                                Add Client
                            </button>
                            <button className="px-6 py-3 bg-[#2F80ED] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#2563EB]">
                                <Plus size={18} />
                                Create Invoice
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons - Mobile */}
                    <div className="flex gap-3 lg:hidden">
                        <button className="flex-1 px-4 py-3 border border-[#2F80ED] text-[#2F80ED] rounded-lg text-sm font-medium">
                            Add Client
                        </button>
                        <button className="flex-1 px-4 py-3 bg-[#2F80ED] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                            <Plus size={18} />
                            Create Invoice
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                            <p className="text-sm text-[#667085] mb-2">Total Invoice Sent</p>
                            <h3 className="text-3xl font-semibold text-[#101828]">₦900,000</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                            <p className="text-sm text-[#667085] mb-2">Paid Invoices</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-semibold text-[#101828]">₦890,000</h3>
                                <span className="text-xs text-[#10B981] bg-[#ECFDF5] px-2 py-1 rounded">+15%</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                            <p className="text-sm text-[#667085] mb-2">Pending Invoice</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-semibold text-[#101828]">₦320,000</h3>
                                <span className="text-xs text-[#EF4444] bg-[#FEE2E2] px-2 py-1 rounded">-3%</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                            <p className="text-sm text-[#667085] mb-2">Overdue Invoice</p>
                            <h3 className="text-3xl font-semibold text-[#101828]">₦135,000</h3>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Payment Trends */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E4E7EC]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-[#101828]">Payment Trends</h3>
                            <button className="flex items-center gap-2 text-sm text-[#667085]">
                                This Month
                                <ChevronDown size={16} />
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={paymentTrendsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis 
                                    dataKey="month" 
                                    tick={{ fill: '#667085', fontSize: 12 }}
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

                    {/* Status Distribution */}
                    <div className="bg-white p-6 rounded-xl border border-[#E4E7EC]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-[#101828]">Status Distribution</h3>
                            <button className="flex items-center gap-2 text-sm text-[#667085]">
                                This Month
                                <ChevronDown size={16} />
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={200}>
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
                        <div className="mt-6 space-y-3">
                            {statusDistributionData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm text-[#667085]">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-medium text-[#101828]">₦{item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-xl border border-[#E4E7EC]">
                    <div className="p-6 border-b border-[#E4E7EC]">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#101828]">Recent Invoice</h3>
                            <div className="flex items-center gap-2 bg-[#F9FAFB] px-4 py-2 rounded-lg">
                                <Search size={18} className="text-[#667085]" />
                                <input
                                    type="text"
                                    placeholder="Search invoice"
                                    className="bg-transparent outline-none text-sm w-32 lg:w-auto"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
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

                    {/* Mobile List */}
                    <div className="lg:hidden divide-y divide-[#E4E7EC]">
                        {recentInvoices.map((invoice, index) => (
                            <div key={index} className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#101828]">{invoice.client}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </div>
                                <div className="text-xs text-[#667085] space-y-1">
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span>{invoice.date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Invoice ID:</span>
                                        <span>{invoice.invoiceId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Amount:</span>
                                        <span className="font-medium text-[#101828]">{invoice.amount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-[#E4E7EC]">
                        <button className="w-full py-3 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB]">
                            View More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;

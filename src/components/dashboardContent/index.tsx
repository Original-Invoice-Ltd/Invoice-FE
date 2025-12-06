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

                {/* Charts Section Container */}
                <div 
                    style={{
                        maxWidth: '1108px',
                        height: '342px',
                        gap: '24px',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                    className="mb-6 flex-col lg:flex-row"
                >
                    {/* Payment Trends */}
                    <div 
                        style={{
                            width: '692px',
                            height: '342px',
                            gap: '20px',
                            borderRadius: '8px',
                            borderWidth: '1px',
                            padding: '16px',
                            background: '#FFFFFF',
                            border: '1px solid #EDEDED',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        className="flex-1 lg:max-w-[692px]"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#101828]">Payment Trends</h3>
                            <button className="flex items-center gap-2 text-sm text-[#667085]">
                                This Month
                                <ChevronDown size={16} />
                            </button>
                        </div>
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

                    {/* Status Distribution */}
                    <div 
                        style={{
                            width: '392px',
                            height: '342px',
                            gap: '10px',
                            borderRadius: '8px',
                            borderWidth: '1px',
                            padding: '16px',
                            background: '#FFFFFF',
                            border: '1px solid #EDEDED',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        className="flex-1 lg:max-w-[392px]"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#101828]">Status Distribution</h3>
                            <button className="flex items-center gap-2 text-sm text-[#667085]">
                                This Month
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.354 6.35372L8.35403 11.3537C8.30759 11.4002 8.25245 11.4371 8.19175 11.4623C8.13105 11.4874 8.06599 11.5004 8.00028 11.5004C7.93457 11.5004 7.86951 11.4874 7.80881 11.4623C7.74811 11.4371 7.69296 11.4002 7.64653 11.3537L2.64653 6.35372C2.55271 6.2599 2.5 6.13265 2.5 5.99997C2.5 5.86729 2.55271 5.74004 2.64653 5.64622C2.74035 5.5524 2.8676 5.49969 3.00028 5.49969C3.13296 5.49969 3.26021 5.5524 3.35403 5.64622L8.00028 10.2931L12.6465 5.64622C12.693 5.59977 12.7481 5.56292 12.8088 5.53778C12.8695 5.51263 12.9346 5.49969 13.0003 5.49969C13.066 5.49969 13.131 5.51263 13.1917 5.53778C13.2524 5.56292 13.3076 5.59977 13.354 5.64622C13.4005 5.69268 13.4373 5.74783 13.4625 5.80852C13.4876 5.86922 13.5006 5.93428 13.5006 5.99997C13.5006 6.06567 13.4876 6.13072 13.4625 6.19142C13.4373 6.25212 13.4005 6.30727 13.354 6.35372Z" fill="#444444"/>
</svg>

                            </button>
                        </div>
                        <div className="flex items-center justify-center flex-1">
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
                        <div className="space-y-3">
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

                {/* Recent Invoices */}
                <div 
                    style={{
                        maxWidth: '1108px',
                        height: '336px',
                        gap: '18px',
                        borderRadius: '8px',
                        paddingTop: '16px',
                        paddingRight: '14px',
                        paddingLeft: '14px',
                        background: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    className="border border-[#E4E7EC]"
                >
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
                    
                    {/* Desktop Table */}
                    <div className="hidden lg:block flex-1">
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
                    <div className="lg:hidden divide-y divide-[#E4E7EC] flex-1">
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
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;

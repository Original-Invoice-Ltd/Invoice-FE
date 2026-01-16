"use client";

import { CustomerLayout } from "@/components/customerSection";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CustomerPaymentPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    // Mock receipt data - empty array for empty state, populated for filled state
    const receipts = [
        {
            id: 1,
            receiptName: "Receipt #1",
            invoiceId: "INV-00123",
            amount: "₦450,000",
            status: "Approved",
            dueDate: "Nov 25, 2025"
        },
        {
            id: 2,
            receiptName: "Receipt #2",
            invoiceId: "INV-00122",
            amount: "₦85,000",
            status: "Pending",
            dueDate: "Nov 25, 2025"
        },
        {
            id: 3,
            receiptName: "Receipt #3",
            invoiceId: "INV-00121",
            amount: "₦112,000",
            status: "Approved",
            dueDate: "Nov 25, 2025"
        },
        {
            id: 4,
            receiptName: "Receipt #4",
            invoiceId: "INV-00121",
            amount: "₦112,000",
            status: "Pending",
            dueDate: "Nov 25, 2025"
        }
    ];

    // For empty state, use empty array: const receipts = [];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredReceipts = receipts.filter(receipt =>
        receipt.receiptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReceipts = filteredReceipts.slice(startIndex, startIndex + itemsPerPage);

    // Empty State Component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 mb-6">
                <svg viewBox="0 0 96 96" fill="none" className="w-full h-full text-gray-300">
                    <circle cx="48" cy="48" r="48" fill="currentColor" fillOpacity="0.1"/>
                    <path d="M32 40h32v24H32V40z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M36 44h24M36 48h20M36 52h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="72" cy="32" r="8" fill="currentColor" fillOpacity="0.2"/>
                    <path d="M68 32h8M72 28v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Receipt Uploaded</h3>
            <p className="text-gray-500 text-center max-w-md">
                Once you upload your receipt, it will appear here so you can easily track your payment.
            </p>
        </div>
    );

    return (
        <CustomerLayout>
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment</h1>
                    <p className="text-gray-600">Track all receipts uploaded and their status</p>
                </div>

                {receipts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Table Header with Search */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">All Receipts Uploaded</h2>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                                            <path stroke="#444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.88 13.88a6.667 6.667 0 1 0-9.427-9.427 6.667 6.667 0 0 0 9.428 9.428Zm0 0 3.62 3.62M6.22 6.22a4.167 4.167 0 0 1 5.893 0"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search Invoice"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedReceipts.map((receipt, index) => (
                                            <tr key={receipt.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {receipt.receiptName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {receipt.invoiceId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {receipt.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(receipt.status)}`}>
                                                        {receipt.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {receipt.dueDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setOpenDropdown(openDropdown === receipt.id ? null : receipt.id)}
                                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                        
                                                        {openDropdown === receipt.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                                <button
                                                                    onClick={() => {
                                                                        setOpenDropdown(null);
                                                                        router.push(`/customer/payments/${receipt.id}`);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    View Detail
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 text-sm rounded ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </CustomerLayout>
    );
};

export default CustomerPaymentPage;
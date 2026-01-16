"use client";

import { CustomerLayout } from "@/components/customerSection";
import { useState } from "react";
import { UploadReceiptModal } from "@/components/modals";
import { useRouter } from "next/navigation";
import { mockInvoices } from "@/lib/mockData";

const CustomerInvoicesPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleUploadReceipt = (file: File) => {
        console.log('Uploaded file:', file);
        alert(`Receipt "${file.name}" uploaded successfully!`);
    };

    // Use shared mock data
    const invoices = mockInvoices;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'overdue':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getDropdownOptions = (status: string) => {
        const baseOptions = [
            { label: "View Detail", action: "view" }
        ];

        if (status.toLowerCase() === 'paid') {
            return [
                ...baseOptions,
                { label: "View Receipt", action: "receipt" }
            ];
        } else {
            // For pending, overdue, or any unpaid status
            return [
                ...baseOptions,
                { label: "Upload Receipt", action: "upload" }
            ];
        }
    };

    const handleDropdownAction = (action: string, invoiceId: number) => {
        setOpenDropdown(null);
        
        switch (action) {
            case 'view':
                // Navigate to invoice detail page using the numeric ID
                router.push(`/customer/invoices/${invoiceId}`);
                break;
            case 'receipt':
                // View existing receipt
                console.log('View receipt for invoice:', invoiceId);
                break;
            case 'upload':
                // Open upload modal
                setIsUploadModalOpen(true);
                break;
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.issuedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <CustomerLayout>
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">All Invoice</h1>
                    
                    {/* Search Bar */}
                    <div className="flex justify-end">
                        {/* Search Input */}
                        <div className="relative">
                            <svg 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg" 
                                width="20" 
                                height="20" 
                                fill="none"
                            >
                                <path 
                                    stroke="#444" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="1.5" 
                                    d="M13.88 13.88a6.667 6.667 0 1 0-9.427-9.427 6.667 6.667 0 0 0 9.428 9.428Zm0 0 3.62 3.62M6.22 6.22a4.167 4.167 0 0 1 5.893 0"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search invoice"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.issuedBy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.invoiceId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.dueDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 relative">
                                        <button 
                                            className="hover:text-gray-600 p-1"
                                            onClick={() => setOpenDropdown(openDropdown === invoice.id ? null : invoice.id)}
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openDropdown === invoice.id && (
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                {/* Dropdown Options */}
                                                <div className="py-1">
                                                    {getDropdownOptions(invoice.status).map((option, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleDropdownAction(option.action, invoice.id)}
                                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end mt-6">
                    <nav className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">1</button>
                        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">2</button>
                        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">3</button>
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            </button>
                    </nav>
                </div>

                {/* Upload Receipt Modal */}
                <UploadReceiptModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleUploadReceipt}
                />

                {/* Click outside to close dropdown */}
                {openDropdown && (
                    <div 
                        className="fixed inset-0 z-0" 
                        onClick={() => setOpenDropdown(null)}
                    />
                )}
            </div>
        </CustomerLayout>
    );
};

export default CustomerInvoicesPage;
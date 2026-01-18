"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockInvoices } from "@/lib/mockData";
import { CustomerLayout } from "@/components/customerSection";
import { UploadReceiptModal } from "@/components/modals";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/api";
import { InvoiceStatsResponse } from "@/types/invoice";

const CustomerDashboardPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState({
        totalReceived: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        unpaid: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);

    // Fetch invoice statistics from API
    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.email) {
                // If user is not authenticated, don't show loading state indefinitely
                setStatsLoading(false);
                return;
            }

            try {
                setStatsLoading(true);
                setStatsError(null);
                const response = await ApiClient.getInvoiceStats(user.email);
                
                if (response.status === 200 && response.data) {
                    // Ensure all required fields are present with defaults
                    const apiData = response.data as InvoiceStatsResponse;
                    setStats({
                        totalReceived: apiData.totalReceived || 0,
                        paid: apiData.paid || 0,
                        pending: apiData.pending || 0,
                        overdue: apiData.overdue || 0,
                        unpaid: apiData.unpaid || 0
                    });
                } else {
                    // Fallback to mock data if API fails
                    const mockStats = {
                        totalReceived: mockInvoices.length,
                        paid: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'paid').length,
                        pending: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'pending').length,
                        overdue: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'overdue').length,
                        unpaid: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'unpaid').length
                    };
                    setStats(mockStats);
                }
            } catch (error) {
                console.error('Failed to fetch invoice stats:', error);
                setStatsError('Failed to load statistics');
                // Fallback to mock data on error
                const mockStats = {
                    totalReceived: mockInvoices.length,
                    paid: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'paid').length,
                    pending: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'pending').length,
                    overdue: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'overdue').length,
                    unpaid: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'unpaid').length
                };
                setStats(mockStats);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, [user?.email]);

    // Calculate stats from actual data (fallback - now replaced by API call above)
    // const stats = {
    //     totalReceived: mockInvoices.length,
    //     paid: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'paid').length,
    //     pending: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'pending').length,
    //     overdue: mockInvoices.filter(invoice => invoice.status.toLowerCase() === 'overdue').length
    // };

    // Use shared mock data for recent invoices
    const recentInvoices = mockInvoices;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium';
            case 'overdue':
                return 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium';
            default:
                return 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium';
        }
    };

    const getDropdownOptions = (status: string) => {
        const baseOptions = [
            { label: "View Detail", action: "view" }
        ];

        if (status.toLowerCase() === 'paid') {
            // For paid invoices - show "View Receipt"
            return [
                ...baseOptions,
                { label: "View Receipt", action: "receipt" }
            ];
        } else {
            // For pending, overdue, or any unpaid status - show "Upload Receipt"
            return [
                ...baseOptions,
                { label: "Upload Receipt", action: "upload" }
            ];
        }
    };

    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleDropdownAction = (action: string, invoiceId: number) => {
        setOpenDropdown(null);
        
        switch (action) {
            case 'view':
                // Navigate to invoice detail page using the numeric ID
                router.push(`/customer/invoices/${invoiceId}`);
                break;
            case 'receipt':
                // View existing receipt for paid invoices
                router.push(`/customer/receipt/${invoiceId}`);
                break;
            case 'upload':
                // Open upload modal for unpaid invoices
                setIsUploadModalOpen(true);
                break;
        }
    };

    const handleUploadReceipt = (file: File) => {
        console.log('Uploaded file:', file);
        alert(`Receipt "${file.name}" uploaded successfully!`);
    };

    const itemsPerPage = 4;
    const totalPages = Math.ceil(recentInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInvoices = recentInvoices.slice(startIndex, startIndex + itemsPerPage);

    return (
        <CustomerLayout>
            <div className="p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Chiamaka</h2>
                    <p className="text-gray-600">Here are all your invoices from Tech Solutions Ltd.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#eff8ff] p-6 rounded-lg shadow-sm">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {statsLoading ? (
                                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                            ) : (
                                stats.totalReceived
                            )}
                        </div>
                        <div className="text-sm text-gray-600">Total Invoice Received</div>
                        {statsError && (
                            <div className="text-xs text-red-500 mt-1">Failed to load</div>
                        )}
                    </div>
                    <div className="bg-[#eff8ff] p-6 rounded-lg shadow-sm">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {statsLoading ? (
                                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                            ) : (
                                stats.paid
                            )}
                        </div>
                        <div className="text-sm text-gray-600">Paid Invoice</div>
                        {statsError && (
                            <div className="text-xs text-red-500 mt-1">Failed to load</div>
                        )}
                    </div>
                    <div className="bg-[#eff8ff] p-6 rounded-lg shadow-sm">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {statsLoading ? (
                                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                            ) : (
                                stats.pending
                            )}
                        </div>
                        <div className="text-sm text-gray-600">Pending Invoice</div>
                        {statsError && (
                            <div className="text-xs text-red-500 mt-1">Failed to load</div>
                        )}
                    </div>
                    <div className="bg-[#eff8ff] p-6 rounded-lg shadow-sm">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {statsLoading ? (
                                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                            ) : (
                                stats.overdue
                            )}
                        </div>
                        <div className="text-sm text-gray-600">Overdue Invoice</div>
                        {statsError && (
                            <div className="text-xs text-red-500 mt-1">Failed to load</div>
                        )}
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Invoice</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Invoice"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                />
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
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedInvoices.map((invoice, index) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {invoice.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {invoice.issuedBy}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {invoice.invoiceId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={getStatusColor(invoice.status)}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {invoice.dueDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {invoice.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setOpenDropdown(openDropdown === invoice.id ? null : invoice.id)}
                                                    className="hover:text-gray-600"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>

                                                {/* Dropdown Menu */}
                                                {openDropdown === invoice.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-end space-x-2">
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

export default CustomerDashboardPage;
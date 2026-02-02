"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

import { ApiClient } from "@/lib/api";
import { InvoiceResponse } from "@/types/invoice";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import Toast from '@/components/ui/Toast';
import { useToast } from "@/hooks/useToast";;
import { useAuth } from "@/contexts/AuthContext";

const InvoicesPage = () => {
    const { user, refreshUser } = useAuth();
    const { showError, toast, hideToast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        invoice: InvoiceResponse | null;
        isLoading: boolean;
        error?: string | null;
    }>({
        isOpen: false,
        invoice: null,
        isLoading: false,
        error: null
    });

    useEffect(() => {
        refreshUser();
        fetchInvoices();

    }, []);

   
    
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await ApiClient.getAllUserInvoices(user?.id);
            console.log("Response is fetched")
            if (response.status === 200 && response.data) {
                const invoicesData = Array.isArray(response.data) ? response.data : [];
                setInvoices(invoicesData);
            } else {

                showError(response.error || response.message || "Failed to fetch invoices");
            }
        } catch (err) {
            console.error("Error fetching invoices:", err);
            showError("An error occurred while fetching invoices, Please try refreshing.");
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort invoices
    const filteredInvoices = invoices.filter(invoice =>
        (invoice.billTo?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (invoice.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (invoice.billTo?.businessName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedInvoices = [...filteredInvoices].sort((a, b) => {
        switch (sortBy) {
            case "date":
                return new Date(b.creationDate || 0).getTime() - new Date(a.creationDate || 0).getTime();
            case "amount":
                return (b.totalDue || 0) - (a.totalDue || 0);
            case "client":
                return (a.billTo?.fullName || '').localeCompare(b.billTo?.fullName || '');
            case "status":
                return (a.status || '').localeCompare(b.status || '');
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInvoices = sortedInvoices.slice(startIndex, startIndex + itemsPerPage);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number | null | undefined, currency: string = 'NGN') => {
        const safeAmount = amount || 0;
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency || 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(safeAmount);
    };

    const getStatusColor = (status: string | null | undefined) => {
        if (!status) {
            return 'bg-gray-100 text-gray-800'; // Default for null/undefined status
        }
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDeleteInvoice = async (invoice: InvoiceResponse) => {
        setDeleteModal({
            isOpen: true,
            invoice: invoice,
            isLoading: false
        });
    };

    const confirmDeleteInvoice = async () => {
        if (!deleteModal.invoice) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await ApiClient.deleteInvoice(deleteModal.invoice.id);
            if (response.status === 204 || response.status === 200) {
                setInvoices(invoices.filter(invoice => invoice.id !== deleteModal.invoice!.id));
                setDeleteModal({ isOpen: false, invoice: null, isLoading: false, error: null });
            } else {
                setDeleteModal(prev => ({ ...prev, isLoading: false, error: response.error || response.message || "Failed to delete invoice" }));
            }
        } catch (err) {
            console.error("Error deleting invoice:", err);
            setDeleteModal(prev => ({ ...prev, isLoading: false, error: "An error occurred while deleting the invoice" }));
        }
    };

    const closeDeleteModal = () => {
        if (!deleteModal.isLoading) {
            setDeleteModal({ isOpen: false, invoice: null, isLoading: false, error: null });
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto mb-[200px] p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mb-[200px] p-6">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#101828] mb-1">Invoice Management</h1>
                    <p className="text-[14px] text-[#667085]">
                        View, manage, and track all your invoices, stay on<br />
                        top of payments and tax compliance effortlessly.
                    </p>
                </div>
                <Link
                    href="/dashboard/invoices/create"
                    className="flex items-center gap-2 px-5 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-[16px] font-medium whitespace-nowrap"
                >
                    <Plus size={20} />
                    Create Invoice

                </Link>
            </div>

            {/* All Invoices Section */}
            <div className="bg-white rounded-lg border border-[#E4E7EC]">
                {/* Header with Search */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E7EC]">
                    <h2 className="text-[18px] font-semibold text-[#101828]">All Invoices</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#98A2B3]" size={18} />
                            <input
                                type="text"
                                placeholder="search clients"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] text-[#667085] placeholder:text-[#98A2B3] bg-white focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] text-[#667085] bg-white focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="client">Sort by Client</option>
                            <option value="status">Sort by Status</option>
                        </select>
                    </div>
                </div>


                {/* {error && (
                    <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )} */}

                {paginatedInvoices.length === 0 ? (
                    /* Empty State */
                    <div className="p-12 flex flex-col items-center justify-center">
                        <div className="mb-6">
                            <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="108" height="108" rx="54" fill="#EFF8FF" />
                                <path d="M31.0267 24.4626C30.9547 24.7395 30.8288 24.9871 30.6392 25.2241C30.3565 25.5774 29.9173 25.9034 29.3366 26.1391C28.7579 26.375 28.045 26.516 27.2661 26.5154C26.703 26.5155 26.106 26.4427 25.4998 26.2864C24.2126 25.9565 23.145 25.3087 22.4515 24.5748C21.9066 24.0006 20.9993 23.9769 20.4252 24.5219C19.851 25.0669 19.8273 25.9741 20.3722 26.5483C21.4813 27.7137 23.0062 28.6021 24.7842 29.0623C25.6219 29.2783 26.4571 29.3821 27.2661 29.3822C28.7574 29.3804 30.1646 29.0339 31.3366 28.3386C31.9213 27.9903 32.4467 27.5512 32.8738 27.0199C33.3008 26.4897 33.6263 25.8646 33.8027 25.1782C34.0003 24.4117 33.5391 23.63 32.7725 23.4324C32.0059 23.2348 31.2243 23.696 31.0267 24.4626Z" fill="#99A0AE" />
                                <path d="M87.6606 33.2559L39.7034 20.7819C36.5953 19.9735 33.4203 21.8378 32.6118 24.9459L20.1379 72.9031C19.3294 76.0112 21.1937 79.1862 24.3018 79.9946L72.259 92.4686C75.3672 93.277 78.5422 91.4128 79.3506 88.3046L91.8245 40.3475C92.633 37.2393 90.7687 34.0643 87.6606 33.2559Z" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="text-[16px] font-semibold text-[#101828] mb-2">
                            {searchQuery ? "No invoices found" : "No invoices yet"}
                        </h3>
                        <p className="text-[14px] text-[#667085] mb-6 text-center max-w-md leading-relaxed">

                            {searchQuery
                                ? "Try adjusting your search terms or filters."
                                : "Create your first invoice to start getting paid and track taxes easily."
                            }
                        </p>
                        {!searchQuery && (
                             <Link
                                href="/dashboard/invoices/create"
                                className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-[#EFF8FF] transition-colors text-[16px] font-medium"
                            >
                                <Plus size={20} />
                                Create Invoice
                            </Link>

                        )}
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="px-6 py-3 bg-[#F9FAFB] border-b border-[#E4E7EC]">
                            <div className="grid grid-cols-8 gap-4 text-[12px] font-medium text-[#667085] uppercase tracking-wide">
                                <div>Date</div>
                                <div>Client Name</div>
                                <div>Invoice ID</div>
                                <div>Status</div>
                                <div>Due Date</div>
                                <div>Amount</div>
                                <div>Balance Due</div>
                                <div></div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-[#E4E7EC]">
                            {paginatedInvoices.map((invoice) => (
                                <div key={invoice.id} className="px-6 py-4 hover:bg-[#F9FAFB] transition-colors">
                                    <div className="grid grid-cols-8 gap-4 items-center">
                                        <div className="text-[14px] text-[#101828]">
                                            {invoice.creationDate ? formatDate(invoice.creationDate) : 'N/A'}
                                        </div>
                                        <div className="text-[14px] text-[#101828] font-medium">
                                            {invoice.billTo?.businessName || invoice.billTo?.fullName || 'N/A'}
                                        </div>
                                        <div className="text-[14px] text-[#101828] font-mono">
                                            {invoice.invoiceNumber || 'N/A'}
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                {invoice.status || 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="text-[14px] text-[#101828]">
                                            {invoice.dueDate ? formatDate(invoice.dueDate) : 'N/A'}
                                        </div>
                                        <div className="text-[14px] text-[#101828] font-medium">
                                            {formatCurrency(invoice.totalDue || 0, invoice.currency)}
                                        </div>
                                        <div className="text-[14px] text-[#101828] font-medium">
                                            {formatCurrency(invoice.totalDue || 0, invoice.currency)}
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <div className="relative group">
                                                <button className="p-2 hover:bg-[#F2F4F7] rounded-lg transition-colors">
                                                    <MoreHorizontal size={16} className="text-[#667085]" />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E4E7EC] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                    <div className="py-1">
                                                        <Link
                                                            href={`/dashboard/invoices/${invoice.id}`}
                                                            className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#344054] hover:bg-[#F9FAFB] transition-colors"
                                                        >
                                                            <Eye size={16} />
                                                            View Invoice
                                                        </Link>
                                                        <Link
                                                            href={`/dashboard/invoices/edit/${invoice.id}`}
                                                            className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#344054] hover:bg-[#F9FAFB] transition-colors"
                                                        >
                                                            <Edit size={16} />
                                                            Edit Invoice
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteInvoice(invoice)}
                                                            className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#D92D20] hover:bg-[#FEF3F2] transition-colors w-full text-left"
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete Invoice
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center px-6 py-4 border-t border-[#E4E7EC]">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 text-[#667085] hover:text-[#101828] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg text-[14px] font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-[#2F80ED] text-white'
                                                        : 'text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828]'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <>
                                            <span className="text-[#667085] px-2">...</span>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="w-10 h-10 rounded-lg text-[14px] font-medium text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828] transition-colors"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 text-[#667085] hover:text-[#101828] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteInvoice}
                title="Delete Invoice"
                message={`Are you sure you want to delete invoice ${deleteModal.invoice?.invoiceNumber}? This action cannot be undone.`}
                type="invoice"
                isLoading={deleteModal.isLoading}
                error={deleteModal.error}
            />
        </div>
    );
};

export default InvoicesPage;
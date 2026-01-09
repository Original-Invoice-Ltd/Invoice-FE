"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, Edit3 } from "lucide-react";
import Link from "next/link";
import { ApiClient } from "@/lib/api";
import { InvoiceResponse } from "@/types/invoice";

const InvoiceEditPage = () => {
    const params = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInvoice, setEditedInvoice] = useState<InvoiceResponse | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchInvoice(params.id as string);
        }
    }, [params.id]);

    const fetchInvoice = async (invoiceId: string) => {
        try {
            setLoading(true);
            const response = await ApiClient.getInvoiceById(invoiceId);
            
            console.log('Invoice API Response for Edit:', response);
            
            if (response.status === 200 && response.data) {
                setInvoice(response.data);
                setEditedInvoice({ ...response.data });
            } else {
                setError(response.error || response.message || "Failed to fetch invoice");
            }
        } catch (err) {
            console.error("Error fetching invoice:", err);
            setError("An error occurred while fetching the invoice");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
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

    const handleSave = async () => {
        if (!editedInvoice) return;
        
        try {
            setSaving(true);
            
            // Create FormData for the update
            const formData = new FormData();
            
            // Add basic invoice data
            formData.append('invoiceNumber', editedInvoice.invoiceNumber || '');
            formData.append('note', editedInvoice.note || '');
            formData.append('currency', editedInvoice.currency || 'NGN');
            formData.append('dueDate', editedInvoice.dueDate);
            
            // Add bill from data
            if (editedInvoice.billFrom) {
                formData.append('billFromFullName', editedInvoice.billFrom.fullName || '');
                formData.append('billFromEmail', editedInvoice.billFrom.email || '');
                formData.append('billFromPhone', editedInvoice.billFrom.phone || '');
            }
            
            // Add items data
            if (editedInvoice.items) {
                editedInvoice.items.forEach((item, index) => {
                    formData.append(`items[${index}].itemName`, item.itemName);
                    formData.append(`items[${index}].description`, item.description || '');
                    formData.append(`items[${index}].quantity`, item.quantity.toString());
                    formData.append(`items[${index}].rate`, item.rate.toString());
                    formData.append(`items[${index}].amount`, item.amount.toString());
                });
            }
            
            const response = await ApiClient.updateInvoice(params.id as string, formData);
            
            if (response.status === 200) {
                // Update the original invoice with saved changes
                setInvoice({ ...editedInvoice });
                setIsEditing(false);
                
                // Show success message (you can add a toast notification here)
                console.log('Invoice updated successfully');
            } else {
                setError(response.error || response.message || "Failed to update invoice");
            }
        } catch (err) {
            console.error("Error updating invoice:", err);
            setError("An error occurred while updating the invoice");
        } finally {
            setSaving(false);
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        if (!editedInvoice) return;
        
        setEditedInvoice({
            ...editedInvoice,
            [field]: value
        });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        if (!editedInvoice || !editedInvoice.items) return;
        
        const updatedItems = [...editedInvoice.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };
        
        setEditedInvoice({
            ...editedInvoice,
            items: updatedItems
        });
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

    if (error || !invoice || !editedInvoice) {
        return (
            <div className="max-w-7xl mx-auto mb-[200px] p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error || "Invoice not found"}</p>
                    <Link
                        href="/dashboard/invoices"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Invoices
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mb-[200px] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/invoices"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#667085]" />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-semibold text-[#101828]">
                            {isEditing ? 'Edit Invoice' : 'Invoice Details'}
                        </h1>
                        <p className="text-[14px] text-[#667085]">
                            Invoice #{invoice.invoiceNumber}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => {
                                    setEditedInvoice({ ...invoice });
                                    setIsEditing(false);
                                }}
                                className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Save size={16} />
                                )}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href={`/dashboard/invoices/${invoice.id}`}
                                className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                            >
                                <Eye size={16} />
                                View Only
                            </Link>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                            >
                                <Edit3 size={16} />
                                Edit Invoice
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Editable Invoice Content */}
            <div className="bg-white rounded-lg border border-[#E4E7EC] overflow-hidden">
                <div className="p-8">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            {editedInvoice.logoUrl ? (
                                <img 
                                    src={editedInvoice.logoUrl} 
                                    alt="Company Logo" 
                                    className="h-16 w-auto object-contain"
                                />
                            ) : (
                                <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                                    Logo
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-[14px] text-[#667085] mb-1">Bill From</div>
                            {isEditing ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={editedInvoice.billFrom?.fullName || ''}
                                        onChange={(e) => handleFieldChange('billFrom', { ...editedInvoice.billFrom, fullName: e.target.value })}
                                        className="text-[16px] font-semibold text-[#101828] border border-gray-300 rounded px-2 py-1"
                                    />
                                    <input
                                        type="email"
                                        value={editedInvoice.billFrom?.email || ''}
                                        onChange={(e) => handleFieldChange('billFrom', { ...editedInvoice.billFrom, email: e.target.value })}
                                        className="text-[14px] text-[#667085] border border-gray-300 rounded px-2 py-1 block"
                                    />
                                    <input
                                        type="tel"
                                        value={editedInvoice.billFrom?.phone || ''}
                                        onChange={(e) => handleFieldChange('billFrom', { ...editedInvoice.billFrom, phone: e.target.value })}
                                        className="text-[14px] text-[#667085] border border-gray-300 rounded px-2 py-1 block"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="text-[16px] font-semibold text-[#101828]">{editedInvoice.billFrom?.fullName}</div>
                                    <div className="text-[14px] text-[#667085]">{editedInvoice.billFrom?.email}</div>
                                    <div className="text-[14px] text-[#667085]">{editedInvoice.billFrom?.phone}</div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Invoice Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-[32px] font-bold text-[#101828]">Invoice</h1>
                    </div>

                    {/* Bill To and Invoice Details */}
                    <div className="flex justify-between mb-8">
                        <div>
                            <div className="text-[14px] text-[#667085] mb-2">Bill To</div>
                            <div className="text-[16px] font-semibold text-[#101828] mb-1">
                                {editedInvoice.billTo?.businessName || editedInvoice.billTo?.fullName}
                            </div>
                            <div className="text-[14px] text-[#667085]">{editedInvoice.billTo?.email}</div>
                            <div className="text-[14px] text-[#667085]">{editedInvoice.billTo?.phone}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[14px] text-[#667085] mb-1">Invoice ID</div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInvoice.invoiceNumber || ''}
                                    onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                                    className="text-[16px] font-semibold text-[#101828] border border-gray-300 rounded px-2 py-1 mb-4"
                                />
                            ) : (
                                <div className="text-[16px] font-semibold text-[#101828] mb-4">{editedInvoice.invoiceNumber}</div>
                            )}
                            <div className="text-[14px] text-[#667085] mb-1">Invoice Date</div>
                            <div className="text-[14px] text-[#101828] mb-2">{formatDate(editedInvoice.creationDate)}</div>
                            <div className="text-[14px] text-[#667085] mb-1">Due Date</div>
                            <div className="text-[14px] text-[#101828]">{formatDate(editedInvoice.dueDate)}</div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <div className="bg-[#2F80ED] text-white px-6 py-3 rounded-t-lg">
                            <div className="grid grid-cols-5 gap-4 text-[14px] font-medium">
                                <div className="col-span-2">Item Description</div>
                                <div className="text-center">Qty</div>
                                <div className="text-center">Rate</div>
                                <div className="text-right">Amount</div>
                            </div>
                        </div>
                        <div className="border border-t-0 border-[#E4E7EC] rounded-b-lg">
                            {editedInvoice.items?.map((item, index) => (
                                <div key={index} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[#E4E7EC] last:border-b-0">
                                    <div className="col-span-2">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={item.itemName}
                                                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                                    className="text-[14px] font-medium text-[#101828] border border-gray-300 rounded px-2 py-1 w-full"
                                                />
                                                {item.description && (
                                                    <textarea
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        className="text-[12px] text-[#667085] border border-gray-300 rounded px-2 py-1 w-full"
                                                        rows={2}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-[14px] font-medium text-[#101828]">{item.itemName}</div>
                                                {item.description && (
                                                    <div className="text-[12px] text-[#667085] mt-1">{item.description}</div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="text-center text-[14px] text-[#101828]">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                                className="border border-gray-300 rounded px-2 py-1 w-16 text-center"
                                            />
                                        ) : (
                                            item.quantity
                                        )}
                                    </div>
                                    <div className="text-center text-[14px] text-[#101828]">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                                                className="border border-gray-300 rounded px-2 py-1 w-20 text-center"
                                            />
                                        ) : (
                                            formatCurrency(item.rate, editedInvoice.currency)
                                        )}
                                    </div>
                                    <div className="text-right text-[14px] font-medium text-[#101828]">
                                        {formatCurrency(item.amount, editedInvoice.currency)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end mb-8">
                        <div className="w-80">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-[#667085]">Sub Total</span>
                                    <span className="text-[#101828] font-medium">
                                        {formatCurrency(editedInvoice.subtotal, editedInvoice.currency)}
                                    </span>
                                </div>
                                {editedInvoice.appliedTaxes?.map((tax, index) => (
                                    <div key={index} className="flex justify-between text-[14px]">
                                        <span className="text-[#667085]">
                                            {tax.taxName} ({tax.appliedRate}%)
                                        </span>
                                        <span className="text-[#101828] font-medium">
                                            {formatCurrency(tax.taxAmount, editedInvoice.currency)}
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-[#E4E7EC] pt-2">
                                    <div className="flex justify-between text-[16px] font-semibold">
                                        <span className="text-[#101828]">Total</span>
                                        <span className="text-[#101828]">
                                            {formatCurrency(editedInvoice.totalDue, editedInvoice.currency)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 bg-[#2F80ED] text-white px-4 py-2 rounded text-center">
                                <div className="text-[14px] font-medium">Amount Due</div>
                                <div className="text-[18px] font-bold">
                                    {formatCurrency(editedInvoice.totalDue, editedInvoice.currency)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {(editedInvoice.note || isEditing) && (
                        <div className="mb-6">
                            <div className="text-[14px] font-medium text-[#101828] mb-2">Note</div>
                            {isEditing ? (
                                <textarea
                                    value={editedInvoice.note || ''}
                                    onChange={(e) => handleFieldChange('note', e.target.value)}
                                    className="w-full text-[14px] text-[#667085] border border-gray-300 rounded px-3 py-2"
                                    rows={3}
                                    placeholder="Add a note..."
                                />
                            ) : (
                                <div className="text-[14px] text-[#667085]">{editedInvoice.note}</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceEditPage;
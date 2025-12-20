"use client";

import { ChevronDown, Mail } from "lucide-react";

interface InvoiceItem {
    id: string;
    itemName: string;
    quantity: number;
    rate: number;
    tax: number;
    amount: number;
}

interface InvoiceData {
    logo: string | null;
    billFrom: {
        fullName: string;
        email: string;
        address: string;
        phoneNumber: string;
        businessName: string;
    };
    billTo: {
        customer: string;
        invoiceName: string;
        paymentTerms: string;
        invoiceDate: string;
        dueDate: string;
    };
    items: InvoiceItem[];
    customerNote: string;
    termsAndConditions: string;
    signature: string | null;
    currency: string;
    language: string;
    color: string;
    template: string;
    paymentDetails: {
        bankAccount: string;
        accountName: string;
        accountNumber: string;
    };
    vat: number;
    wht: number;
}

interface InvoicePreviewProps {
    data: InvoiceData;
    onEdit: () => void;
    onEmailInvoice: () => void;
}

const InvoicePreview = ({ data, onEdit, onEmailInvoice }: InvoicePreviewProps) => {
    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + item.amount, 0);
    };

    const calculateVAT = () => {
        return calculateSubtotal() * (data.vat / 100);
    };

    const calculateWHT = () => {
        return calculateSubtotal() * (data.wht / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateVAT() + calculateWHT();
    };

    const formatCurrency = (amount: number) => {
        return `${data.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-5xl mx-auto">
                {/* Header Actions - Outside white background */}
                <div className="flex justify-end gap-3 mb-6">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-6 py-2.5 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-blue-50 transition-colors bg-white"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.2055 19.5733C9.86497 19.9139 9.42656 20.1395 8.95154 20.2186L4.34563 20.9863C3.56372 21.1166 2.88583 20.4387 3.01615 19.6568L3.7838 15.0509C3.86297 14.5759 4.08859 14.1375 4.42911 13.797M10.2055 19.5733L18.7258 11.053L12.9494 5.27665M10.2055 19.5733L4.42911 13.797M4.42911 13.797L12.9494 5.27665M12.9494 5.27665L14.6119 3.61413C15.4308 2.79529 16.7584 2.79529 17.5772 3.61413L20.3859 6.42279C21.2057 7.24258 21.2046 8.57207 20.3834 9.39051L18.7258 11.0427M21 20.9863H15" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Edit
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-blue-50 transition-colors bg-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 14.25C21 14.4489 20.921 14.6397 20.7803 14.7803C20.6397 14.921 20.4489 15 20.25 15H18V16.5H19.5C19.6989 16.5 19.8897 16.579 20.0303 16.7197C20.171 16.8603 20.25 17.0511 20.25 17.25C20.25 17.4489 20.171 17.6397 20.0303 17.7803C19.8897 17.921 19.6989 18 19.5 18H18V19.5C18 19.6989 17.921 19.8897 17.7803 20.0303C17.6397 20.171 17.4489 20.25 17.25 20.25C17.0511 20.25 16.8603 20.171 16.7197 20.0303C16.579 19.8897 16.5 19.6989 16.5 19.5V14.25C16.5 14.0511 16.579 13.8603 16.7197 13.7197C16.8603 13.579 17.0511 13.5 17.25 13.5H20.25C20.4489 13.5 20.6397 13.579 20.7803 13.7197C20.921 13.8603 21 14.0511 21 14.25ZM8.625 16.125C8.625 16.8212 8.34844 17.4889 7.85616 17.9812C7.36387 18.4734 6.69619 18.75 6 18.75H5.25V19.5C5.25 19.6989 5.17098 19.8897 5.03033 20.0303C4.88968 20.171 4.69891 20.25 4.5 20.25C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25C3.75 14.0511 3.82902 13.8603 3.96967 13.7197C4.11032 13.579 4.30109 13.5 4.5 13.5H6C6.69619 13.5 7.36387 13.7766 7.85616 14.2688C8.34844 14.7611 8.625 15.4288 8.625 16.125ZM7.125 16.125C7.125 15.8266 7.00647 15.5405 6.7955 15.3295C6.58452 15.1185 6.29837 15 6 15H5.25V17.25H6C6.29837 17.25 6.58452 17.1315 6.7955 16.9205C7.00647 16.7095 7.125 16.4234 7.125 16.125ZM15.375 16.875C15.375 17.7701 15.0194 18.6285 14.3865 19.2615C13.7535 19.8944 12.8951 20.25 12 20.25H10.5C10.3011 20.25 10.1103 20.171 9.96967 20.0303C9.82902 19.8897 9.75 19.6989 9.75 19.5V14.25C9.75 14.0511 9.82902 13.8603 9.96967 13.7197C10.1103 13.579 10.3011 13.5 10.5 13.5H12C12.8951 13.5 13.7535 13.8556 14.3865 14.4885C15.0194 15.1215 15.375 15.9799 15.375 16.875ZM13.875 16.875C13.875 16.3777 13.6775 15.9008 13.3258 15.5492C12.9742 15.1975 12.4973 15 12 15H11.25V18.75H12C12.4973 18.75 12.9742 18.5525 13.3258 18.2008C13.6775 17.8492 13.875 17.3723 13.875 16.875ZM3.75 10.5V3.75C3.75 3.35218 3.90804 2.97064 4.18934 2.68934C4.47064 2.40804 4.85218 2.25 5.25 2.25H14.25C14.3485 2.24992 14.4461 2.26926 14.5371 2.3069C14.6282 2.34454 14.7109 2.39975 14.7806 2.46938L20.0306 7.71938C20.1003 7.78908 20.1555 7.87182 20.1931 7.96286C20.2307 8.05391 20.2501 8.15148 20.25 8.25V10.5C20.25 10.6989 20.171 10.8897 20.0303 11.0303C19.8897 11.171 19.6989 11.25 19.5 11.25C19.3011 11.25 19.1103 11.171 18.9697 11.0303C18.829 10.8897 18.75 10.6989 18.75 10.5V9H14.25C14.0511 9 13.8603 8.92098 13.7197 8.78033C13.579 8.63968 13.5 8.44891 13.5 8.25V3.75H5.25V10.5C5.25 10.6989 5.17098 10.8897 5.03033 11.0303C4.88968 11.171 4.69891 11.25 4.5 11.25C4.30109 11.25 4.11032 11.171 3.96967 11.0303C3.82902 10.8897 3.75 10.6989 3.75 10.5ZM15 7.5H17.6897L15 4.81031V7.5Z" fill="#2F80ED"/>
                        </svg>
                    </button>
                    <button
                        onClick={onEmailInvoice}
                        className="flex items-center gap-2 px-8 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Mail size={20} />
                        Email Invoice
                    </button>
                </div>

                {/* Invoice Content - White background */}
                <div className="bg-white  mb-4 rounded-lg shadow-sm">
                    <div className="px-12 py-4">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div className="flex items-center mt-8 justify-center at
                        ">
                            {data.logo ? (
                                <img src={data.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <span className="text-4xl font-medium text-black">Logo</span>
                            )}
                        </div>
                        <div className="text-right">
                            <h1 className="text-[28px] text-gray-900 mb-2">INVOICE</h1>
                            <p className="text-gray-600 mb-1">#{data.billTo.invoiceName || 'INV-002'}</p>
                            <p className="text-[14px] text-gray-500 mb-2">Balance Due</p>
                            <p className="text-[16px] font-semibold text-gray-900">{formatCurrency(calculateTotal())}</p>
                        </div>
                    </div>

                    {/* Invoice Details */}     
                    <div className="flex justify-between mb-8">
   
                        <div className="flex-1 text-right">
                            <div className="inline-block text-left space-y-2">
                                <div className="flex justify-between gap-16">
                                    <span className="text-sm text-gray-600">Invoice Date</span>
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(data.billTo.invoiceDate)}</span>
                                </div>
                                <div className="flex justify-between gap-16">
                                    <span className="text-sm text-gray-600">Terms</span>
                                    <span className="text-sm text-gray-900 font-medium">{data.billTo.paymentTerms || 'Net 60'}</span>
                                </div>
                                <div className="flex justify-between gap-16">
                                    <span className="text-sm text-gray-600">Due Date</span>
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(data.billTo.dueDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="mb-5">
                        <div className="flex justify-between">
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill From</h3>
                                <p className="text-gray-900 font-medium">{data.billFrom.fullName}</p>
                                <p className="text-gray-600 text-sm">{data.billFrom.address || 'Nigeria'}</p>
                                <p className="text-gray-600 text-sm">{data.billFrom.email}</p>
                            </div>
                            <div className="flex-1 text-right">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To</h3>
                                <p className="text-gray-900 font-medium">{data.billTo.customer}</p>
                                <p className="text-gray-600 text-sm">Lagos, Nigeria</p>
                                <p className="text-gray-600 text-sm">{data.billFrom.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#F8F8FA]">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200 w-16">#</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200">Item Detail</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200 w-24">Qty</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200 w-32">Rate</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200 w-32">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="py-4 px-4 text-gray-900 border border-gray-200">{index + 1}</td>
                                        <td className="py-4 px-4 text-gray-900 border border-gray-200">{item.itemName}</td>
                                        <td className="py-4 px-4 text-right text-gray-900 border border-gray-200">{item.quantity}</td>
                                        <td className="py-4 px-4 text-right text-gray-900 border border-gray-200">{item.rate.toLocaleString()}</td>
                                        <td className="py-4 px-4 text-right text-gray-900 font-medium border border-gray-200">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-12 text-[16px]">
                        <div className="w-80">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Sub Total</span>
                                <span className="text-gray-900">{formatCurrency(calculateSubtotal())}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">VAT ({data.vat}%)</span>
                                <span className="text-gray-900 ">{formatCurrency(calculateVAT())}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">WHT ({data.wht}%)</span>
                                <span className="text-gray-900 ">{formatCurrency(calculateWHT())}</span>
                            </div>
                            <div className="flex justify-between py-2 ">
                                <span className="text-gray-900 font-medium">Total</span>
                                <span className="text-gray-900 font-medium">{formatCurrency(calculateTotal())}</span>
                            </div>
                            <div className="flex justify-between py-2 bg-blue-50 px-4 rounded-lg mt-1">
                                <span className="text-gray-900 font-medium">Balance Due</span>
                                <span className="text-gray-900 font-medium">{formatCurrency(calculateTotal())}</span>
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    {data.signature && (
                        <div className="mb-12">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Signature</h3>
                            <img src={data.signature} alt="Signature" className="h-16" />
                        </div>
                    )}

                    {/* Note */}
                    {data.customerNote && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                            <p className="text-gray-600 text-sm">{data.customerNote}</p>
                        </div>
                    )}

                    {/* Terms of Payment */}
                    {data.termsAndConditions && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                            <p className="text-gray-600 text-sm">{data.termsAndConditions}</p>
                        </div>
                    )}

                    {/* Payment Method */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method: Bank Transfer</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bank Name:</span>
                                <span className="text-gray-900 font-medium">{data.paymentDetails.bankAccount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account Number</span>
                                <span className="text-gray-900 font-medium">{data.paymentDetails.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account Name</span>
                                <span className="text-gray-900 font-medium">{data.paymentDetails.accountName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Send Button */}
                    <div className="flex justify-end">
                        <button className="flex items-center gap-2 px-8 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <Mail size={20} />
                            Send
                            <ChevronDown size={20} />
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;

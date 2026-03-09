"use client";

import { Download, Printer, CreditCard, HelpCircle } from "lucide-react";

interface CustomerSidebarProps {
    invoiceStatus: string;
    totalDue: number;
    currency: string;
}

const CustomerSidebar = ({ invoiceStatus, totalDue, currency }: CustomerSidebarProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]';
            case 'UNPAID':
                return 'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]';
            case 'OVERDUE':
                return 'bg-[#FEF3C7] text-[#F59E0B] border-[#F59E0B]';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-300';
        }
    };

    const formatCurrency = (amount: number) => {
        return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="w-80 bg-white border-l border-[#E4E7EC] p-6 space-y-6">
            {/* Invoice Status */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-[#101828] mb-3">Invoice Status</h3>
                <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(invoiceStatus)}`}>
                    {invoiceStatus}
                </div>
                <div className="mt-4">
                    <p className="text-sm text-[#667085] mb-1">Amount Due</p>
                    <p className="text-2xl font-bold text-[#101828]">{formatCurrency(totalDue)}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#101828]">Quick Actions</h4>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#344054] hover:bg-gray-50 rounded-lg border border-[#E4E7EC] transition-colors">
                    <Download size={20} className="text-[#667085]" />
                    <span className="font-medium">Download PDF</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#344054] hover:bg-gray-50 rounded-lg border border-[#E4E7EC] transition-colors">
                    <Printer size={20} className="text-[#667085]" />
                    <span className="font-medium">Print Invoice</span>
                </button>

                {invoiceStatus === 'UNPAID' && (
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-white bg-[#2F80ED] hover:bg-blue-600 rounded-lg transition-colors">
                        <CreditCard size={20} />
                        <span className="font-medium">Pay Now</span>
                    </button>
                )}
            </div>

            {/* Help Section */}
            <div className="bg-[#F9FAFB] rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <HelpCircle size={20} className="text-[#2F80ED] mt-0.5" />
                    <div>
                        <h5 className="text-sm font-semibold text-[#101828] mb-1">Need Help?</h5>
                        <p className="text-xs text-[#667085] mb-3">
                            Have questions about this invoice? Contact support for assistance.
                        </p>
                        <button className="text-xs text-[#2F80ED] font-medium hover:underline">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Instructions */}
            {invoiceStatus === 'UNPAID' && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="text-sm font-semibold text-[#101828] mb-2">Payment Instructions</h5>
                    <p className="text-xs text-[#667085] mb-2">
                        Use the bank details provided in the invoice to make your payment.
                    </p>
                    <p className="text-xs text-[#2F80ED] font-medium">
                        Please include the invoice number in your payment reference.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CustomerSidebar;
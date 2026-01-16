"use client";

import { CustomerLayout } from "@/components/customerSection";
import { useRouter, useParams } from "next/navigation";

// Mock payment data
const mockPayments = [
    {
        id: 1,
        amount: "₦8,000.00",
        status: "Successful",
        creditedTo: "Available Balance",
        senderDetails: "IYATUN EMMANUEL\nMONIE POINT | 827****166",
        remark: "IYATUN EMMAN Trf for\nCustomerAT126TRF2MPT18l4e19976764260659\n11808AT126TRF2MPT18l4e19976764260659",
        transactionType: "Bank Deposit",
        transactionNo: "251207060100174145326343",
        transactionDate: "Dec 7th, 2025 15:35:50",
        sessionId: "090405251207153549991866765126",
        fileName: "Img 4568",
        uploadedDate: "Dec 9, 2025 at 2:30 PM",
        approvalStatus: "Approved by Business"
    },
    {
        id: 2,
        amount: "₦85,000.00",
        status: "Pending",
        creditedTo: "Available Balance",
        senderDetails: "JOHN DOE\nGTBANK | 012****789",
        remark: "Payment for INV-00122\nSolar Panel Installation",
        transactionType: "Bank Transfer",
        transactionNo: "251207060100174145326344",
        transactionDate: "Dec 5th, 2025 10:20:30",
        sessionId: "090405251207153549991866765127",
        fileName: "Receipt_002",
        uploadedDate: "Dec 6, 2025 at 11:00 AM",
        approvalStatus: "Pending Review"
    },
    {
        id: 3,
        amount: "₦112,000.00",
        status: "Successful",
        creditedTo: "Available Balance",
        senderDetails: "MARY JOHNSON\nZENITH BANK | 100****456",
        remark: "Payment for consulting services\nINV-00121",
        transactionType: "Bank Transfer",
        transactionNo: "251207060100174145326345",
        transactionDate: "Dec 3rd, 2025 14:15:00",
        sessionId: "090405251207153549991866765128",
        fileName: "Payment_Receipt_003",
        uploadedDate: "Dec 4, 2025 at 9:45 AM",
        approvalStatus: "Approved by Business"
    },
    {
        id: 4,
        amount: "₦112,000.00",
        status: "Pending",
        creditedTo: "Available Balance",
        senderDetails: "PETER OKONKWO\nFIRST BANK | 300****222",
        remark: "Invoice payment\nCustomer reference: INV-00121",
        transactionType: "Bank Deposit",
        transactionNo: "251207060100174145326346",
        transactionDate: "Dec 1st, 2025 16:45:20",
        sessionId: "090405251207153549991866765129",
        fileName: "Transfer_Receipt",
        uploadedDate: "Dec 2, 2025 at 3:00 PM",
        approvalStatus: "Pending Review"
    }
];

const PaymentDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const payment = mockPayments.find(p => p.id === parseInt(id));

    if (!payment) {
        return (
            <CustomerLayout>
                <div className="flex-1 p-6">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Payment Not Found</h1>
                        <button 
                            onClick={() => router.push('/customer/payments')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Payments
                        </button>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div className="flex-1 p-6">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="mb-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="#2F80ED" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
                    </svg>
                </button>

                {/* Payment Evidence Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Evidence</h2>

                    {/* Receipt Card with overlay */}
                    <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-6">
                        {/* Left side dark overlay */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-black/40 rounded-l-lg"></div>
                        
                        <div className="p-6 pl-20">
                            {/* Amount and Status */}
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{payment.amount}</h1>
                                <div className="flex items-center justify-center gap-2">
                                    {payment.status === "Successful" ? (
                                        <>
                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-green-500 font-medium">Successful</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-yellow-500 font-medium">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Transaction Details</h3>
                                
                                <div className="space-y-4">
                                    {/* Credited to */}
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm text-gray-500">Credited to</span>
                                        <div className="flex items-center gap-1 text-right">
                                            <span className="text-sm font-medium text-gray-900">{payment.creditedTo}</span>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>

                                {/* Sender Details */}
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Sender Details</span>
                                    <span className="text-sm font-medium text-gray-900 text-right whitespace-pre-line">{payment.senderDetails}</span>
                                </div>

                                {/* Remark */}
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Remark</span>
                                    <span className="text-sm font-medium text-gray-900 text-right whitespace-pre-line max-w-xs">{payment.remark}</span>
                                </div>

                                {/* Transaction Type */}
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Transaction Type</span>
                                    <span className="text-sm font-medium text-gray-900">{payment.transactionType}</span>
                                </div>

                                {/* Transaction No */}
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Transaction No.</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">{payment.transactionNo}</span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Transaction Date */}
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Transaction Date</span>
                                    <span className="text-sm font-medium text-gray-900">{payment.transactionDate}</span>
                                </div>

                                {/* Session ID */}
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Session ID</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">{payment.sessionId}</span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        </div>
                        </div>
                    </div>

                    {/* File Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-red-600">PDF</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{payment.fileName}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Uploaded: {payment.uploadedDate}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-green-600">{payment.approvalStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default PaymentDetailPage;
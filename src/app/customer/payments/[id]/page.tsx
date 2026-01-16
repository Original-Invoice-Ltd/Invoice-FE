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
            <div className="flex-1 p-4 sm:p-6">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="mb-4 sm:mb-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="#2F80ED" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
                    </svg>
                </button>

                {/* Payment Evidence Title - Outside card on mobile */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:hidden">Payment Evidence</h2>

                {/* Payment Evidence Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 max-w-2xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 hidden sm:block">Payment Evidence</h2>

                    {/* Receipt Card with overlay */}
                    <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-6">
                        {/* Left side dark overlay */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 sm:w-4 bg-gray-400 rounded-l-lg"></div>
                        
                        <div className="p-4 sm:p-6 pl-6 sm:pl-8">
                            {/* Mobile header with back and icons */}
                            <div className="flex items-center justify-between mb-4 sm:hidden">
                                <div className="flex items-center gap-2">
                                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">GT APP</div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span>···</span>
                                </div>
                            </div>
                            
                            {/* Transaction Details Header - Mobile */}
                            <div className="flex items-center justify-between mb-4 sm:hidden border-b border-gray-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="font-medium text-gray-900">Transaction Details</span>
                                </div>
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            {/* Transfer info - Mobile */}
                            <div className="text-center mb-4 sm:hidden">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-500">Transfer from IYATUN EMMANUEL</p>
                            </div>

                            {/* Amount and Status */}
                            <div className="text-center mb-4 sm:mb-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{payment.amount}</h1>
                                <div className="flex items-center justify-center gap-2">
                                    {payment.status === "Successful" ? (
                                        <>
                                            <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-green-500 font-medium text-sm sm:text-base">Successful</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-yellow-500 font-medium text-sm sm:text-base">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Transaction Details</h3>
                                
                                <div className="space-y-3 sm:space-y-4">
                                    {/* Credited to */}
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs sm:text-sm text-gray-500">Credited to</span>
                                        <div className="flex items-center gap-1 text-right">
                                            <span className="text-xs sm:text-sm font-medium text-gray-900">{payment.creditedTo}</span>
                                            <svg className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>

                                {/* Sender Details */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs sm:text-sm text-gray-500">Sender Details</span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-900 text-right whitespace-pre-line">{payment.senderDetails}</span>
                                </div>

                                {/* Remark */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs sm:text-sm text-gray-500">Remark</span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-900 text-right whitespace-pre-line max-w-[180px] sm:max-w-xs">{payment.remark}</span>
                                </div>

                                {/* Transaction Type */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs sm:text-sm text-gray-500">Transaction Type</span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-900">{payment.transactionType}</span>
                                </div>

                                {/* Transaction No */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs sm:text-sm text-gray-500">Transaction No.</span>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{payment.transactionNo}</span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Transaction Date */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs sm:text-sm text-gray-500">Transaction Date</span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-900">{payment.transactionDate}</span>
                                </div>

                                {/* Session ID */}
                                <div className="flex justify-between items-start">
                                    <span className="text-xs sm:text-sm text-gray-500">Session ID</span>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{payment.sessionId}</span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* More Actions - Mobile only */}
                        <div className="border-t border-gray-200 pt-4 mt-4 sm:hidden">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">More Actions</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-gray-500">Category</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-gray-900">Deposit</span>
                                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-blue-500 mb-4">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="text-xs">Transfer Bank</span>
                            </div>
                            <button className="w-full py-3 bg-green-500 text-white rounded-full font-medium text-sm">
                                Share Receipt
                            </button>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        </div>
                        </div>
                    </div>

                    {/* File Info */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
                                <path fill="#fff" stroke="#EDEDED" strokeWidth="1.5" d="M10 .75h10.515a5.25 5.25 0 0 1 3.712 1.538l9.485 9.485a5.25 5.25 0 0 1 1.538 3.712V34c0 2.9-2.35 5.25-5.25 5.25H10A5.25 5.25 0 0 1 4.75 34V6C4.75 3.1 7.1.75 10 .75Z"/>
                                <path stroke="#EDEDED" strokeWidth="1.5" d="M23 1v8a4 4 0 0 0 4 4h8"/>
                                <path fill="#2F80ED" d="M0 22a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-8Z"/>
                                <path fill="#fff" d="M3.79 30v-8h3c.614 0 1.13.115 1.546.344.42.229.736.544.95.945.215.398.323.852.323 1.36 0 .512-.108.968-.324 1.367a2.316 2.316 0 0 1-.957.941c-.422.227-.941.34-1.558.34H4.78v-1.192h1.793c.36 0 .654-.062.883-.187.23-.125.398-.297.508-.516a1.63 1.63 0 0 0 .168-.754c0-.283-.056-.533-.168-.75a1.141 1.141 0 0 0-.512-.503c-.229-.123-.525-.184-.887-.184H5.238V30H3.79Zm10.01 0h-2.712v-8h2.766c.794 0 1.476.16 2.047.48a3.212 3.212 0 0 1 1.32 1.372c.307.596.46 1.31.46 2.14 0 .834-.154 1.55-.464 2.149a3.212 3.212 0 0 1-1.332 1.379c-.578.32-1.273.48-2.086.48Zm-1.263-1.254h1.192c.557 0 1.022-.101 1.394-.305a1.95 1.95 0 0 0 .84-.918c.188-.408.281-.919.281-1.53 0-.613-.093-1.12-.28-1.524a1.918 1.918 0 0 0-.833-.91c-.364-.204-.818-.305-1.36-.305h-1.234v5.492ZM19.28 30v-8h5.125v1.215h-3.676v2.172h3.324v1.215h-3.324V30h-1.45Z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{payment.fileName}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Uploaded: {payment.uploadedDate}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    {payment.status === "Successful" ? (
                                        <>
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-green-600">{payment.approvalStatus}</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-yellow-600">Pending Review</span>
                                        </>
                                    )}
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
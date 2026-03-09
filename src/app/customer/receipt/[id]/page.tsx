"use client";

import { CustomerLayout } from "@/components/customerSection";
import { useRouter, useParams } from "next/navigation";

const ReceiptPage = () => {
    const router = useRouter();
    const params = useParams();

    return (
        <CustomerLayout>
            <div className="flex-1 p-6 bg-[#F9FAFB]">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="mb-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="#2F80ED" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
                    </svg>
                </button>

                {/* Receipt Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-xl mx-auto">
                    {/* Receipt Header */}
                    <div className="text-center pt-6 sm:pt-8 pb-4 px-4 sm:px-8">
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#101828] mb-4">Payment Receipt</h2>
                        {/* Dashed line - matching the image style */}
                        <div className="flex justify-center gap-1 flex-wrap">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div key={i} className="w-1.5 sm:w-2 h-0.5 bg-gray-300 rounded-full"></div>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 sm:px-8 pb-6 sm:pb-8">
                        {/* Logo */}
                        <div className="flex justify-center my-6 sm:my-8">
                            <div className="bg-[#E8F4FD] text-[#101828] px-8 sm:px-12 py-3 sm:py-4 rounded-lg font-semibold text-lg sm:text-xl">
                                LOGO
                            </div>
                        </div>

                        {/* Receipt Info - Two columns layout on desktop, stacked on mobile */}
                        <div className="space-y-2 mb-8">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Receipt Number:</span>
                                <span className="font-semibold text-[#101828]">RCT-000983</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Receipt Date:</span>
                                <span className="font-semibold text-[#101828]">20 Dec 2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Invoice Number:</span>
                                <span className="font-semibold text-[#101828]">INV-004532</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Invoice Issue Date:</span>
                                <span className="font-semibold text-[#101828]">12 Dec 2025</span>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-[#101828] text-lg mb-2">Customer Information</h3>
                            <p className="text-[#101828]">James Victor ·</p>
                            <p className="text-[#101828]">jamesvictor@gmail.com</p>
                        </div>

                        {/* Items Table - Responsive */}
                        <div className="mb-6 overflow-x-auto">
                            <table className="w-full min-w-[300px]">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 text-gray-500 font-normal text-xs sm:text-sm w-8">#</th>
                                        <th className="text-left py-3 text-gray-500 font-normal text-xs sm:text-sm">Item</th>
                                        <th className="text-center py-3 text-gray-500 font-normal text-xs sm:text-sm w-12 sm:w-16">Qty</th>
                                        <th className="text-center py-3 text-gray-500 font-normal text-xs sm:text-sm w-12 sm:w-16">Rate</th>
                                        <th className="text-right py-3 text-gray-500 font-normal text-xs sm:text-sm w-16 sm:w-20">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-4 text-[#101828] text-sm">1</td>
                                        <td className="py-4 text-[#101828] text-sm">Cooperate Shoes</td>
                                        <td className="py-4 text-center text-[#101828] text-sm">1000</td>
                                        <td className="py-4 text-center text-[#101828] text-sm"></td>
                                        <td className="py-4 text-right font-medium text-[#101828] text-sm">₦5,000</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-4 text-[#101828] text-sm">2</td>
                                        <td className="py-4 text-[#101828] text-sm">MacBook Pro 2020 Laptop</td>
                                        <td className="py-4 text-center text-[#101828] text-sm">50000</td>
                                        <td className="py-4 text-center text-[#101828] text-sm"></td>
                                        <td className="py-4 text-right font-medium text-[#101828] text-sm">₦50,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Payment Summary */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-[#101828] text-lg mb-3">Payment Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sub Total</span>
                                    <span className="text-[#101828]">55,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">VAT (7.5%)</span>
                                    <span className="text-[#101828]">3,750</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span className="text-[#101828]">Total Amount Paid</span>
                                    <span className="text-[#101828]">₦59,000</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Confirmation */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-[#101828] text-lg mb-3">Payment Confirmation</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="text-[#101828]">Bank Transfer</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Date</span>
                                    <span className="text-[#101828]">19 Dec 2025</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Confirmed By</span>
                                    <span className="text-[#101828]">Tech Solution Ltd</span>
                                </div>
                            </div>
                        </div>

                        {/* QR Code - Smaller on mobile */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 sm:w-28 h-20 sm:h-28">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <rect x="0" y="0" width="100" height="100" fill="white"/>
                                    {/* Top-left position pattern */}
                                    <rect x="4" y="4" width="22" height="22" fill="#000"/>
                                    <rect x="7" y="7" width="16" height="16" fill="white"/>
                                    <rect x="10" y="10" width="10" height="10" fill="#000"/>
                                    {/* Top-right position pattern */}
                                    <rect x="74" y="4" width="22" height="22" fill="#000"/>
                                    <rect x="77" y="7" width="16" height="16" fill="white"/>
                                    <rect x="80" y="10" width="10" height="10" fill="#000"/>
                                    {/* Bottom-left position pattern */}
                                    <rect x="4" y="74" width="22" height="22" fill="#000"/>
                                    <rect x="7" y="77" width="16" height="16" fill="white"/>
                                    <rect x="10" y="80" width="10" height="10" fill="#000"/>
                                    {/* Data modules - row 1 */}
                                    <rect x="30" y="4" width="4" height="4" fill="#000"/>
                                    <rect x="38" y="4" width="4" height="4" fill="#000"/>
                                    <rect x="46" y="4" width="4" height="4" fill="#000"/>
                                    <rect x="54" y="4" width="4" height="4" fill="#000"/>
                                    <rect x="62" y="4" width="4" height="4" fill="#000"/>
                                    {/* Data modules - row 2 */}
                                    <rect x="30" y="12" width="4" height="4" fill="#000"/>
                                    <rect x="42" y="12" width="4" height="4" fill="#000"/>
                                    <rect x="50" y="12" width="4" height="4" fill="#000"/>
                                    <rect x="66" y="12" width="4" height="4" fill="#000"/>
                                    {/* Data modules - row 3 */}
                                    <rect x="34" y="20" width="4" height="4" fill="#000"/>
                                    <rect x="46" y="20" width="4" height="4" fill="#000"/>
                                    <rect x="58" y="20" width="4" height="4" fill="#000"/>
                                    {/* Middle section */}
                                    <rect x="30" y="30" width="4" height="4" fill="#000"/>
                                    <rect x="38" y="30" width="4" height="4" fill="#000"/>
                                    <rect x="46" y="30" width="4" height="4" fill="#000"/>
                                    <rect x="54" y="30" width="4" height="4" fill="#000"/>
                                    <rect x="62" y="30" width="4" height="4" fill="#000"/>
                                    <rect x="70" y="30" width="4" height="4" fill="#000"/>
                                    <rect x="78" y="30" width="4" height="4" fill="#000"/>
                                    <rect x="86" y="30" width="4" height="4" fill="#000"/>
                                    {/* More data rows */}
                                    <rect x="4" y="38" width="4" height="4" fill="#000"/>
                                    <rect x="12" y="38" width="4" height="4" fill="#000"/>
                                    <rect x="20" y="38" width="4" height="4" fill="#000"/>
                                    <rect x="34" y="38" width="4" height="4" fill="#000"/>
                                    <rect x="50" y="38" width="4" height="4" fill="#000"/>
                                    <rect x="58" y="38" width="4" height="4" fill="#000"/>
                                    <rect x="74" y="38" width="4" height="4" fill="#000"/>
                                    <rect x="86" y="38" width="4" height="4" fill="#000"/>
                                    {/* Row 5 */}
                                    <rect x="4" y="46" width="4" height="4" fill="#000"/>
                                    <rect x="16" y="46" width="4" height="4" fill="#000"/>
                                    <rect x="30" y="46" width="4" height="4" fill="#000"/>
                                    <rect x="42" y="46" width="4" height="4" fill="#000"/>
                                    <rect x="54" y="46" width="4" height="4" fill="#000"/>
                                    <rect x="66" y="46" width="4" height="4" fill="#000"/>
                                    <rect x="78" y="46" width="4" height="4" fill="#000"/>
                                    <rect x="92" y="46" width="4" height="4" fill="#000"/>
                                    {/* Row 6 */}
                                    <rect x="8" y="54" width="4" height="4" fill="#000"/>
                                    <rect x="20" y="54" width="4" height="4" fill="#000"/>
                                    <rect x="38" y="54" width="4" height="4" fill="#000"/>
                                    <rect x="46" y="54" width="4" height="4" fill="#000"/>
                                    <rect x="62" y="54" width="4" height="4" fill="#000"/>
                                    <rect x="70" y="54" width="4" height="4" fill="#000"/>
                                    <rect x="82" y="54" width="4" height="4" fill="#000"/>
                                    {/* Row 7 */}
                                    <rect x="4" y="62" width="4" height="4" fill="#000"/>
                                    <rect x="12" y="62" width="4" height="4" fill="#000"/>
                                    <rect x="24" y="62" width="4" height="4" fill="#000"/>
                                    <rect x="34" y="62" width="4" height="4" fill="#000"/>
                                    <rect x="50" y="62" width="4" height="4" fill="#000"/>
                                    <rect x="58" y="62" width="4" height="4" fill="#000"/>
                                    <rect x="74" y="62" width="4" height="4" fill="#000"/>
                                    <rect x="86" y="62" width="4" height="4" fill="#000"/>
                                    {/* Bottom right area */}
                                    <rect x="30" y="74" width="4" height="4" fill="#000"/>
                                    <rect x="42" y="74" width="4" height="4" fill="#000"/>
                                    <rect x="54" y="74" width="4" height="4" fill="#000"/>
                                    <rect x="66" y="74" width="4" height="4" fill="#000"/>
                                    <rect x="78" y="74" width="4" height="4" fill="#000"/>
                                    <rect x="90" y="74" width="4" height="4" fill="#000"/>
                                    <rect x="34" y="82" width="4" height="4" fill="#000"/>
                                    <rect x="46" y="82" width="4" height="4" fill="#000"/>
                                    <rect x="58" y="82" width="4" height="4" fill="#000"/>
                                    <rect x="70" y="82" width="4" height="4" fill="#000"/>
                                    <rect x="82" y="82" width="4" height="4" fill="#000"/>
                                    <rect x="30" y="90" width="4" height="4" fill="#000"/>
                                    <rect x="38" y="90" width="4" height="4" fill="#000"/>
                                    <rect x="50" y="90" width="4" height="4" fill="#000"/>
                                    <rect x="62" y="90" width="4" height="4" fill="#000"/>
                                    <rect x="74" y="90" width="4" height="4" fill="#000"/>
                                    <rect x="86" y="90" width="4" height="4" fill="#000"/>
                                </svg>
                            </div>
                        </div>

                        {/* Footer text */}
                        <div className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
                            <p>This receipt was autogenerated by <span className="text-[#2F80ED]">Original Invoice</span>.</p>
                            <p>This document serves as proof of payment.</p>
                        </div>

                        {/* Download button - full width on mobile */}
                        <div className="flex justify-center sm:justify-end">
                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-[#2F80ED] text-[#2F80ED] rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                    <path d="M2.5 12.5V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H15.8333C16.2754 17.5 16.6993 17.3244 17.0118 17.0118C17.3244 16.6993 17.5 16.2754 17.5 15.8333V12.5M5.83333 8.33333L10 12.5M10 12.5L14.1667 8.33333M10 12.5V2.5" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default ReceiptPage;
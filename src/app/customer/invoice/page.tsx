"use client";

import { useRouter } from "next/navigation";
import { CustomerLayout } from "@/components/customerSection";

const InvoiceIndexPage = () => {
    const router = useRouter();

    return (
        <CustomerLayout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Access</h1>
                    <p className="text-gray-600 mb-6">Please provide an invoice ID to view the invoice.</p>
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push('/customer/invoice/1')}
                            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View Sample Invoice #1
                        </button>
                        <button
                            onClick={() => router.push('/customer/dashboard')}
                            className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default InvoiceIndexPage;
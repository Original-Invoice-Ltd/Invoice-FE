"use client";

interface InvoiceItem {
    id: number;
    itemName: string;
    quantity: number;
    rate: number;
    amount: number;
    description?: string;
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
        title: string;
        invoiceNumber: string;
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
    paymentDetails: {
        bankAccount: string;
        accountName: string;
        accountNumber: string;
    };
    vat: number;
    wht: number;
}

interface StandardTemplateProps {
    data: InvoiceData;
}

const StandardTemplate = ({ data }: StandardTemplateProps) => {
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
        <div className="bg-white p-12">
            {/* Logo */}
            <div className="mb-12">
                {data.logo ? (
                    <img src={data.logo} alt="Logo" className="max-w-[150px] max-h-[80px] object-contain" />
                ) : (
                    <span className="text-4xl font-semibold text-gray-900">Logo</span>
                )}
            </div>

            {/* Invoice Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">INVOICE</h1>

            {/* Bill From and Bill To */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill From</h3>
                    <p className="text-sm font-semibold text-gray-900">{data.billFrom.fullName}</p>
                    <p className="text-sm text-gray-600">{data.billFrom.address || 'Nigeria'}</p>
                    <p className="text-sm text-gray-600">{data.billFrom.email}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill To</h3>
                    <p className="text-sm font-semibold text-gray-900">{data.billTo.customer}</p>
                    <p className="text-sm text-gray-600">Lagos, Nigeria</p>
                    <p className="text-sm text-gray-600">{data.billFrom.email}</p>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Invoice</span>
                        <span className="text-sm text-gray-900 font-medium">Invoice</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Invoice Date</span>
                        <span className="text-sm text-gray-900 font-medium">{formatDate(data.billTo.invoiceDate)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Terms</span>
                        <span className="text-sm text-gray-900 font-medium">{data.billTo.paymentTerms || 'Net 60'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Due Date</span>
                        <span className="text-sm text-gray-900 font-medium">{formatDate(data.billTo.dueDate)}</span>
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600"></span>
                        <span className="text-sm text-gray-900 font-medium">#{data.billTo.invoiceNumber || 'INV-002'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600"></span>
                        <span className="text-sm text-gray-900 font-medium">{formatDate(data.billTo.invoiceDate)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600"></span>
                        <span className="text-sm text-gray-900 font-medium">{data.billTo.paymentTerms || 'Net 60'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600"></span>
                        <span className="text-sm text-gray-900 font-medium">{formatDate(data.billTo.dueDate)}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 border border-blue-200">#</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 border border-blue-200">Item Detail</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 border border-blue-200">Qty</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 border border-blue-200">Rate</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 border border-blue-200">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, index) => (
                            <tr key={item.id} className="border border-gray-200">
                                <td className="py-4 px-4 text-sm text-gray-900 border border-gray-200">{index + 1}</td>
                                <td className="py-4 px-4 text-sm text-gray-900 border border-gray-200">{item.itemName}</td>
                                <td className="py-4 px-4 text-right text-sm text-gray-900 border border-gray-200">{item.quantity}</td>
                                <td className="py-4 px-4 text-right text-sm text-gray-900 border border-gray-200">{item.rate.toLocaleString()}</td>
                                <td className="py-4 px-4 text-right text-sm font-medium text-gray-900 border border-gray-200">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Section - Right Aligned */}
            <div className="flex justify-end mb-12">
                <div className="w-80">
                    <div className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">Sub Total</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">VAT ({data.vat}%)</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(calculateVAT())}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                        <span className="text-gray-600">WHT ({data.wht}%)</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(calculateWHT())}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm border-t border-gray-200 mt-2 pt-2">
                        <span className="text-gray-900 font-semibold">Total</span>
                        <span className="text-gray-900 font-semibold">{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4 bg-blue-100 text-gray-900 rounded mt-2 text-sm font-semibold border border-blue-200">
                        <span>Balance Due</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                </div>
            </div>

            {/* Signature */}
            {data.signature && (
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Signature</h3>
                    <img src={data.signature} alt="Signature" className="h-12" />
                </div>
            )}

            {/* Note */}
            {data.customerNote && (
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                    <p className="text-sm text-gray-600">{data.customerNote}</p>
                </div>
            )}

            {/* Terms of Payment */}
            {data.termsAndConditions && (
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                    <p className="text-sm text-gray-600">{data.termsAndConditions}</p>
                </div>
            )}

            {/* Payment Method */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Method: Bank Transfer</h3>
                <div className="space-y-2 text-sm">
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
        </div>
    );
};

export default StandardTemplate;

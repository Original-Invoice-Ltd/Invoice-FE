// Shared mock data for invoices
export interface Invoice {
    id: number;
    date: string;
    issuedBy: string;
    invoiceId: string;
    status: "Paid" | "Pending" | "Overdue";
    dueDate: string;
    amount: string;
    // Detailed invoice information
    billTo: {
        name: string;
        location: string;
        email: string;
    };
    billFrom: {
        company: string;
        email: string;
    };
    dates: {
        invoiceDate: string;
        paymentTerms: string;
        dueDate: string;
    };
    items: {
        id: number;
        description: string;
        qty: number;
        rate: number;
        amount: number;
    }[];
    totals: {
        subTotal: number;
        vat: number;
        wht: number;
        total: number;
        balanceDue: number;
    };
    signature: string;
    note: string;
    termsOfPayment: string;
    paymentMethod: {
        method: string;
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

export const mockInvoices: Invoice[] = [
    {
        id: 1,
        date: "Oct 25, 2025",
        issuedBy: "Tech Solutions Ltd",
        invoiceId: "INV-00123",
        status: "Paid",
        dueDate: "Nov 25, 2025",
        amount: "₦450,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "Tech Solutions Limited",
            email: "techsolutions@gmail.com"
        },
        dates: {
            invoiceDate: "25 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "25 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "Web Development Services",
                qty: 1,
                rate: 400000,
                amount: 400000
            },
            {
                id: 2,
                description: "Domain & Hosting Setup",
                qty: 1,
                rate: 50000,
                amount: 50000
            }
        ],
        totals: {
            subTotal: 450000,
            vat: 33750,
            wht: 4500,
            total: 479250,
            balanceDue: 0 // Paid invoice
        },
        signature: "—Tech Solutions Team",
        note: "Thank you for choosing Tech Solutions Ltd. Payment has been received successfully.",
        termsOfPayment: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "First Bank Plc",
            accountNumber: "2034567890",
            accountName: "Tech Solutions Limited"
        }
    },
    {
        id: 2,
        date: "Oct 23, 2025",
        issuedBy: "Solar Nigeria Ltd",
        invoiceId: "INV-00122",
        status: "Pending",
        dueDate: "Nov 25, 2025",
        amount: "₦85,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "Solar Nigeria Limited",
            email: "solar@nigeria.com"
        },
        dates: {
            invoiceDate: "23 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "25 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "Solar Panel Installation",
                qty: 2,
                rate: 35000,
                amount: 70000
            },
            {
                id: 2,
                description: "Installation Service",
                qty: 1,
                rate: 15000,
                amount: 15000
            }
        ],
        totals: {
            subTotal: 85000,
            vat: 6375,
            wht: 850,
            total: 90525,
            balanceDue: 90525
        },
        signature: "—Solar Nigeria Team",
        note: "Kindly make payments via bank transfer using the account details provided. Thank you for choosing us.",
        termsOfPayment: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "Zenith Bank Plc",
            accountNumber: "1234567890",
            accountName: "Solar Nigeria Limited"
        }
    },
    {
        id: 3,
        date: "Oct 25, 2025",
        issuedBy: "Tech Solutions Ltd",
        invoiceId: "INV-00123",
        status: "Paid",
        dueDate: "Nov 25, 2025",
        amount: "₦450,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "Tech Solutions Limited",
            email: "techsolutions@gmail.com"
        },
        dates: {
            invoiceDate: "25 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "25 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "Web Development Services",
                qty: 1,
                rate: 400000,
                amount: 400000
            },
            {
                id: 2,
                description: "Domain & Hosting Setup",
                qty: 1,
                rate: 50000,
                amount: 50000
            }
        ],
        totals: {
            subTotal: 450000,
            vat: 33750,
            wht: 4500,
            total: 479250,
            balanceDue: 0
        },
        signature: "—Tech Solutions Team",
        note: "Thank you for choosing Tech Solutions Ltd. Payment has been received successfully.",
        termsOfPayment: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "First Bank Plc",
            accountNumber: "2034567890",
            accountName: "Tech Solutions Limited"
        }
    },
    {
        id: 4,
        date: "Oct 15, 2025",
        issuedBy: "James Victor",
        invoiceId: "INV-00121",
        status: "Paid",
        dueDate: "Nov 25, 2025",
        amount: "₦112,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "James Victor Consulting",
            email: "james@victor.com"
        },
        dates: {
            invoiceDate: "15 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "25 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "Business Consultation",
                qty: 4,
                rate: 25000,
                amount: 100000
            },
            {
                id: 2,
                description: "Report Documentation",
                qty: 1,
                rate: 12000,
                amount: 12000
            }
        ],
        totals: {
            subTotal: 112000,
            vat: 8400,
            wht: 1120,
            total: 119280,
            balanceDue: 0
        },
        signature: "—James Victor",
        note: "Thank you for the opportunity to work with you. Payment received successfully.",
        termsOfPayment: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "GTBank Plc",
            accountNumber: "0123456789",
            accountName: "James Victor Consulting"
        }
    },
    {
        id: 5,
        date: "Oct 25, 2025",
        issuedBy: "Tech Solutions Ltd",
        invoiceId: "INV-00125",
        status: "Paid",
        dueDate: "Nov 25, 2025",
        amount: "₦450,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "Tech Solutions Limited",
            email: "techsolutions@gmail.com"
        },
        dates: {
            invoiceDate: "25 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "25 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "Mobile App Development",
                qty: 1,
                rate: 380000,
                amount: 380000
            },
            {
                id: 2,
                description: "App Store Deployment",
                qty: 1,
                rate: 70000,
                amount: 70000
            }
        ],
        totals: {
            subTotal: 450000,
            vat: 33750,
            wht: 4500,
            total: 479250,
            balanceDue: 0
        },
        signature: "—Tech Solutions Team",
        note: "Mobile app development completed successfully. Payment received with thanks.",
        termsOfPayment: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "First Bank Plc",
            accountNumber: "2034567890",
            accountName: "Tech Solutions Limited"
        }
    },
    {
        id: 6,
        date: "Oct 25, 2025",
        issuedBy: "Tech Solutions Ltd",
        invoiceId: "INV-00126",
        status: "Paid",
        dueDate: "Nov 25, 2025",
        amount: "₦450,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "Tech Solutions Limited",
            email: "techsolutions@gmail.com"
        },
        dates: {
            invoiceDate: "25 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "25 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "E-commerce Platform Setup",
                qty: 1,
                rate: 400000,
                amount: 400000
            },
            {
                id: 2,
                description: "Payment Gateway Integration",
                qty: 1,
                rate: 50000,
                amount: 50000
            }
        ],
        totals: {
            subTotal: 450000,
            vat: 33750,
            wht: 4500,
            total: 479250,
            balanceDue: 0
        },
        signature: "—Tech Solutions Team",
        note: "E-commerce platform successfully deployed. Thank you for your business.",
        termsOfPayment: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "First Bank Plc",
            accountNumber: "2034567890",
            accountName: "Tech Solutions Limited"
        }
    },
    {
        id: 7,
        date: "Oct 23, 2025",
        issuedBy: "Solar Nigeria Ltd",
        invoiceId: "INV-00127",
        status: "Pending",
        dueDate: "Nov 25, 2025",
        amount: "₦85,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "Solar Nigeria Limited",
            email: "solar@nigeria.com"
        },
        dates: {
            invoiceDate: "23 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "25 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "Solar Battery System",
                qty: 1,
                rate: 65000,
                amount: 65000
            },
            {
                id: 2,
                description: "Battery Installation",
                qty: 1,
                rate: 20000,
                amount: 20000
            }
        ],
        totals: {
            subTotal: 85000,
            vat: 6375,
            wht: 850,
            total: 90525,
            balanceDue: 90525
        },
        signature: "—Solar Nigeria Team",
        note: "Solar battery system ready for installation. Kindly make payment to proceed.",
        termsOfPayment: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "Zenith Bank Plc",
            accountNumber: "1234567890",
            accountName: "Solar Nigeria Limited"
        }
    },
    {
        id: 8,
        date: "Oct 15, 2025",
        issuedBy: "James Victor",
        invoiceId: "INV-00128",
        status: "Paid",
        dueDate: "Nov 25, 2025",
        amount: "₦112,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "James Victor Consulting",
            email: "james@victor.com"
        },
        dates: {
            invoiceDate: "15 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "25 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "Financial Advisory Services",
                qty: 3,
                rate: 30000,
                amount: 90000
            },
            {
                id: 2,
                description: "Investment Planning Report",
                qty: 1,
                rate: 22000,
                amount: 22000
            }
        ],
        totals: {
            subTotal: 112000,
            vat: 8400,
            wht: 1120,
            total: 119280,
            balanceDue: 0
        },
        signature: "—James Victor",
        note: "Financial advisory services completed. Investment plan delivered successfully.",
        termsOfPayment: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "GTBank Plc",
            accountNumber: "0123456789",
            accountName: "James Victor Consulting"
        }
    },
    {
        id: 9,
        date: "Oct 15, 2025",
        issuedBy: "Godiya Veronica",
        invoiceId: "INV-00129",
        status: "Overdue",
        dueDate: "Nov 25, 2025",
        amount: "₦112,000",
        billTo: {
            name: "Joseph Original Invoice",
            location: "Lagos, Nigeria",
            email: "josephoriginal@gmail.com"
        },
        billFrom: {
            company: "Godiya Veronica Services",
            email: "godiya@veronica.com"
        },
        dates: {
            invoiceDate: "15 Oct 2025",
            paymentTerms: "Net 30",
            dueDate: "15 Nov 2025"
        },
        items: [
            {
                id: 1,
                description: "Graphic Design Services",
                qty: 5,
                rate: 20000,
                amount: 100000
            },
            {
                id: 2,
                description: "Logo Design",
                qty: 1,
                rate: 12000,
                amount: 12000
            }
        ],
        totals: {
            subTotal: 112000,
            vat: 8400,
            wht: 1120,
            total: 119280,
            balanceDue: 119280
        },
        signature: "—Godiya Veronica",
        note: "This invoice is now overdue. Please make payment immediately to avoid additional charges.",
        termsOfPayment: "All payments should be made in the currency stated above. Late payment charges may apply after due date.",
        paymentMethod: {
            method: "Bank Transfer",
            bankName: "UBA Plc",
            accountNumber: "1029384756",
            accountName: "Godiya Veronica Services"
        }
    }
];

export const getInvoiceById = (id: number): Invoice | undefined => {
    return mockInvoices.find(invoice => invoice.id === id);
};
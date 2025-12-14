export interface Product {
    id: string;
    itemName: string;
    category: "Product" | "Service";
    description: string;
    unit: string;
    unitPrice: string;
    tax: string;
    lastUpdated: string;
}

export interface FormData {
    itemType: string;
    itemName: string;
    description: string;
    unit: string;
    unitPrice: string;
    currency: string;
    tax: string;
}

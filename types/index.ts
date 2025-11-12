export interface Vendor {
    id: string;
    name: string;
}

export interface PurchaseOrder {
    id: string;
    vendorId: string;
    poNumber: string;
}

export interface Product {
    id: string;
    name: string;
}

export interface Batch {
    id: string;
    productId: string;
    batchNumber: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
}

export interface TransportAgency {
    id: string;
    name: string;
}

export interface ProductRow {
    id: string;
    productId: string;
    batchId: string;
    qty: number;
    freeQty: number;
    rate: number;
    discount: number;
    amount: number;
    name?: string
}

export interface EWayBill {
    distance: number;
    transporteryName: string;
    transporteryGstin: string;
    vehicleNumber: string;
    documentNumber: string;
}

export interface PurchaseBillFormData {
    vendorId: string;
    poNumber: string;
    billNumber: string;
    billDate: string;
    dueDate: string;
    paymentMethod: string;
    transportAgency: string;
    products: ProductRow[];
    eWayBill?: EWayBill;
    totalAmount: number;
    status: 'draft' | 'saved';
}
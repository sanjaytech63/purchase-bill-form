import { Vendor, PurchaseOrder, Product, Batch, PaymentMethod, TransportAgency } from '@/types';

export const vendors: Vendor[] = [
    { id: '1', name: 'Vendor A' },
    { id: '2', name: 'Vendor B' },
    { id: '3', name: 'Vendor C' },
];

export const purchaseOrders: PurchaseOrder[] = [
    { id: '1', vendorId: '1', poNumber: 'PO-001' },
    { id: '2', vendorId: '1', poNumber: 'PO-002' },
    { id: '3', vendorId: '2', poNumber: 'PO-003' },
    { id: '4', vendorId: '3', poNumber: 'PO-004' },
];

export const products: Product[] = [
    { id: '1', name: 'Product A' },
    { id: '2', name: 'Product B' },
    { id: '3', name: 'Product C' },
];

export const batches: Batch[] = [
    { id: '1', productId: '1', batchNumber: 'BATCH-001' },
    { id: '2', productId: '1', batchNumber: 'BATCH-002' },
    { id: '3', productId: '2', batchNumber: 'BATCH-003' },
    { id: '4', productId: '3', batchNumber: 'BATCH-004' },
];

export const paymentMethods: PaymentMethod[] = [
    { id: '1', name: 'Cash' },
    { id: '2', name: 'Credit Card' },
    { id: '3', name: 'Bank Transfer' },
];

export const transportAgencies: TransportAgency[] = [
    { id: '1', name: 'Transport Agency A' },
    { id: '2', name: 'Transport Agency B' },
    { id: '3', name: 'Transport Agency C' },
];
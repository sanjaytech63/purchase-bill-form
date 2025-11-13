import { z } from "zod";

export const productRowSchema = z.object({
  id: z.string(),
  productId: z.string().min(1, "Product is required"),
  batchId: z.string().min(1, "Batch is required"),
  qty: z.number().min(1, "Quantity must be at least 1"),
  freeQty: z.number().min(0, "Free quantity cannot be negative"),
  rate: z.number().min(0, "Rate cannot be negative"),
  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  amount: z.number(),
});

export const eWayBillSchema = z.object({
  distance: z.number().min(1, "Distance is required"),
  transporteryName: z.string().min(1, "Transportery name is required"),
  transporteryGstin: z.string().min(1, "Transportery GSTIN is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  documentNumber: z.string().min(1, "Document number is required"),
});

export const purchaseBillFormSchema = z.object({
  vendorId: z.string().min(1, "Vendor is required"),
  poNumber: z.string().min(1, "Purchase Order is required"),
  billNumber: z.string().min(1, "Bill number is required"),
  billDate: z.string().min(1, "Bill date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transportAgency: z.string().min(1, "Transport agency is required"),
  products: z
    .array(productRowSchema)
    .min(1, "At least one product is required"),
  eWayBill: eWayBillSchema.optional(),
  totalAmount: z.number(),
  status: z.enum(["draft", "saved"]),
});

export type PurchaseBillFormData = z.infer<typeof purchaseBillFormSchema>;

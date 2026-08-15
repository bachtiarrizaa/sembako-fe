import { z } from "zod"

export const purchaseSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
  productId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type PurchaseSearch = z.infer<typeof purchaseSearchSchema>

export const purchaseItemSchema = z.object({
  productId: z.string().uuid("Produk wajib dipilih"),
  unitId: z.string().uuid("Satuan wajib dipilih"),
  quantity: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  purchasePrice: z.coerce.number().positive("Harga Beli harus lebih dari 0"),
})

export const createPurchaseSchema = z.object({
  supplierId: z.string().uuid("Supplier wajib dipilih"),
  invoiceNumber: z.string().max(100, "Maksimal 100 karakter").optional().nullable().or(z.literal("")),
  purchaseDate: z.string().min(1, "Tanggal Beli wajib diisi"),
  items: z.array(purchaseItemSchema).min(1, "Minimal harus ada 1 item"),
})

export type CreatePurchaseRequest = z.infer<typeof createPurchaseSchema>

export const updatePurchaseSchema = z.object({
  supplierId: z.string().uuid("Supplier wajib dipilih"),
  invoiceNumber: z.string().max(100, "Maksimal 100 karakter").optional().nullable().or(z.literal("")),
  purchaseDate: z.string().min(1, "Tanggal Beli wajib diisi"),
  quantity: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  unitId: z.string().uuid("Satuan wajib dipilih"),
  purchasePrice: z.coerce.number().positive("Harga Beli harus lebih dari 0"),
})

export type UpdatePurchaseRequest = z.infer<typeof updatePurchaseSchema>


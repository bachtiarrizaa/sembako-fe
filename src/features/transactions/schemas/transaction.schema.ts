import { z } from "zod"

export const transactionSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
  cashier_id: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  payment_method: z.enum(["cash", "qris", "transfer"]).optional(),
  status: z.string().optional(),
})

export type TransactionSearch = z.infer<typeof transactionSearchSchema>

export const voidTransactionSchema = z.object({
  reason: z.string().min(1, "Alasan pembatalan wajib diisi"),
})

export type VoidTransactionRequest = z.infer<typeof voidTransactionSchema>

export const createTransactionItemSchema = z.object({
  productUnitId: z.string().min(1, "ID Satuan Produk wajib terisi"),
  qty: z.number().positive("Jumlah barang harus lebih dari 0"),
})

export const createTransactionSchema = z.object({
  customerId: z.string().optional(),
  paymentMethod: z.enum(["cash", "qris", "transfer"]),
  cashReceived: z.number().optional(),
  usePoints: z.boolean().optional(),
  items: z.array(createTransactionItemSchema).min(1, "Keranjang tidak boleh kosong"),
})

export type CreateTransactionItemRequest = z.infer<typeof createTransactionItemSchema>
export type CreateTransactionRequest = z.infer<typeof createTransactionSchema>

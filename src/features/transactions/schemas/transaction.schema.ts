import { z } from "zod"
import { PAYMENT_METHOD_VALUES, TRANSACTION_STATUS_VALUES } from "../constants/transaction.constant"

export const transactionSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
  cashierId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHOD_VALUES).optional(),
  status: z.enum(TRANSACTION_STATUS_VALUES).optional(),
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
  paymentMethod: z.enum(PAYMENT_METHOD_VALUES),
  cashReceived: z.number().optional(),
  usePoints: z.boolean().optional(),
  items: z.array(createTransactionItemSchema).min(1, "Keranjang tidak boleh kosong"),
})

export type CreateTransactionItemRequest = z.infer<typeof createTransactionItemSchema>
export type CreateTransactionRequest = z.infer<typeof createTransactionSchema>

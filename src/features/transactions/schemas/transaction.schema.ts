import { z } from "zod"

export const transactionSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type TransactionSearch = z.infer<typeof transactionSearchSchema>

export const voidTransactionSchema = z.object({
  reason: z.string().min(1, "Alasan pembatalan wajib diisi"),
})

export type VoidTransactionRequest = z.infer<typeof voidTransactionSchema>

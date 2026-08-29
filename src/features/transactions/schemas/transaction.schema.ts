import { z } from "zod"

export const transactionSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type TransactionSearch = z.infer<typeof transactionSearchSchema>

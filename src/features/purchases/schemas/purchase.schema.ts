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

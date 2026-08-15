import { z } from "zod"

export const productSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type ProductSearch = z.infer<typeof productSearchSchema>

export const updateProductStatusRequest = z.object({
  isActive: z.boolean()
})

export type UpdateProductStatusRequest = z.infer<typeof updateProductStatusRequest>


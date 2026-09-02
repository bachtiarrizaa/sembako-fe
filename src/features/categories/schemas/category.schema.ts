import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(25, "Maksimal 25 karakter"),
})

export type CreateCategoryRequest = z.infer<typeof categorySchema>

export type UpdateCategoryRequest = CreateCategoryRequest

export const categorySearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  limit: z.coerce.number().optional().catch(10),
  search: z.string().optional(),
})

export type CategorySearch = z.infer<typeof categorySearchSchema>
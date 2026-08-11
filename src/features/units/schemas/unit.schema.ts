import { z } from "zod"

export const unitSchema = z.object({
  name: z.string().min(1, "Nama satuan wajib diisi").max(25, "Maksimal 25 karakter"),
})

export type CreateUnitRequest = z.infer<typeof unitSchema>

export type UpdateUnitRequest = CreateUnitRequest

export const unitSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type UnitSearch = z.infer<typeof unitSearchSchema>
import { z } from "zod"

export const roleSchema = z.object({
  name: z.string().min(1, "Nama role wajib diisi").max(25, "Maksimal 25 karakter"),
})

export type CreateRolePayload = z.infer<typeof roleSchema>

export type UpdateRolePayload = CreateRolePayload

export const roleSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type RoleSearch = z.infer<typeof roleSearchSchema>
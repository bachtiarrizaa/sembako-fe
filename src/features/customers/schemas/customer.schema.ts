import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(1, "Nama Customer wajib diisi ").max(150, "Maksimal 150 karakter"),
  phoneNumber: z.string().max(20, "Maksimal 20 karakter").optional().or(z.literal("")),
  address: z.string().max(255, "Maksimal 255 karakter").optional().or(z.literal("")),
})

export type CreateCustomerRequest = z.infer<typeof customerSchema>

export type UpdateCustomerRequest = z.infer<typeof customerSchema>

export const updateCustomerStatusRequest = z.object({
  isActive: z.boolean()
})

export type UpdateCustomerStatusRequest = z.infer<typeof updateCustomerStatusRequest>

export const customerSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type CustomerSearch = z.infer<typeof customerSearchSchema>
import { z } from "zod"

export const supplierSchema = z.object({
  name: z.string().min(1, "Nama Supplier wajib diisi").max(150, "Maksimal 150 karakter"),
  contactName: z.string().max(100, "Maksimal 100 karakter").optional().or(z.literal("")),
  phone: z.string().max(20, "Maksimal 20 karakter").optional().or(z.literal("")),
  address: z.string().max(255, "Maksimal 255 karakter").optional().or(z.literal("")),
})

export type CreateSupplierRequest = z.infer<typeof supplierSchema>

export type UpdateSupplierRequest = z.infer<typeof supplierSchema>

export type SupplierFormValues = CreateSupplierRequest

export const updateSupplierStatusRequest = z.object({
  isActive: z.boolean()
})

export type UpdateSupplierStatusRequest = z.infer<typeof updateSupplierStatusRequest>

export const supplierSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type SupplierSearch = z.infer<typeof supplierSearchSchema>

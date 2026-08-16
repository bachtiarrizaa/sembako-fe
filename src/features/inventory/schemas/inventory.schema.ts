import { z } from "zod"
import { OPNAME_STATUSES } from "../constants/inventory.constant"

export const stockMutationSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
})

export type StockMutationSearch = z.infer<typeof stockMutationSearchSchema>

export const opnameSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  productId: z.string().uuid().optional().nullable().or(z.literal("")),
  status: z.nativeEnum(OPNAME_STATUSES).optional().nullable().or(z.literal("")),
})

export type OpnameSearch = z.infer<typeof opnameSearchSchema>

export const createOpnameSchema = z.object({
  productId: z.string().uuid("Produk harus dipilih"),
  physicalQty: z.coerce
    .number({ message: "Jumlah fisik harus diisi" })
    .min(0, "Jumlah fisik tidak boleh kurang dari 0"),
  note: z.string().max(500, "Catatan maksimal 500 karakter").optional().nullable().or(z.literal("")),
})

export type CreateOpnameRequest = z.infer<typeof createOpnameSchema>

export const approveOpnameSchema = z.object({
  approve: z.boolean({ message: "Keputusan persetujuan wajib dipilih" }),
  note: z.string().max(500, "Catatan maksimal 500 karakter").optional().nullable().or(z.literal("")),
})

export type ApproveOpnameRequest = z.infer<typeof approveOpnameSchema>

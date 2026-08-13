import { z } from "zod"
import { DISCOUNT_TYPES } from "../constants/discount.constant"
import type { DiscountType } from "../constants/discount.constant"

const isPercentValueValid = (
  data: { type: DiscountType; value: number }
) => data.type !== DISCOUNT_TYPES.PERCENT || data.value <= 100

const isDateRangeValid = (
  data: { startDate?: string; endDate?: string }
) => !data.startDate || !data.endDate || new Date(data.endDate) >= new Date(data.startDate)

export const discountSchema = z.object({
  name: z.string().min(1, "Nama diskon wajib diisi").max(100, "Maksimal 100 karakter"),
  type: z.enum(Object.values(DISCOUNT_TYPES), { error: "Tipe diskon wajib dipilih" }),
  value: z.coerce.number().positive("Nilai diskon harus lebih dari 0"),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})
.refine(isPercentValueValid, { message: "Diskon persentase maksimal 100%", path: ["value"] })
.refine(isDateRangeValid, { message: "Tanggal selesai harus setelah tanggal mulai", path: ["endDate"] })

export type CreateDiscountRequest = z.infer<typeof discountSchema>
export type UpdateDiscountRequest = CreateDiscountRequest

export const updateDiscountStatusRequest = z.object({
  isActive: z.boolean()
})

export type UpdateDiscountStatusRequest = z.infer<typeof updateDiscountStatusRequest>

export const discountSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type DiscountSearch = z.infer<typeof discountSearchSchema>
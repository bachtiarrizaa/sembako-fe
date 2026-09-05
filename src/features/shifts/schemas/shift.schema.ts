import { z } from "zod";

export const openShiftSchema = z.object({
  openingBalance: z
    .number({ message: "Modal awal harus berupa angka" })
    .min(0, "Modal awal tidak boleh negatif"),
});

export const closeShiftSchema = z.object({
  closingBalance: z
    .number({ message: "Kas akhir harus berupa angka" })
    .min(0, "Kas akhir tidak boleh negatif"),
  discrepancyNote: z.string().optional(),
});

export type OpenShiftFormInput = z.infer<typeof openShiftSchema>;
export type CloseShiftFormInput = z.infer<typeof closeShiftSchema>;

export const forceCloseShiftSchema = z.object({
  closingBalance: z
    .number({ message: "Total kas fisik akhir harus berupa angka" })
    .min(0, "Total kas fisik akhir tidak boleh negatif"),
  reason: z
    .string({ message: "Alasan penutupan paksa wajib diisi" })
    .min(1, "Alasan penutupan paksa wajib diisi"),
  discrepancyNote: z.string().optional(),
});

export type ForceCloseShiftFormInput = z.infer<typeof forceCloseShiftSchema>;

export const shiftSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type ShiftSearch = z.infer<typeof shiftSearchSchema>;

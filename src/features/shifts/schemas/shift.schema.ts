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

import { z } from "zod";

export const storeSettingSchema = z.object({
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  storeAddress: z.string().min(1, "Alamat toko wajib diisi"),
  storePhone: z.string().min(1, "Nomor telepon toko wajib diisi"),
  receiptHeaderText: z.string().min(1, "Teks header struk wajib diisi"),
  receiptFooterText: z.string().min(1, "Teks footer struk wajib diisi"),
  receiptShowCashierName: z.boolean(),
  receiptShowCustomerName: z.boolean(),
  shiftDiscrepancyTolerance: z.number().min(0, "Toleransi selisih shift minimal 0"),
});

export type StoreSettingFormValues = z.infer<typeof storeSettingSchema>;

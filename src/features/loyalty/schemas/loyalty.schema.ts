import { z } from "zod";

export const loyaltySettingSchema = z.object({
  earningRate: z.number().min(1, "Rasio perolehan poin minimal 1"),
  redemptionRate: z.number().min(1, "Nilai penukaran poin minimal 1"),
  minimumRedeem: z.number().min(0, "Minimal penukaran poin tidak boleh negatif"),
  isExpiryActive: z.boolean(),
  expiryMonths: z.number().min(1, "Masa berlaku poin minimal 1 bulan"),
});

export type LoyaltySettingFormValues = z.infer<typeof loyaltySettingSchema>;

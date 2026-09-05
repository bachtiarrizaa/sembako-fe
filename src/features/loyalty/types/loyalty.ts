export interface LoyaltySetting {
  id: string;
  earningRate: number;
  redemptionRate: number;
  minimumRedeem: number;
  isExpiryActive: boolean;
  expiryMonths: number;
  createdAt: string;
  updatedAt: string;
}

export type LoyaltySettingResponse = LoyaltySetting;

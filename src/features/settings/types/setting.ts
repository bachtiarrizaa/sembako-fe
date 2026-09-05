export interface StoreSetting {
  id: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  receiptHeaderText: string;
  receiptFooterText: string;
  receiptShowCashierName: boolean;
  receiptShowCustomerName: boolean;
  shiftDiscrepancyTolerance: number;
  createdAt: string;
  updatedAt: string;
}

export type StoreSettingResponse = StoreSetting;

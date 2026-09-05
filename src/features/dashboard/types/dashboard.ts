import type { TransactionResponse } from "@/features/transactions/types/transaction";

export interface ActiveShiftInfo {
  shiftId: string;
  openedAt: string;
  openingBalance: number;
  cashierName: string;
}

export interface ShiftMetrics {
  totalRevenue: number;
  totalTransactions: number;
  cashInDrawer: number;
  nonCashTotal: number;
  qrisTotal?: number;
  transferTotal?: number;
  revenueChange: number;
}

export interface LowStockItem {
  id?: string;
  name: string;
  stock: number;
  unit: string;
}

export interface ActivePromo {
  id: string;
  name: string;
  discountType: "fixed" | "percent" | string;
  discountValue: number;
  minPurchase?: number | null;
}

export interface CashierDashboardData {
  shiftOpen: boolean;
  activeShift: ActiveShiftInfo | null;
  shiftMetrics: ShiftMetrics;
  recentTransactions: TransactionResponse[];
  lowStockItems: LowStockItem[];
  activePromos: ActivePromo[];
}

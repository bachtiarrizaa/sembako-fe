import { ShiftStatus } from "../constants/shift.constant";

export interface ShiftCashier {
  id: string;
  name: string;
}

export interface ShiftData {
  id: string;
  cashierId: string;
  cashier?: ShiftCashier;
  openingBalance: number;
  closingBalance: number | null;
  systemBalance: number | null;
  discrepancy: number | null;
  discrepancyNote: string | null;
  status: ShiftStatus;
  forceCloseReason: string | null;
  forceClosedByUser?: ShiftCashier | string | null;
  openedAt: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OpenShiftPayload {
  openingBalance: number;
}

export interface CloseShiftPayload {
  closingBalance: number;
  discrepancyNote?: string;
}

export interface ForceCloseShiftPayload {
  closingBalance: number;
  reason: string;
  discrepancyNote?: string;
}
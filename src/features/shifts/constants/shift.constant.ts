export enum ShiftStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export const SHIFT_STATUS_LABELS: Record<ShiftStatus, string> = {
  [ShiftStatus.OPEN]: "Buka",
  [ShiftStatus.CLOSED]: "Tutup",
};

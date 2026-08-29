import { PaymentMethod, TransactionStatus } from "../types/transaction"

export const PAYMENT_METHODS = {
  CASH: "cash",
  QRIS: "qris",
  TRANSFER: "transfer",
} as const

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  qris: "QRIS",
  transfer: "Transfer",
}

export const TRANSACTION_STATUSES = {
  COMPLETED: "completed",
  VOID: "void",
} as const

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  completed: "Selesai",
  void: "Dibatalkan",
}

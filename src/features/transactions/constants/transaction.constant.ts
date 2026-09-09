import { PaymentMethod, TransactionStatus } from "../types/transaction"

export const PAYMENT_METHODS = {
  CASH: "cash",
  QRIS: "qris",
  TRANSFER: "transfer",
} as const

export const PAYMENT_METHOD_VALUES = ["cash", "qris", "transfer"] as const

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  qris: "QRIS",
  transfer: "Transfer",
}

export const TRANSACTION_STATUSES = {
  COMPLETED: "completed",
  VOID: "void",
} as const

export const TRANSACTION_STATUS_VALUES = ["completed", "void"] as const

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  completed: "Selesai",
  void: "Dibatalkan",
}

export const PAYMENT_METHOD_OPTIONS = [
  { value: "all", label: "Semua Metode" },
  { value: "cash", label: "Tunai (Cash)" },
  { value: "qris", label: "QRIS" },
  { value: "transfer", label: "Transfer" },
]

export const TRANSACTION_STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "completed", label: "Selesai" },
  { value: "void", label: "Dibatalkan (Void)" },
]

export interface CashierInTransaction {
  id: string
  name: string
}

export interface CustomerInTransaction {
  id: string
  name: string
}

export interface VoidUserInTransaction {
  id: string
  name: string
}

export interface TransactionItem {
  id: string
  productUnitId: string
  productName: string
  unitName: string
  qty: number
  unitPrice: number
  discountApplied: number
  subtotal: number
  totalCost: number | null
  margin: number | null
}

export type PaymentMethod = "cash" | "qris" | "transfer"
export type TransactionStatus = "completed" | "void"

export interface Transaction {
  id: string
  receiptNumber: string
  cashier: CashierInTransaction
  shiftId: string
  customer: CustomerInTransaction | null
  paymentMethod: PaymentMethod
  subtotal: number
  totalDiscount: number
  pointsUsed: number
  pointsDiscountValue: number
  pointsEarned: number
  total: number
  cashReceived: number | null
  changeGiven: number | null
  manualPaidConfirmation: boolean | null
  status: TransactionStatus
  voidReason: string | null
  voidedByUser: VoidUserInTransaction | null
  voidedAt: string | null
  createdAt: string
  updatedAt: string
  items: TransactionItem[]
}

export type TransactionResponse = Transaction
import { MutationType, MutationSource, OpnameStatus } from "../constants/inventory.constant"

export interface StockSummary {
  productId: string
  qtyBaseUnit: number
  baseUnit: {
    id: string
    name: string
  }
  updatedAt: string
}

export interface StockMutation {
  id: string
  productId: string
  type: MutationType
  qty: number
  qtyBefore: number
  qtyAfter: number
  source: MutationSource
  referenceId: string
  note: string
  creator: {
    id: string
    name: string
  }
  createdAt: string
}

export interface OpnameSubmission {
  id: string
  productId: string
  product: {
    id: string
    name: string
  }
  countDate: string
  systemQty: number
  physicalQty: number
  discrepancy: number
  note: string
  status: OpnameStatus
  submittedBy: string
  submitter: {
    id: string
    name: string
  }
  approvedBy?: string | null
  approver?: {
    id: string
    name: string
  } | null
  submittedAt: string
  approvedAt?: string | null
}

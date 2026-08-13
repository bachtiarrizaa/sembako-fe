import type { DiscountType } from "../constants/discount.constant"

export interface Discount {
  id: string
  name: string
  type: DiscountType
  value: string
  startDate?: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DiscountResponse {
  id: string
  name: string
  type: DiscountType
  value: string
  startDate?: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
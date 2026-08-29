import type { DiscountType } from "../constants/discount.constant"
import type { Product, ProductUnit } from "@/features/products/types/product"

export interface DiscountProductUnit extends ProductUnit {
  discountAmount?: number
  discountedPrice?: number
}

export interface DiscountProduct extends Partial<Omit<Product, "units">> {
  id: string
  productDiscountId?: string
  productId?: string
  product?: Product
  units?: DiscountProductUnit[]
}

export interface Discount {
  id: string
  name: string
  type: DiscountType
  value: string
  startDate?: string
  endDate?: string
  isActive: boolean
  products?: DiscountProduct[]
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
  products?: DiscountProduct[]
  createdAt: string
  updatedAt: string
}
export interface CategoryInfo {
  id: string
  name: string
}

export interface UnitInfo {
  id: string
  name: string
}

export interface ProductUnit {
  id: string
  unit: UnitInfo
  conversionToBase: number
  sellingPrice: number
  discountAmount?: number
  discountedPrice?: number
  isBaseUnit: boolean
  isActive: boolean
}

export interface Product {
  id: string
  category: CategoryInfo
  name: string
  image: string
  baseUnit: UnitInfo
  minimumStock: number
  marginThresholdPercent: number
  isActive: boolean
  stock?: number
  units: ProductUnit[]
  createdAt: string
  updatedAt: string
}

export type ProductResponse = Product

export interface ProductFormValues {
  name: string
  categoryId: string
  minimumStock: string
  marginThresholdPercent: string
  image?: File | null
  units: {
    id?: string
    unitId: string
    conversionToBase: string
    sellingPrice: string
    isBaseUnit: boolean
    isActive?: boolean
  }[]
}

export interface SelectedProductUnit {
  id?: string
  unitId: string
  conversionToBase: string | number
  sellingPrice: string | number
  isBaseUnit: boolean
  isActive?: boolean
  unit?: { id: string; name: string }
}

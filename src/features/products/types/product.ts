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
  units: ProductUnit[]
  createdAt: string
  updatedAt: string
}

export interface ProductResponse extends Product {}

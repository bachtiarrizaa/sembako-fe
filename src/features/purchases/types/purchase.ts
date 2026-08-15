export interface PurchaseProduct {
  id: string
  name: string
}

export interface PurchaseSupplier {
  id: string
  name: string
}

export interface PurchaseCreator {
  id: string
  name: string
}

export interface Purchase {
  id: string
  product: PurchaseProduct
  supplier: PurchaseSupplier
  unit: { id: string; name: string } | null
  unitPrice: number | null
  baseUnit: { id: string; name: string } | null
  initialQuantity: number
  remainingQuantity: number
  purchasePrice: number
  invoiceNumber: string | null
  purchaseDate: string
  creator: PurchaseCreator
  createdAt: string
}

export type PurchaseResponse = Purchase

export interface PurchaseItemFormValues {
  productId: string
  unitId: string
  quantity?: number
  purchasePrice?: number
}

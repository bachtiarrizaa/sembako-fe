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
  initialQuantity: number
  remainingQuantity: number
  purchasePrice: number
  invoiceNumber: string | null
  purchaseDate: string
  creator: PurchaseCreator
  createdAt: string
}

export interface PurchaseResponse extends Purchase {}

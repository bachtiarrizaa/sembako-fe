export interface ProductUnit {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  allowDecimal: boolean;
}

export interface PosProduct {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  stock: number;
  baseUnitName: string;
  units: ProductUnit[];
  barcode?: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  product: PosProduct;
  unit: ProductUnit;
  qty: number;
}

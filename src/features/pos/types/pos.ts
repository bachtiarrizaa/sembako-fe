export interface ProductUnit {
  id: string; // productUnitId dari Backend API
  name: string; // nama satuan, misal "Kg", "Liter", "Karung 5kg", "Dus"
  price: number; // Effective price (harga diskon jika ada)
  originalPrice?: number; // Harga normal sebelum diskon (sellingPrice)
  stock: number;
  allowDecimal: boolean; // true untuk Kg/Liter, false untuk Karung/Dus/Pcs
}

export interface PosProduct {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  stock: number;
  baseUnitName: string;
  units: ProductUnit[]; // Multi-satuan per produk
  barcode?: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  product: PosProduct;
  unit: ProductUnit;
  qty: number;
}

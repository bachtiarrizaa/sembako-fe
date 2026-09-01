"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/common/SearchBar";

export interface ProductUnit {
  id: string; // productUnitId dari Backend API
  name: string; // nama satuan, misal "Kg", "Liter", "Karung 5kg", "Dus"
  price: number;
  stock: number;
  allowDecimal: boolean; // true untuk Kg/Liter, false untuk Karung/Dus/Pcs
}

export interface PosProduct {
  id: string;
  name: string;
  category: string;
  units: ProductUnit[]; // Multi-satuan per produk
  barcode?: string;
  imageUrl?: string;
}

interface PosProductCatalogProps {
  onAddToCart: (product: PosProduct, unit: ProductUnit) => void;
  cartItemCounts: Record<string, number>;
}

export function PosProductCatalog({ onAddToCart, cartItemCounts }: PosProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});

  const categories = ["Semua", "Beras", "Minyak Goreng", "Gula", "Mi & Instan", "Telur & Susu", "Bumbu"];

  // Mock sembako products dengan multi-satuan & allowDecimal
  const products: PosProduct[] = [
    {
      id: "P-101",
      name: "Beras Rojolele Super Premium",
      category: "Beras",
      barcode: "8991001001",
      units: [
        {
          id: "54c7c52a-3ed2-4f1b-a1dc-d463a09e98e1",
          name: "Kg",
          price: 14000,
          stock: 120,
          allowDecimal: true,
        },
        {
          id: "unit-101-liter",
          name: "Liter",
          price: 11500,
          stock: 150,
          allowDecimal: true,
        },
        {
          id: "764b77ef-8ad9-4550-be60-17af16663377",
          name: "Karung 25kg",
          price: 340000,
          stock: 10,
          allowDecimal: false,
        },
      ],
    },
    {
      id: "P-102",
      name: "Beras Pandan Wangi Organik",
      category: "Beras",
      barcode: "8991001002",
      units: [
        {
          id: "unit-102-kg",
          name: "Kg",
          price: 16500,
          stock: 50,
          allowDecimal: true,
        },
        {
          id: "unit-102-karung10kg",
          name: "Karung 10kg",
          price: 160000,
          stock: 8,
          allowDecimal: false,
        },
      ],
    },
    {
      id: "P-103",
      name: "Minyak Goreng Bimoli",
      category: "Minyak Goreng",
      barcode: "8991002001",
      units: [
        {
          id: "unit-103-pouch2l",
          name: "Pouch 2L",
          price: 36000,
          stock: 24,
          allowDecimal: false,
        },
      ],
    },
    {
      id: "P-104",
      name: "Minyak Goreng Curah Kita",
      category: "Minyak Goreng",
      barcode: "8991002002",
      units: [
        {
          id: "unit-104-liter",
          name: "Liter",
          price: 15500,
          stock: 45,
          allowDecimal: true,
        },
      ],
    },
    {
      id: "P-105",
      name: "Gula Pasir Kristal Putih",
      category: "Gula",
      barcode: "8991003001",
      units: [
        {
          id: "unit-105-kg",
          name: "Kg",
          price: 17500,
          stock: 30,
          allowDecimal: true,
        },
        {
          id: "unit-105-karung50kg",
          name: "Karung 50kg",
          price: 840000,
          stock: 3,
          allowDecimal: false,
        },
      ],
    },
    {
      id: "P-106",
      name: "Telur Ayam Negeri Fresh",
      category: "Telur & Susu",
      barcode: "8991004001",
      units: [
        {
          id: "unit-106-kg",
          name: "Kg",
          price: 28000,
          stock: 12,
          allowDecimal: true,
        },
      ],
    },
    {
      id: "P-107",
      name: "Indomie Goreng Spesial",
      category: "Mi & Instan",
      barcode: "8991005001",
      units: [
        {
          id: "unit-107-pcs",
          name: "Pcs",
          price: 3100,
          stock: 240,
          allowDecimal: false,
        },
        {
          id: "unit-107-dus",
          name: "Dus (40 pcs)",
          price: 112000,
          stock: 10,
          allowDecimal: false,
        },
      ],
    },
    {
      id: "P-108",
      name: "Garam Dapur Beryodium 250g",
      category: "Bumbu",
      barcode: "8991006001",
      units: [
        {
          id: "unit-108-bungkus",
          name: "Bungkus",
          price: 3500,
          stock: 50,
          allowDecimal: false,
        },
      ],
    },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-3.5 flex flex-col h-full">
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Cari produk sembako..."
        className="w-full sm:max-w-none"
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                ? "bg-primary text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 overflow-y-auto max-h-[60vh] sm:max-h-[65vh] p-1 pt-2 pr-2">
        {filteredProducts.map((product) => {
          const selectedUnitId = selectedUnits[product.id] || product.units[0].id;
          const currentUnit = product.units.find((u) => u.id === selectedUnitId) || product.units[0];
          const qtyInCart = cartItemCounts[product.id] || 0;

          return (
            <div
              key={product.id}
              className={`group bg-white p-3 rounded-2xl border transition-all flex flex-col justify-between relative hover:shadow-md ${qtyInCart > 0
                  ? "border-primary ring-2 ring-primary/20 bg-teal-50/20"
                  : "border-slate-200/80 hover:border-slate-300"
                }`}
            >
              {/* Cart Count Badge */}
              {qtyInCart > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold size-5.5 rounded-full flex items-center justify-center shadow-md ring-2 ring-white z-10">
                  {qtyInCart}
                </div>
              )}

              <div className="space-y-2">
                {/* Header: Category Badge & Stock */}
                <div className="flex items-center justify-between gap-1">
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1.5 py-0 font-medium bg-slate-100 text-slate-600 border-none"
                  >
                    {product.category}
                  </Badge>
                  <span
                    className={`text-[10px] font-medium ${currentUnit.stock <= 5
                        ? "text-amber-600 font-bold"
                        : "text-slate-400"
                      }`}
                  >
                    Stok: {currentUnit.stock} {currentUnit.name}
                  </span>
                </div>

                {/* Title (Fixed min-height for uniform alignment) */}
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug min-h-[2.4rem] group-hover:text-primary transition-colors">
                  {product.name}
                </h4>

                {/* Multi-Unit Selector Pills (Scrollable jika teks satuan panjang) */}
                {product.units.length > 1 && (
                  <div className="bg-slate-100/80 p-0.5 rounded-xl flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {product.units.map((unit) => {
                      const isSelected = unit.id === currentUnit.id;
                      return (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUnits((prev) => ({ ...prev, [product.id]: unit.id }));
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${isSelected
                              ? "bg-white text-primary shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                          {unit.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer: Price & Add Button */}
              <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-end justify-between gap-1">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block truncate">
                    Harga ({currentUnit.name})
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate">
                    {formatRupiah(currentUnit.price)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart(product, currentUnit)}
                  className={`size-8 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 ${qtyInCart > 0
                      ? "bg-primary text-white shadow-xs hover:bg-primary/90"
                      : "bg-slate-100 text-slate-700 hover:bg-primary hover:text-white"
                    }`}
                  title={`Tambah (${currentUnit.name})`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

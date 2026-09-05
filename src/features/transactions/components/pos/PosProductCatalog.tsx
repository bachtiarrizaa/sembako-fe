import { useState } from "react";
import { Plus, Minus, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/common/SearchBar";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import { formatCurrency } from "@/utils/format";
import type { PosProduct, ProductUnit } from "../../types/pos";

export type { PosProduct, ProductUnit };

interface PosProductCatalogProps {
  onAddToCart: (product: PosProduct, unit: ProductUnit) => void;
  onDecreaseFromCart?: (product: PosProduct, unit: ProductUnit) => void;
  cartItemCounts: Record<string, number>;
}

const ALL_CATEGORY = { id: "ALL", name: "Semua Kategori" };

type DiscountFilterOption = "ALL" | "WITH_DISCOUNT" | "NO_DISCOUNT";

const DISCOUNT_FILTER_ITEMS = [
  { id: "ALL", name: "Semua Status" },
  { id: "WITH_DISCOUNT", name: "Ada Diskon" },
  { id: "NO_DISCOUNT", name: "Tanpa Diskon" },
];

export function PosProductCatalog({
  onAddToCart,
  onDecreaseFromCart,
  cartItemCounts,
}: PosProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [selectedDiscountFilter, setSelectedDiscountFilter] = useState<DiscountFilterOption>("ALL");
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const hasDiscountParam =
    selectedDiscountFilter === "WITH_DISCOUNT"
      ? true
      : selectedDiscountFilter === "NO_DISCOUNT"
      ? false
      : undefined;

  // Real API Queries with include: "units", category_id, search, has_discount
  const { data: productsData, isLoading: isProductsLoading } = useProducts(
    {
      page: 1,
      limit: 100,
      include: "units",
      category_id: selectedCategoryId !== "ALL" ? selectedCategoryId : undefined,
      search: debouncedSearch ? debouncedSearch : undefined,
      has_discount: hasDiscountParam,
    },
    {
      staleTime: 1000 * 30, // 30s cache for POS catalog
    }
  );
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories({
    page: 1,
    limit: 100,
  });

  const categoryItems = [
    ALL_CATEGORY,
    ...(categoriesData?.items || []),
  ];

  // Map real API products to PosProduct format
  const apiProducts: PosProduct[] = (productsData?.items || []).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category?.name || "Lainnya",
    categoryId: p.category?.id || "",
    stock: p.stock ?? 0,
    baseUnitName: p.baseUnit?.name || p.units?.[0]?.unit?.name || "Pcs",
    imageUrl: p.image,
    units:
      p.units && p.units.length > 0
        ? p.units.map((u) => ({
            id: u.id,
            name: u.unit?.name || "Unit",
            price: u.discountedPrice && u.discountedPrice > 0 ? u.discountedPrice : u.sellingPrice,
            originalPrice: u.discountedPrice && u.discountedPrice > 0 && u.discountedPrice < u.sellingPrice ? u.sellingPrice : undefined,
            stock: p.stock ?? 0,
            allowDecimal: ["kg", "liter", "l", "gram", "g"].includes(u.unit?.name?.toLowerCase() || ""),
          }))
        : [
            {
              id: p.id,
              name: p.baseUnit?.name || "Pcs",
              price: 0,
              stock: p.stock ?? 0,
              allowDecimal: false,
            },
          ],
  }));

  const filteredProducts = apiProducts.filter((p) => {
    const matchesCat =
      selectedCategoryId === "ALL" || p.categoryId === selectedCategoryId;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    const matchesDiscount =
      selectedDiscountFilter === "ALL" ||
      (selectedDiscountFilter === "WITH_DISCOUNT" && p.units.some((u) => u.originalPrice !== undefined)) ||
      (selectedDiscountFilter === "NO_DISCOUNT" && p.units.every((u) => u.originalPrice === undefined));

    return matchesCat && matchesSearch && matchesDiscount;
  });

  return (
    <div className="space-y-3.5 flex flex-col h-full flex-1 min-h-0">
      {/* Top Controls: Search Bar (Row 1 on mobile) & Category + Discount Comboboxes (Row 2 on mobile, side-by-side) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Cari produk sembako..."
          className="w-full sm:flex-1"
        />

        <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <div className="w-full sm:w-44 lg:w-48">
            <ComboboxSelect
              items={categoryItems}
              value={selectedCategoryId}
              onChange={(val) => setSelectedCategoryId(val || "ALL")}
              getOptionValue={(c) => c.id}
              getOptionLabel={(c) => c.name}
              placeholder="Semua Kategori"
              searchPlaceholder="Cari kategori..."
              emptyText="Kategori tidak ditemukan."
              isLoading={isCategoriesLoading}
              className="w-full bg-background [&_input]:text-xs"
            />
          </div>

          <div className="w-full sm:w-40 lg:w-44">
            <ComboboxSelect
              items={DISCOUNT_FILTER_ITEMS}
              value={selectedDiscountFilter}
              onChange={(val) => setSelectedDiscountFilter((val as DiscountFilterOption) || "ALL")}
              getOptionValue={(d) => d.id}
              getOptionLabel={(d) => d.name}
              placeholder="Filter Diskon"
              searchPlaceholder="Cari status..."
              emptyText="Tidak ditemukan."
              className="w-full bg-background [&_input]:text-xs"
            />
          </div>
        </div>
      </div>

      {/* Product Cards Grid / Skeleton Loading / Empty State */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-3 content-start items-start flex-1 overflow-y-auto min-h-0 p-1 pt-1.5 pr-1.5 pb-28 md:pb-4 touch-pan-y">
        {isProductsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-2xl border border-slate-100 animate-pulse space-y-3 h-36 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-100 rounded-md" />
                <div className="h-4 w-full bg-slate-100 rounded-md" />
              </div>
              <div className="flex items-end justify-between">
                <div className="h-4 w-20 bg-slate-100 rounded-md" />
                <div className="size-8 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center flex flex-col items-center justify-center text-slate-400">
            <Package className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300" />
            <p className="text-xs font-bold text-slate-600">Produk Tidak Ditemukan</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Coba gunakan kata kunci pencarian lain atau ganti kategori.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const selectedUnitId = selectedUnits[product.id] || product.units[0]?.id;
            const currentUnit =
              product.units.find((u) => u.id === selectedUnitId) || product.units[0];
            const qtyInCart = cartItemCounts[product.id] || 0;

            if (!currentUnit) return null;

            return (
              <div
                key={product.id}
                className={`group bg-white p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col justify-between relative hover:shadow-md h-fit w-full ${
                  qtyInCart > 0
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

                <div className="space-y-1 sm:space-y-1.5">
                  {/* Header Row: Category Badge (Left) & Stock (Top Right) */}
                  <div className="flex items-center justify-between gap-1.5 min-h-[20px]">
                    <Badge
                      variant="secondary"
                      className="text-[9px] sm:text-[10px] px-2 py-0.5 font-bold bg-primary/10 text-primary border border-primary/20 rounded-lg inline-block max-w-[60%] truncate shrink-0"
                    >
                      {product.category}
                    </Badge>

                    <span
                      className={`text-[9.5px] sm:text-[10px] font-medium text-right shrink-0 ${
                        product.stock <= 5 ? "text-amber-600 font-bold" : "text-slate-500 font-medium"
                      }`}
                    >
                      Stok: {product.stock} {product.baseUnitName}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors pt-0.5 min-h-[1.8rem] sm:min-h-[2.2rem]">
                    {product.name}
                  </h4>

                  {/* Multi-Unit Selector Pills */}
                  {product.units.length > 1 && (
                    <div className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 overflow-x-auto no-scrollbar border border-slate-200/50 w-full">
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
                            className={`shrink-0 whitespace-nowrap px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9.5px] sm:text-[10.5px] font-bold transition-all cursor-pointer text-center ${
                              product.units.length <= 2 ? "flex-1" : ""
                            } ${
                              isSelected
                                ? "bg-white text-primary shadow-2xs border border-primary/30 font-extrabold"
                                : "text-slate-500 hover:text-slate-800 border border-transparent"
                            }`}
                          >
                            {unit.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer: Price & Quantity Controls */}
                <div className="pt-2 mt-1.5 border-t border-slate-100 flex items-end justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">
                      Harga ({currentUnit.name})
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate">
                        {formatCurrency(currentUnit.price)}
                      </span>
                      {currentUnit.originalPrice && currentUnit.originalPrice > currentUnit.price && (
                        <span className="text-[9.5px] text-slate-400 line-through font-medium block truncate">
                          {formatCurrency(currentUnit.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {qtyInCart > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDecreaseFromCart?.(product, currentUnit);
                        }}
                        className="size-7 sm:size-8 rounded-lg sm:rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-red-200/60"
                        title={`Kurangi (${currentUnit.name})`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, currentUnit);
                      }}
                      className={`size-7 sm:size-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                        qtyInCart > 0
                          ? "bg-primary text-white shadow-xs hover:bg-primary/90"
                          : "bg-slate-100 text-slate-700 hover:bg-primary hover:text-white"
                      }`}
                      title={`Tambah (${currentUnit.name})`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

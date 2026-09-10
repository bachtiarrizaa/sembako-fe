"use client"

import { ProductResponse } from "../types/product"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, resolveStaticUrl } from "@/utils/format"
import { Package, SearchX } from "lucide-react"

interface CashierProductCardGridProps {
  products: ProductResponse[]
  isLoading?: boolean
}

export function CashierProductCardGrid({ products, isLoading }: CashierProductCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-3 animate-pulse shadow-2xs h-44 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-slate-100 rounded-lg" />
                <div className="h-3 w-16 bg-slate-100 rounded-md" />
              </div>
              <div className="h-5 w-3/4 bg-slate-100 rounded-md" />
            </div>
            <div className="h-16 bg-slate-50 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  const activeProducts = products.filter((product) => product.isActive !== false)

  if (activeProducts.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
        <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <SearchX className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-700">Produk Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500">
            Tidak ada produk yang sesuai dengan kriteria atau kata kunci pencarian.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {activeProducts.map((product) => {
        const imageUrl = resolveStaticUrl(product.image)
        const isLowStock =
          product.minimumStock !== undefined &&
          product.minimumStock !== null &&
          (product.stock ?? 0) < product.minimumStock

        const activeUnits = (product.units || []).filter((u) => u.isActive !== false)

        return (
          <div
            key={product.id}
            className="group bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between hover:shadow-md space-y-3"
          >
            <div className="space-y-2.5">
              {/* Header Row: Category Badge & Stock */}
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2.5 py-0.5 font-bold bg-primary/10 text-primary border border-primary/20 rounded-lg max-w-[60%] truncate"
                >
                  {product.category?.name || "Lainnya"}
                </Badge>

                <span
                  className={`text-[10.5px] font-semibold shrink-0 ${
                    isLowStock ? "text-amber-600 font-bold" : "text-slate-500"
                  }`}
                >
                  Stok: {product.stock ?? 0} {product.baseUnit?.name ?? ""}
                </span>
              </div>

              {/* Product Info Row (Image + Name) */}
              <div className="flex items-start gap-3">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="size-11 rounded-xl object-cover border border-slate-200/80 shrink-0 bg-slate-50"
                  />
                ) : (
                  <div className="size-11 rounded-xl border border-slate-200/80 bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                    <Package className="size-5" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                    Base Satuan: <strong className="text-slate-700 font-semibold">{product.baseUnit?.name || "-"}</strong>
                  </span>
                </div>
              </div>

              {/* Units & Pricing List Box */}
              <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 space-y-1.5">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                  Daftar Satuan & Harga
                </span>
                {activeUnits.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic py-1.5 text-center">
                    Belum ada data satuan
                  </div>
                ) : (
                  <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
                    {activeUnits.map((u) => {
                      const unitName = u.unit?.name || "Satuan"
                      const hasDiscount = u.discountedPrice && u.discountedPrice > 0 && u.discountedPrice < u.sellingPrice
                      const displayPrice = hasDiscount ? u.discountedPrice : u.sellingPrice

                      return (
                        <div
                          key={u.id || unitName}
                          className="flex items-center justify-between bg-white border border-slate-200/60 rounded-lg px-2.5 py-1 text-xs"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-slate-800 text-[11.5px]">
                              {unitName}
                            </span>
                            {u.conversionToBase > 1 && (
                              <span className="text-[10px] text-slate-400">
                                ({u.conversionToBase} {product.baseUnit?.name})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className="font-bold text-slate-900 text-xs">
                              {formatCurrency(displayPrice)}
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] text-slate-400 line-through font-medium">
                                {formatCurrency(u.sellingPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

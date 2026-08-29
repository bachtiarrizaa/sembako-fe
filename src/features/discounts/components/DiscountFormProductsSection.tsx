"use client"

import type { FieldErrors } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import type { Product } from "@/features/products/types/product"
import type { CreateDiscountRequest } from "../schemas/discount.schema"
import { DiscountFormProductsTable } from "./DiscountFormProductsTable"

interface SelectedProductItem {
  productId: string
  isActive: boolean
}

interface DiscountFormProductsSectionProps {
  availableProducts: Product[]
  isProductsLoading: boolean
  isPending: boolean
  formProducts: SelectedProductItem[]
  productDetailsCache: Record<string, { name: string; categoryName?: string }>
  onSelectProduct: (productId: string) => void
  onStatusChange: (productId: string, isActive: boolean) => void
  onRemoveProduct: (productId: string) => void
  errors: FieldErrors<CreateDiscountRequest>
}

export function DiscountFormProductsSection({
  availableProducts,
  isProductsLoading,
  isPending,
  formProducts,
  productDetailsCache,
  onSelectProduct,
  onStatusChange,
  onRemoveProduct,
  errors,
}: DiscountFormProductsSectionProps) {
  return (
    <>
      {/* Product selection field (Daftar Produk Terkait left | Combobox Select right) */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <Label className="text-sm font-bold text-foreground truncate">
            Daftar Produk Terkait
          </Label>
          <span className="text-[10px] text-muted-foreground leading-normal">
            Pilih produk-produk yang akan dikenakan diskon
          </span>
        </div>
        <div className="w-full sm:max-w-[280px] shrink-0">
          <ComboboxSelect
            items={availableProducts}
            value=""
            onChange={(productId) => {
              if (productId) {
                onSelectProduct(productId)
              }
            }}
            getOptionValue={(p) => p.id}
            getOptionLabel={(p) => p.name}
            placeholder="Cari & pilih produk..."
            searchPlaceholder="Cari produk..."
            emptyText={isProductsLoading ? "Memuat..." : "Produk tidak ditemukan."}
            isLoading={isProductsLoading}
            className="w-full bg-background"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Selected products list (Table format consistent with other tables) */}
      <DiscountFormProductsTable
        formProducts={formProducts}
        productDetailsCache={productDetailsCache}
        onStatusChange={onStatusChange}
        onRemoveProduct={onRemoveProduct}
        isPending={isPending}
      />
      {errors.products && (
        <p className="text-xs font-medium text-destructive mt-1 shrink-0">
          {errors.products.message}
        </p>
      )}
    </>
  )
}

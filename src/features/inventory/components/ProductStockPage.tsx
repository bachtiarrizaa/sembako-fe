"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import type { Column } from "@/components/common/DataTable"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { LimitSelect } from "@/components/common/LimitSelect"
import { CustomPagination } from "@/components/common/Pagination"
import { Badge } from "@/components/ui/badge"
import { usePermission } from "@/hooks/usePermission"
import { useProducts } from "@/features/products/hooks"
import { useStockSummary, useStockMutations } from "../hooks"
import { StockMutation } from "../types/inventory"
import { MUTATION_TYPES, MUTATION_TYPE_LABELS, MUTATION_SOURCE_LABELS } from "../constants/inventory.constant"
import { formatShortDateTime } from "@/utils/format"
import { Boxes, Plus, Inbox } from "lucide-react"
import { OpnameCreateDialog } from "./OpnameCreateDialog"

export function ProductStockPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { hasPermission } = usePermission()
  const canCreateOpname = hasPermission("opname:create")

  const selectedProductId = searchParams.get("productId") ?? ""
  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)

  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    page: 1,
    limit: 500,
  })
  const products = useMemo(() => productsData?.items ?? [], [productsData])

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  )

  const {
    data: summaryRes,
  } = useStockSummary(selectedProductId)

  const {
    data: mutationsData,
    isLoading: isMutationsLoading,
    isFetching: isMutationsFetching,
  } = useStockMutations(selectedProductId, { page, limit })

  const summary = summaryRes?.data
  const mutations = mutationsData?.items ?? []
  const pagination = mutationsData?.pagination

  const [adjustmentOpen, setAdjustmentOpen] = useState(false)

  const handleProductChange = (productId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (productId) {
      params.set("productId", productId)
    } else {
      params.delete("productId")
    }
    params.set("page", "1") // reset to page 1 on product change
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("limit", newLimit.toString())
      params.set("page", "1")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const columns: Column<StockMutation>[] = [
    {
      header: "Tanggal",
      className: "w-44",
      cell: (item) => formatShortDateTime(item.createdAt),
    },
    {
      header: "Tipe",
      className: "w-24 text-center",
      cell: (item) => (
        <Badge
          className={
            item.type === MUTATION_TYPES.IN
              ? "border-transparent bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "border-transparent bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          }
        >
          {MUTATION_TYPE_LABELS[item.type]}
        </Badge>
      ),
    },
    {
      header: "Kuantitas",
      className: "w-24 text-center",
      cell: (item) => (
        <span className={item.type === MUTATION_TYPES.IN ? "text-emerald-600 font-semibold" : "text-destructive font-semibold"}>
          {item.type === MUTATION_TYPES.IN ? "+" : "-"}
          {item.qty}
        </span>
      ),
    },
    {
      header: "Stok Awal",
      className: "w-24 text-center",
      cell: (item) => item.qtyBefore,
    },
    {
      header: "Stok Akhir",
      className: "w-24 text-center",
      cell: (item) => item.qtyAfter,
    },
    {
      header: "Sumber",
      className: "w-40",
      cell: (item) => <span>{MUTATION_SOURCE_LABELS[item.source]}</span>,
    },
    {
      header: "Catatan / Ref ID",
      className: "min-w-40 whitespace-normal break-words",
      cell: (item) => item.note || <span className="text-muted-foreground text-xs">{item.referenceId}</span>,
    },
    {
      header: "Dilakukan Oleh",
      className: "w-40",
      cell: (item) => item.creator?.name || "-",
    },
  ]

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Stok & Mutasi Produk</h1>
          <p className="text-sm text-muted-foreground">Lihat riwayat mutasi kartu stok produk secara real-time</p>
        </div>
        <div className="space-y-1.5">
          <span className="text-base font-semibold text-foreground block text-right">Pilih Produk</span>
          <ComboboxSelect
            items={products}
            value={selectedProductId}
            onChange={handleProductChange}
            getOptionValue={(p) => p.id}
            getOptionLabel={(p) => p.name}
            placeholder="Cari dan pilih produk..."
            searchPlaceholder="Ketik nama produk..."
            emptyText={isProductsLoading ? "Memuat produk..." : "Produk tidak ditemukan."}
            isLoading={isProductsLoading}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Main View */}
      {!selectedProductId ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border rounded-2xl bg-white dark:bg-card">
          <Boxes className="size-10 text-muted-foreground/60 mb-3" />
          <h3 className="font-semibold text-sm text-foreground mb-1">Belum Ada Produk Terpilih</h3>
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Silakan cari dan pilih salah satu produk dari drop-down di atas untuk memantau ringkasan stok dan log histori mutasinya.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Tampilkan:</span>
              <LimitSelect value={limit} onChange={handleLimitChange} />
            </div>
            {canCreateOpname && (
              <Button
                onClick={() => setAdjustmentOpen(true)}
                className="gap-1.5 font-medium cursor-pointer self-start sm:self-auto"
              >
                <Plus className="size-4" />
                Opname Stok
              </Button>
            )}
          </div>

          <DataTable
            columns={columns}
            data={mutations}
            isLoading={isMutationsLoading}
            isFetching={isMutationsFetching}
            emptyMessage="Belum ada riwayat mutasi stok untuk produk ini."
            emptyIcon={<Inbox className="size-8 text-muted-foreground/60" />}
            page={page}
            limit={limit}
          />

          {pagination && (
            <CustomPagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </div>
      )}

      {/* Adjust Stock Dialog */}
      {selectedProductId && selectedProduct && summary && (
        <OpnameCreateDialog
          open={adjustmentOpen}
          onOpenChange={setAdjustmentOpen}
          product={{
            id: selectedProductId,
            name: selectedProduct.name,
            baseUnitName: summary.baseUnit.name,
          }}
          systemQty={summary.qtyBaseUnit}
        />
      )}
    </div>
  )
}

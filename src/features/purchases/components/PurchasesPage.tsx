"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { DataTable } from "@/components/common/DataTable"
import type { Column } from "@/components/common/DataTable"
import { SearchX, Inbox, Eye, Trash2 } from "lucide-react"
import { LimitSelect } from "@/components/common/LimitSelect"
import { SearchBar } from "@/components/common/SearchBar"
import { useDebouncedValue } from "@/hooks/useDebounceValue"
import { CustomPagination } from "@/components/common/Pagination"
import { Button } from "@/components/ui/button"
import { usePurchases, useDeletePurchase } from "../hooks"
import { PurchaseSummary } from "../types/purchase"
import { formatCurrency, formatDate } from "@/utils/format"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { PurchaseFormDialog } from "./PurchaseFormDialog"
import { PurchaseDetailDialog } from "./PurchaseDetailDialog"

export function PurchasesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)
  const search = searchParams.get("search") ?? ""

  const { data, isLoading, isFetching, isError } = usePurchases({ page, limit, search })

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("limit", newLimit.toString())
      params.set("page", "1")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const handleSearchChange = useCallback(
    (value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set("search", value)
      else params.delete("search")
      params.set("page", "1")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const [searchInput, setSearchInput] = useState(search)
  const [prevSearch, setPrevSearch] = useState(search)

  if (search !== prevSearch) {
    setPrevSearch(search)
    setSearchInput(search)
  }

  const debouncedSearch = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    if (debouncedSearch === search) return
    handleSearchChange(debouncedSearch || undefined)
  }, [debouncedSearch, search, handleSearchChange])

  const handleSearchSubmit = () => {
    handleSearchChange(searchInput.trim() || undefined)
  }

  const purchases = data?.items ?? []
  const pagination = data?.pagination

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deletingPurchase, setDeletingPurchase] = useState<PurchaseSummary | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)

  const deletePurchase = useDeletePurchase()

  const handleAdd = () => {
    setDialogOpen(true)
  }

  const handleDelete = () => {
    if (!deletingPurchase) return
    deletePurchase.mutate(deletingPurchase.id, {
      onSuccess: () => {
        setDeletingPurchase(null)
        if (purchases.length === 1 && page > 1) {
          handlePageChange(page - 1)
        }
      },
    })
  }

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const columns: Column<PurchaseSummary>[] = [
    {
      header: "Tanggal Beli",
      className: "w-32",
      cell: (item) => formatDate(item.purchaseDate),
    },
    {
      header: "No. Invoice",
      className: "w-36",
      cell: (item) => item.invoiceNumber || "-",
    },
    {
      header: "Supplier",
      className: "w-44",
      cell: (item) => item.supplier?.name || "-",
    },
    {
      header: "Produk",
      className: "min-w-56",
      cell: (item) => (
        <span className="whitespace-normal break-words">
          {item.products?.length ? item.products.join(", ") : "-"}
        </span>
      ),
    },
    {
      header: "Total",
      className: "w-40 text-right",
      cell: (item) => formatCurrency(item.totalAmount),
    },
    {
      header: "Aksi",
      className: "w-28 text-center",
      cell: (item) => (
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Detail Pembelian"
            className="text-blue-500 hover:text-blue/80 hover:bg-muted cursor-pointer"
            onClick={() => setDetailId(item.id)}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Hapus Pembelian"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer"
            onClick={() => setDeletingPurchase(item)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuat data pembelian.</p>
  }

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Riwayat Pembelian</h1>
          <p className="text-sm text-muted-foreground">Lihat dan kelola riwayat pembelian per invoice</p>
        </div>
        <Button
          className="w-full sm:w-auto cursor-pointer font-medium px-3 py-4"
          onClick={handleAdd}
        >
          Tambah
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground">Tampilkan:</span>
          <LimitSelect value={limit} onChange={handleLimitChange} />
        </div>
        <div className="relative w-full sm:max-w-sm">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
            placeholder="Cari pembelian..."
            isFetching={isFetching}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={purchases}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={search ? "Data tidak ditemukan" : "Belum ada riwayat pembelian"}
        emptyIcon={
          search ? (
            <SearchX className="size-8 text-muted-foreground/60" />
          ) : (
            <Inbox className="size-8 text-muted-foreground/60" />
          )
        }
        page={page}
        limit={limit}
      />

      {pagination && (
        <CustomPagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      <PurchaseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        purchase={null}
      />

      <PurchaseDetailDialog
        open={!!detailId}
        onOpenChange={(open) => !open && setDetailId(null)}
        purchaseId={detailId}
      />

      <ConfirmModal
        open={!!deletingPurchase}
        onOpenChange={(open) => !open && setDeletingPurchase(null)}
        title="Hapus Pembelian"
        description={
          <>
            Anda yakin ingin menghapus pembelian dengan invoice{" "}
            <strong className="font-bold">{deletingPurchase?.invoiceNumber || "tanpa invoice"}</strong> dari
            supplier <strong className="font-bold">{deletingPurchase?.supplier?.name}</strong>? Seluruh
            item pada pembelian ini akan dihapus dan tidak dapat dibatalkan.
          </>
        }
        confirmText="Hapus"
        variant="danger"
        isLoading={deletePurchase.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
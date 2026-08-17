"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import type { Column } from "@/components/common/DataTable"
import { Pencil, Trash2, SearchX, Inbox, Plus, Eye } from "lucide-react"
import { LimitSelect } from "@/components/common/LimitSelect"
import { SearchBar } from "@/components/common/SearchBar"
import { useDebouncedValue } from "@/hooks/useDebounceValue"
import { CustomPagination } from "@/components/common/Pagination"
import { Switch } from "@/components/ui/switch"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { usePermission } from "@/hooks/usePermission"
import { useProducts, useUpdateProductStatus, useDeleteProduct } from "../hooks"
import { ProductResponse } from "../types/product"
import { ProductFormDialog } from "./ProductFormDialog"
import { ProductDetailDialog } from "./ProductDetailDialog"

export function ProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { hasPermission } = usePermission()

  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)
  const search = searchParams.get("search") ?? ""

  // Queries & Mutations
  const { data, isLoading, isFetching, isError } = useProducts({ page, limit, search })
  const updateStatus = useUpdateProductStatus()
  const deleteProduct = useDeleteProduct()

  // State
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailProductId, setDetailProductId] = useState<string | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null)

  // Search logic
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

  const products = data?.items ?? []
  const pagination = data?.pagination

  const handleStatusChange = (product: ProductResponse, newStatus: boolean) => {
    updateStatus.mutate({
      id: product.id,
      payload: { isActive: newStatus },
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

  const handleAddClick = () => {
    setSelectedProductId(null)
    setFormDialogOpen(true)
  }

  const handleDetailClick = (id: string) => {
    setDetailProductId(id)
    setDetailDialogOpen(true)
  }

  const handleEditClick = (id: string) => {
    setSelectedProductId(id)
    setFormDialogOpen(true)
  }

  const handleDeleteClick = (id: string, name: string) => {
    setProductToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!productToDelete) return
    deleteProduct.mutate(productToDelete.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setProductToDelete(null)
      },
    })
  }

  const columns: Column<ProductResponse>[] = [
    {
      header: "Nama",
      className: "min-w-48",
      cell: (item) => item.name || "-"
    },
    {
      header: "Kategori",
      className: "w-40",
      cell: (item) => item.category?.name || "-"
    },
    {
      header: "Base Unit",
      className: "w-24 text-center",
      cell: (item) => item.baseUnit?.name || "-"
    },
    {
      header: "Stok Minimal",
      className: "w-24 text-center",
      cell: (item) => (item.minimumStock !== undefined && item.minimumStock !== null ? item.minimumStock : "-")
    },
    {
      header: "Stok",
      className: "w-28 text-center",
      cell: (item) => {
        if (item.stock === undefined || item.stock === null) return "-"
        const low = item.minimumStock !== undefined && item.stock < item.minimumStock
        return (
          <span className={`font-semibold ${low ? "text-destructive" : "text-foreground"}`}>
            {item.stock} {item.baseUnit?.name ?? ""}
          </span>
        )
      },
    },
    {
      header: "Margin Threshold",
      className: "w-28 text-center",
      cell: (item) => (item.marginThresholdPercent !== undefined && item.marginThresholdPercent !== null ? `${item.marginThresholdPercent}%` : "-")
    },
    {
      header: "Status",
      className: "w-24 text-center",
      cell: (item) => {
        const isPendingThis = updateStatus.isPending && updateStatus.variables?.id === item.id
        const canUpdate = hasPermission("products:update")
        return (
          <div>
            <Switch
              checked={item.isActive}
              onCheckedChange={(checked) => handleStatusChange(item, checked)}
              disabled={isPendingThis || !canUpdate}
              className="cursor-pointer disabled:cursor-not-allowed scale-90"
            />
          </div>
        )
      },
    },
    {
      header: "Aksi",
      className: "w-32 text-center",
      cell: (item) => (
        <div className="flex justify-center gap-1">
          {hasPermission("products:update") && (
            <Button
              variant="ghost"
              size="icon"
              title="Edit Produk"
              onClick={() => handleEditClick(item.id)}
              className="text-yellow-500 hover:text-yellow-500/80 hover:bg-muted cursor-pointer"
            >
              <Pencil className="size-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            title="Lihat Detail"
            onClick={() => handleDetailClick(item.id)}
            className="text-blue-500 hover:text-blue-500/80 hover:bg-muted cursor-pointer"
          >
            <Eye className="size-4" />
          </Button>
          {hasPermission("products:delete") && (
            <Button
              variant="ghost"
              size="icon"
              title="Hapus Produk"
              onClick={() => handleDeleteClick(item.id, item.name)}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuat produk.</p>
  }

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen Produk</h1>
          <p className="text-sm text-muted-foreground">Kelola data katalog produk Anda</p>
        </div>
        {hasPermission("products:create") && (
          <Button
            onClick={handleAddClick}
            className="w-full sm:w-auto cursor-pointer font-medium px-3 py-4 gap-1.5"
          >
            <Plus className="size-4" /> Tambah Produk
          </Button>
        )}
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
            placeholder="Cari produk..."
            isFetching={isFetching}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={search ? "Data tidak ditemukan" : "Belum ada produk"}
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

      {/* Product detail view dialog */}
      <ProductDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        productId={detailProductId}
      />

      {/* Main product form dialog (Add/Edit) */}
      <ProductFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        productId={selectedProductId}
      />

      {/* Product deletion confirmation dialog */}
      <ConfirmModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Produk"
        description={
          productToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus produk <strong className="font-bold">{productToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan dan akan ditolak jika produk telah memiliki riwayat transaksi/stok.
            </>
          ) : ""
        }
        confirmText="Hapus"
        variant="danger"
        isLoading={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

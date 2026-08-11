"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import type { Column } from "@/components/common/DataTable"
import { Pencil, Trash2, SearchX, Inbox } from "lucide-react"
import { LimitSelect } from "@/components/common/LimitSelect"
import { SearchBar } from "@/components/common/SearchBar"
import { useDebouncedValue } from "@/hooks/useDebounceValue"
import { CustomPagination } from "@/components/common/Pagination"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useSuppliers } from "../hooks/useSuppliers"
import { SupplierResponse } from "../types/supplier"
import { Switch } from "@/components/ui/switch"

export function SuppliersPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)
  const search = searchParams.get("search") ?? ""

  const { data, isLoading, isFetching, isError } = useSuppliers({ page, limit, search })

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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<SupplierResponse | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<SupplierResponse | null>(null)

  const suppliers = data?.items ?? []
  const pagination = data?.pagination
  // const deleteSupplier = useDeleteSupplier()

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  // const handleAdd = () => {
  //   setEditingSupplier(null)
  //   setDialogOpen(true)
  // }

  // const handleEdit = (supplier: SupplierResponse) => {
  //   setEditingSupplier(supplier)
  //   setDialogOpen(true)
  // }

  // const handleDelete = () => {
  //   if (!deletingSupplier) return

  // const handleStatusChange = (supplier: SupplierResponse, newStatus: boolean) => {
  //   updateStatus.mutate({
  //     id: user.id,
  //     payload: { isActive: newStatus },
  //   })
  // }

  //   deleteSupplier.mutate(deletingSupplier.id, {
  //     onSuccess: () => {
  //       setDeletingSupplier(null)
  //       if (units.length === 1 && page > 1) {
  //         handlePageChange(page - 1)
  //       }
  //     },
  //   })
  // }

  const columns: Column<SupplierResponse>[] = [
    { header: "Nama Supplier", accessorKey: "name" },
    { header: "Kontak Supplier", accessorKey: "contactName" },
    { header: "No Telp/Hp", accessorKey: "phone" },
    { header: "Alamat", accessorKey: "address" },
    {
      header: "Status",
      cell: (item) => {
        // const isPendingThis = updateStatus.isPending && updateStatus.variables?.id === item.id
        return (
          <div>
            <Switch 
              checked={item.isActive} 
              // onCheckedChange={(checked) => handleStatusChange(item, checked)}
              // disabled={isPendingThis || isSelf}
              className="cursor-pointer disabled:cursor-not-allowed" 
            />
          </div>
        )
      },
    },
    {
      header: "Aksi",
      className: "w-28 text-center",
      cell: (item) => (
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Edit Satuan"
            className="text-yellow-500 hover:text-yellow-500/80 hover:bg-muted cursor-pointer"
            // onClick={() => handleEdit(item)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Hapus Satuan"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer"
            // onClick={() => setDeletingUnit(item)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuat satuan.</p>
  }

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen Satuan</h1>
          <p className="text-sm text-muted-foreground">Kelola data satuan produk</p>
        </div>
        <Button
          className="w-full sm:w-auto cursor-pointer font-medium px-3 py-4"
          // onClick={handleAdd}
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
            placeholder="Cari satuan..."
            isFetching={isFetching}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={search ? "Data tidak ditemukan" : "Belum ada satuan"}
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

      {/* <UnitFormDialog open={dialogOpen} onOpenChange={setDialogOpen} unit={editingUnit} /> */}

      {/* <ConfirmModal
        open={!!deletingUnit}
        onOpenChange={(open) => !open && setDeletingUnit(null)}
        title="Hapus Satuan"
        description={
          <>
            Anda yakin ingin menghapus satuan{" "}
            <strong className="font-bold">{deletingUnit?.name}</strong>? Tindakan ini tidak
            dapat dibatalkan.
          </>
        }
        confirmText="Hapus"
        variant="danger"
        isLoading={deleteUnit.isPending}
        onConfirm={handleDelete}
      /> */}
    </div>
  )
}
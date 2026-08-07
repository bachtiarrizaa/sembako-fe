"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import type { Column } from "@/components/common/DataTable"
import { useRoles } from "../hooks/useRoles"
import { Pencil, Trash2 } from "lucide-react"
import type { Role } from "../types/role"

export function RolesPage() {
  const { data, isLoading, isFetching, isError } = useRoles()

  const roles = data?.items ?? []

  const columns: Column<Role>[] = [
    { header: "Nama Role", accessorKey: "name" },
    {
      header: "Aksi",
      className: "w-28 text-center",
      cell: () => (
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Edit Role"
            className="text-yellow-500 hover:text-yellow-500/80 hover:bg-muted cursor-pointer"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Hapus Role"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuat role.</p>
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen Role</h1>
          <p className="text-sm text-muted-foreground">Kelola role dan hak akses pengguna</p>
        </div>
        <Button className="w-full sm:w-auto cursor-pointer font-medium px-3 py-4 bg-primary text-primary-foreground">
          Tambah
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="Belum ada role"
      />
    </div>
  )
}
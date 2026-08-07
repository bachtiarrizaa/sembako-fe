"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import type { Column } from "@/components/common/DataTable"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useRoles } from "../hooks/useRoles"
import { useDeleteRole } from "../hooks/useDeleteRole"
import { RoleFormDialog } from "./RoleFormDialog"
import { Pencil, Trash2 } from "lucide-react"
import type { Role } from "../types/role"

export function RolesPage() {
  const { data, isLoading, isFetching, isError } = useRoles()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const [deletingRole, setDeletingRole] = useState<Role | null>(null)

  const roles = data?.items ?? []
  const deleteRole = useDeleteRole()

  const handleAdd = () => {
    setEditingRole(null)
    setDialogOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setDialogOpen(true)
  }

  const handleDelete = () => {
    if (!deletingRole) return
    
    deleteRole.mutate(deletingRole.id, {
      onSuccess: () => setDeletingRole(null),
    })
  }

  const columns: Column<Role>[] = [
    { header: "Nama Role", accessorKey: "name" },
    {
      header: "Aksi",
      className: "w-28 text-center",
      cell: (item) => (
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Edit Role"
            className="text-yellow-500 hover:text-yellow-500/80 hover:bg-muted cursor-pointer"
            onClick={() => handleEdit(item)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Hapus Role"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer"
            onClick={() => setDeletingRole(item)}
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
        <Button
          className="w-full sm:w-auto cursor-pointer font-medium px-3 py-4"
          onClick={handleAdd}  
        >
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

      <RoleFormDialog open={dialogOpen} onOpenChange={setDialogOpen} role={editingRole} />

      <ConfirmModal
        open={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
        title="Hapus Role"
        description={
          <>
            Anda yakin ingin menghapus role{" "}
            <strong className="font-semibold">{deletingRole?.name}</strong>? Tindakan ini tidak
            dapat dibatalkan.
          </>
        }
        confirmText="Hapus"
        variant="danger"
        isLoading={deleteRole.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
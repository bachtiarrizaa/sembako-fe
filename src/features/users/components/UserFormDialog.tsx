"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { UserResponse } from "../types/user"
import { useCreateUser } from "../hooks/useCreateUser"
import { useUpdateUser } from "../hooks/useUpdateUser"
import {
  CreateUserRequest,
  userSchema,
  updateUserSchema,
  UserFormValues,
} from "../schemas/user.schema"
import { useRoles } from "@/features/roles/hooks/useRoles"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserResponse | null
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEdit = Boolean(user)

  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isPending = createUser.isPending || updateUser.isPending

  const { data: rolesData, isLoading: isRolesLoading } = useRoles({ page: 1, limit: 100 })
  const roles = rolesData?.items ?? []

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEdit ? updateUserSchema : userSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      roleId: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (open) {
      const resetValues: UserFormValues = {
        name: user?.name ?? "",
        email: user?.email ?? "",
        username: user?.username ?? "",
        roleId: user?.role.id ?? "",
        isActive: user?.isActive ?? true,
      }

      if (!isEdit) {
        resetValues.password = ""
      }

      reset(resetValues)
      clearErrors()
    }
  }, [open, user, reset, clearErrors, isEdit])

  const onSubmit = (values: UserFormValues) => {
    if (isEdit && user) {
      updateUser.mutate(
        { id: user.id, payload: values },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createUser.mutate(values as CreateUserRequest, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-[520px] sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? "Edit Pegawai" : "Tambah Pegawai"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Baris 1: Nama | Email */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                Nama
              </Label>
              <Input
                id="name"
                placeholder="Budi Santoso"
                className="bg-background w-full"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="budi@sembako.com"
                className="bg-background w-full"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Baris 2: Username | Role */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                Username
              </Label>
              <Input
                id="username"
                placeholder="budisantoso"
                className="bg-background w-full"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm font-medium text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Role</Label>
              <Controller
                control={control}
                name="roleId"
                render={({ field }) => (
                  <ComboboxSelect
                    items={roles}
                    value={field.value}
                    onChange={field.onChange}
                    getOptionValue={(role) => role.id}
                    getOptionLabel={(role) => role.name}
                    placeholder="Pilih role..."
                    searchPlaceholder="Cari role..."
                    emptyText="Role tidak ditemukan."
                    isLoading={isRolesLoading}
                    loadingText="Memuat role..."
                  />
                )}
              />
              {errors.roleId && (
                <p className="text-sm font-medium text-destructive">{errors.roleId.message}</p>
              )}
            </div>

            {/* Baris 3: Password, full width, cuma muncul saat create */}
            {!isEdit && (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-background w-full"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer font-medium px-3 py-4"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="cursor-pointer font-medium px-3 py-4"
              disabled={isPending}
            >
              {isPending && <Spinner data-icon="inline-start" className="size-4" />}
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
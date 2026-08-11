"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { SupplierResponse } from "../types/supplier"
import { useCreateSupplier, useUpdateSupplier } from "../hooks"
import {
  supplierSchema,
  SupplierFormValues,
} from "../schemas/supplier.schema"

interface SupplierFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: SupplierResponse | null
}

export function SupplierFormDialog({ open, onOpenChange, supplier }: SupplierFormDialogProps) {
  const isEdit = Boolean(supplier)

  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const isPending = createSupplier.isPending || updateSupplier.isPending

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contactName: "",
      phone: "",
      address: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: supplier?.name ?? "",
        contactName: supplier?.contactName ?? "",
        phone: supplier?.phone ?? "",
        address: supplier?.address ?? "",
      })
      clearErrors()
    }
  }, [open, supplier, reset, clearErrors])

  const onSubmit = (values: SupplierFormValues) => {
    if (isEdit && supplier) {
      updateSupplier.mutate(
        { id: supplier.id, payload: values },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createSupplier.mutate(values, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? "Edit Supplier" : "Tambah Supplier"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                Nama Supplier <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="PT Sumber Sembako Makmur"
                className="bg-background w-full"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-sm font-semibold text-foreground">
                  Nama Kontak Supplier
                </Label>
                <Input
                  id="contactName"
                  placeholder="Budi Santoso"
                  className="bg-background w-full"
                  {...register("contactName")}
                />
                {errors.contactName && (
                  <p className="text-sm font-medium text-destructive">{errors.contactName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                  No. Telepon / HP
                </Label>
                <Input
                  id="phone"
                  placeholder="081234567890"
                  className="bg-background w-full"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold text-foreground">
                Alamat
              </Label>
              <Textarea
                id="address"
                placeholder="Jl. Raya Industri No. 45, Jakarta"
                className="bg-background w-full min-h-[80px]"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm font-medium text-destructive">{errors.address.message}</p>
              )}
            </div>
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
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
import { CustomerResponse } from "../types/customer"
import { useCreateCustomer } from "../hooks/useCreateCustomer"
import { useUpdateCustomer } from "../hooks/useUpdateCustomer"
import { CreateCustomerRequest, customerSchema, UpdateCustomerRequest } from "../schemas/customer.schema"

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: CustomerResponse | null
}

export function CustomerFormDialog({ open, onOpenChange, customer }: CustomerFormDialogProps) {
  const isEdit = Boolean(customer)

  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const isPending = createCustomer.isPending || updateCustomer.isPending

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<CreateCustomerRequest>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: customer?.name ?? "",
        phoneNumber: customer?.phoneNumber ?? "",
        address: customer?.address ?? "",
      })
      clearErrors()
    }
  }, [open, customer, reset, clearErrors])

  const onSubmit = (values: UpdateCustomerRequest) => {
    if (isEdit && customer) {
      updateCustomer.mutate(
        { id: customer.id, payload: values },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createCustomer.mutate(values, {
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
            {isEdit ? "Edit Customer" : "Tambah Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                  Nama Customer <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Nama Customer"
                  className="bg-background w-full"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                  No. Telepon / HP <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="081234567890"
                  className="bg-background w-full"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-xs font-medium text-destructive">{errors.phoneNumber.message}</p>
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
                <p className="text-xs font-medium text-destructive">{errors.address.message}</p>
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
              {isPending ? (
                <Spinner data-icon="inline-start" className="size-4" />
              ) : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
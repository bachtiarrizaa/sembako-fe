"use client"

import { ReactNode, useEffect, useState } from "react"
import { useForm, Controller, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Product } from "@/features/products/types/product"
import { purchaseItemSchema } from "../schemas/purchase.schema"
import { PurchaseItemFormValues } from "../types/purchase"

interface PurchaseItemPopoverProps {
  trigger: ReactNode
  products: Product[]
  item?: PurchaseItemFormValues | null
  onSubmitItem: (values: PurchaseItemFormValues) => void
}

export function PurchaseItemPopover({
  trigger,
  products,
  item,
  onSubmitItem,
}: PurchaseItemPopoverProps) {
  const isEdit = Boolean(item)
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseItemFormValues>({
    resolver: zodResolver(purchaseItemSchema) as unknown as Resolver<PurchaseItemFormValues>,
    defaultValues: {
      productId: "",
      unitId: "",
      quantity: undefined,
      purchasePrice: undefined,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        productId: item?.productId ?? "",
        unitId: item?.unitId ?? "",
        quantity: item?.quantity,
        purchasePrice: item?.purchasePrice,
      })
      clearErrors()
    }
  }, [open, item, reset, clearErrors])

  const watchedProductId = watch("productId")
  const selectedProduct = products.find((p) => p.id === watchedProductId)
  const unitOptions = selectedProduct?.units ?? []

  const handleProductChange = (productId: string) => {
    setValue("productId", productId)
    const selected = products.find((p) => p.id === productId)
    if (selected) {
      const baseUnit = selected.units.find((u) => u.isBaseUnit)
      setValue("unitId", baseUnit ? baseUnit.unit.id : "")
    } else {
      setValue("unitId", "")
    }
  }

  const onFormSubmit = (values: PurchaseItemFormValues) => {
    onSubmitItem(values)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-[28rem] max-w-[calc(100vw-2rem)] gap-3 p-3"
        align="end"
        onInteractOutside={(event) => {
          if (event.target instanceof Element && event.target.closest('[data-base-ui-portal]')) {
            event.preventDefault()
          }
        }}
      >
        <form
          onSubmit={(e) => {
            e.stopPropagation()
            handleSubmit(onFormSubmit)(e)
          }}
          noValidate
          className="space-y-3"
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Produk <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="productId"
                  render={({ field }) => (
                    <ComboboxSelect
                      items={products}
                      value={field.value}
                      onChange={handleProductChange}
                      getOptionValue={(p) => p.id}
                      getOptionLabel={(p) => p.name}
                      placeholder="Cari dan pilih produk..."
                      searchPlaceholder="Ketik nama produk..."
                      emptyText="Produk tidak ditemukan."
                      portalContainer={null}
                    />
                  )}
                />
                {errors.productId?.message && (
                  <p className="text-xs font-medium text-destructive">{errors.productId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Satuan <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="unitId"
                  render={({ field }) => (
                    <ComboboxSelect
                      items={unitOptions}
                      value={field.value}
                      onChange={field.onChange}
                      getOptionValue={(u) => u.unit.id}
                      getOptionLabel={(u) => u.unit.name}
                      placeholder="Satuan..."
                      searchPlaceholder="Cari satuan..."
                      emptyText="Pilih produk dulu."
                      disabled={!watchedProductId}
                      portalContainer={null}
                    />
                  )}
                />
                {errors.unitId?.message && (
                  <p className="text-xs font-medium text-destructive">{errors.unitId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="popover-item-quantity" className="text-sm font-semibold text-foreground">
                  Jumlah <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="popover-item-quantity"
                  type="number"
                  placeholder="0"
                  className="bg-background h-8"
                  disabled={!watchedProductId}
                  {...register("quantity")}
                />
                {errors.quantity?.message && (
                  <p className="text-xs font-medium text-destructive">{errors.quantity.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="popover-item-price" className="text-sm font-semibold text-foreground">
                  Harga Beli <span className="text-destructive">*</span>
                </Label>
                <InputGroup className="bg-background">
                  <InputGroupAddon align="inline-start">Rp</InputGroupAddon>
                  <InputGroupInput
                    id="popover-item-price"
                    type="number"
                    placeholder="0"
                    disabled={!watchedProductId}
                    {...register("purchasePrice")}
                  />
                </InputGroup>
                {errors.purchasePrice?.message && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.purchasePrice.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer font-medium px-3 py-1.5 h-8"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="cursor-pointer font-medium px-3 py-1.5 h-8"
            >
              {isEdit ? "Simpan Item" : "Tambah Item"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
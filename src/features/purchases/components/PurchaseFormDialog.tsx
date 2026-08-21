"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { formatDateToYYYYMMDD } from "@/utils/format"
import { PurchaseResponse, PurchaseItemFormValues } from "../types/purchase"
import { useCreatePurchase, useUpdatePurchase } from "../hooks"
import { createPurchaseSchema, updatePurchaseSchema, CreatePurchaseRequest, UpdatePurchaseRequest } from "../schemas/purchase.schema"
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers"
import { useProducts, useProductDetails } from "@/features/products/hooks"
import { PurchaseHeaderFields } from "./PurchaseHeaderFields"
import { PurchaseEditFields } from "./PurchaseEditFields"
import { PurchaseItemsTable } from "./PurchaseItemsTable"

interface PurchaseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: PurchaseResponse | null
}

export interface PurchaseFormValues {
  supplierId: string
  invoiceNumber?: string | null
  purchaseDate: string
  productId?: string
  unitId?: string
  quantity?: number
  purchasePrice?: number
  items?: {
    productId: string
    unitId: string
    quantity?: number
    purchasePrice?: number
  }[]
}

export function PurchaseFormDialog({ open, onOpenChange, purchase }: PurchaseFormDialogProps) {
  const isEdit = Boolean(purchase)

  const createPurchase = useCreatePurchase()
  const updatePurchase = useUpdatePurchase()
  const isPending = createPurchase.isPending || updatePurchase.isPending

  // Load suppliers and products lists
  const { data: suppliersData, isLoading: isSuppliersLoading } = useSuppliers({ page: 1, limit: 100 })
  const suppliers = suppliersData?.items ?? []

  const { data: productsData } = useProducts({ page: 1, limit: 100, include: "units" })
  const products = productsData?.items ?? []

  // Check if current batch is partially sold (Edit Mode only)
  const isPartiallySold = isEdit && purchase ? purchase.remainingQuantity < purchase.initialQuantity : false

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(isEdit ? updatePurchaseSchema : createPurchaseSchema) as unknown as Resolver<PurchaseFormValues>,
    defaultValues: {
      supplierId: "",
      invoiceNumber: "",
      purchaseDate: formatDateToYYYYMMDD(new Date().toISOString()),
      // Edit mode fields
      productId: "",
      unitId: "",
      quantity: undefined,
      purchasePrice: undefined,
      // Add mode fields
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  // Convert errors.items to a type-safe format to avoid 'any' casting inside the JSX loop
  const itemsRootError = errors.items as unknown as { root?: { message?: string } } | undefined

  // Watch items to dynamically look up units for each product
  const watchedItems = watch("items") ?? []

  // In edit mode, fetch details of the product being edited to get its units list
  const { data: editProductDetailResponse } = useProductDetails(isEdit && purchase ? purchase.product?.id : undefined)
  const editProduct = editProductDetailResponse?.data
  const editProductUnits = editProduct?.units ?? []

  // Load purchase values on edit mode
  useEffect(() => {
    if (open) {
      if (isEdit && purchase) {
        const purchasedUnit = editProduct?.units.find((u) => u.unit.id === purchase.unit?.id)
        const baseUnit = editProduct?.units.find((u) => u.isBaseUnit)

        // Prefer the purchased unit (e.g. karung) so edit matches the original entry.
        // Legacy data (unit null) falls back to the base unit.
        const targetUnitId = purchasedUnit?.unit.id ?? baseUnit?.unit.id ?? purchase.unit?.id ?? ""

        // Backend normalizes quantity with the CURRENT conversion from product_units,
        // so prefill uses that same current conversion. Fall back to the
        // unitPrice/purchasePrice ratio only if the unit isn't found in the loaded list.
        let conversion = purchasedUnit?.conversionToBase
        if (!conversion && purchase.unit && purchase.unitPrice != null && purchase.purchasePrice > 0) {
          conversion = purchase.unitPrice / purchase.purchasePrice
        }

        reset({
          supplierId: purchase.supplier?.id ?? "",
          invoiceNumber: purchase.invoiceNumber ?? "",
          purchaseDate: formatDateToYYYYMMDD(purchase.purchaseDate),
          productId: purchase.product?.id ?? "",
          quantity:
            purchase.unit && conversion && conversion > 0
              ? Math.round((purchase.initialQuantity / conversion) * 100) / 100
              : purchase.initialQuantity,
          purchasePrice: purchase.unitPrice ?? purchase.purchasePrice,
          unitId: targetUnitId,
        })
      } else {
        // Add Mode
        reset({
          supplierId: "",
          invoiceNumber: "",
          purchaseDate: formatDateToYYYYMMDD(new Date().toISOString()),
          items: [],
        })
      }
      clearErrors()
    }
  }, [open, purchase, isEdit, reset, clearErrors, editProduct])

  const onSubmit = (values: PurchaseFormValues) => {
    if (isEdit && purchase) {
      const payload: UpdatePurchaseRequest = {
        supplierId: values.supplierId,
        invoiceNumber: values.invoiceNumber || "",
        purchaseDate: formatDateToYYYYMMDD(values.purchaseDate),
        quantity: Number(values.quantity),
        unitId: values.unitId || "",
        purchasePrice: Number(values.purchasePrice),
      }
      updatePurchase.mutate(
        { id: purchase.id, payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      const payload: CreatePurchaseRequest = {
        supplierId: values.supplierId,
        invoiceNumber: values.invoiceNumber || "",
        purchaseDate: formatDateToYYYYMMDD(values.purchaseDate),
        items: (values.items || []).map((item) => ({
          productId: item.productId,
          unitId: item.unitId,
          quantity: Number(item.quantity),
          purchasePrice: Number(item.purchasePrice),
        })),
      }
      createPurchase.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  const handleItemSubmit = (index: number | null, values: PurchaseItemFormValues) => {
    if (index === null) {
      append({ ...values })
    } else {
      setValue(`items.${index}`, values)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 p-0 sm:rounded-xl sm:max-w-3xl"
        onInteractOutside={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest('[data-base-ui-portal], [data-slot="popover-content"]')
          ) {
            event.preventDefault()
          }
        }}
      >
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? "Edit Pembelian" : "Tambah Pembelian"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5 px-6 py-4 max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* Alert info if partially sold in Edit mode */}
            {isPartiallySold && (
              <div className="flex gap-2.5 items-start bg-amber-50/80 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs leading-relaxed">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-semibold block mb-0.5">Stok telah terjual sebagian</span>
                  <span>
                    Batch pembelian ini telah berkurang karena penjualan (Stok sisa: {purchase?.remainingQuantity} dari {purchase?.initialQuantity} {purchase?.product?.name}).
                    Stok awal dan harga beli tidak dapat diubah lagi untuk menjaga integritas data FIFO.
                  </span>
                </div>
              </div>
            )}

            {/* Top row fields: Supplier, Purchase Date, Invoice */}
            <PurchaseHeaderFields
              control={control}
              register={register}
              errors={errors}
              suppliers={suppliers}
              isSuppliersLoading={isSuppliersLoading}
            />

            <hr className="border-border" />

            {/* Conditional Form Body */}
            {isEdit ? (
              <PurchaseEditFields
                control={control}
                register={register}
                errors={errors}
                purchase={purchase}
                editProductUnits={editProductUnits}
                isPartiallySold={isPartiallySold}
              />
            ) : (
              <PurchaseItemsTable
                fields={fields}
                watchedItems={watchedItems}
                products={products}
                onAddItem={(values) => handleItemSubmit(null, values)}
                onEditItem={(index, values) => handleItemSubmit(index, values)}
                onRemoveItem={remove}
                itemsRootError={itemsRootError?.root}
              />
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
              {isPending ? <Spinner className="size-4" /> : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

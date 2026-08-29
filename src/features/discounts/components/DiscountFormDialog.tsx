"use client"

import { useEffect, useMemo } from "react"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useCreateDiscount, useUpdateDiscount, useDiscountDetails } from "../hooks"
import { discountSchema, CreateDiscountRequest } from "../schemas/discount.schema"
import { DISCOUNT_TYPES } from "../constants/discount.constant"
import { formatStartDate, formatEndDate } from "@/utils/format"
import { useProducts } from "@/features/products/hooks/useProducts"
import { DiscountFormFields } from "./DiscountFormFields"
import { DiscountFormProductsSection } from "./DiscountFormProductsSection"

interface DiscountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discountId?: string | null
}

export function DiscountFormDialog({ open, onOpenChange, discountId }: DiscountFormDialogProps) {
  const isEdit = Boolean(discountId)

  const createDiscount = useCreateDiscount()
  const updateDiscount = useUpdateDiscount()
  const isPending = createDiscount.isPending || updateDiscount.isPending

  // Fetch discount details if in edit mode
  const { data: detailResponse, isLoading: isDetailLoading } = useDiscountDetails(discountId)
  const discount = detailResponse?.data

  // Fetch products for dropdown selection
  const { data: productsData, isLoading: isProductsLoading } = useProducts(
    { page: 1, limit: 200, is_active: true },
    { enabled: open }
  )
  const products = productsData?.items ?? []

  // Derived lookup map: product name & category from active list + discount detail (for edit mode with inactive products)
  const productDetailsCache = useMemo(() => {
    const map: Record<string, { name: string; categoryName?: string }> = {}

    products.forEach((p) => {
      map[p.id] = { name: p.name, categoryName: p.category?.name ?? "Kategori N/A" }
    })

    discount?.products?.forEach((dp) => {
      const id = dp.id || dp.productId || dp.product?.id
      const name = dp.name || dp.product?.name
      if (id && name && !map[id]) {
        map[id] = { name, categoryName: dp.category?.name || dp.product?.category?.name || "Kategori N/A" }
      }
    })

    return map
  }, [products, discount?.products])

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateDiscountRequest>({
    resolver: zodResolver(discountSchema) as unknown as Resolver<CreateDiscountRequest>,
    defaultValues: {
      name: "",
      type: DISCOUNT_TYPES.PERCENT,
      value: undefined as unknown as number,
      startDate: null,
      endDate: null,
      products: [],
    },
  })

  const discountType = watch("type")
  const discountValue = watch("value")
  const formProducts = watch("products") || []

  useEffect(() => {
    if (discountType === DISCOUNT_TYPES.PERCENT && Number(discountValue) > 100) {
      setValue("value", 100)
    }
  }, [discountType, discountValue, setValue])

  useEffect(() => {
    if (open) {
      if (isEdit) {
        if (discount) {
          const existingProducts = discount.products || []
          const mappedProducts = existingProducts.map((p) => {
            return {
              productId: p.productId || p.id,
              isActive: p.isActive !== false
            }
          }).filter(Boolean) as { productId: string; isActive: boolean }[]

          reset({
            name: discount.name ?? "",
            type: discount.type ?? DISCOUNT_TYPES.PERCENT,
            value: discount ? Number(discount.value) : (undefined as unknown as number),
            startDate: discount.startDate ?? null,
            endDate: discount.endDate ?? null,
            products: mappedProducts,
          })
          clearErrors()
        }
      } else {
        reset({
          name: "",
          type: DISCOUNT_TYPES.PERCENT,
          value: undefined as unknown as number,
          startDate: null,
          endDate: null,
          products: [],
        })
        clearErrors()
      }
    }
  }, [open, discount, isEdit, reset, clearErrors])

  const handleSelectProduct = (productId: string) => {
    if (!formProducts.some((p) => p.productId === productId)) {
      setValue(
        "products",
        [...formProducts, { productId, isActive: true }],
        { shouldValidate: true }
      )
    }
  }

  const handleRemoveProduct = (productId: string) => {
    setValue(
      "products",
      formProducts.filter((p) => p.productId !== productId),
      { shouldValidate: true }
    )
  }

  const onSubmit = (values: CreateDiscountRequest) => {
    const payload = {
      name: values.name,
      type: values.type,
      value: values.value,
      startDate: values.startDate ? formatStartDate(new Date(values.startDate)) : null,
      endDate: values.endDate ? formatEndDate(new Date(values.endDate)) : null,
      products: values.products ?? [],
    }

    if (isEdit && discountId) {
      updateDiscount.mutate(
        { id: discountId, payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createDiscount.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  // Filter out already selected products from dropdown options
  const availableProducts = products.filter(
    (p) => !formProducts.some((fp) => fp.productId === p.id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-3xl sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? "Edit Diskon" : "Tambah Diskon"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex-1 flex flex-col overflow-hidden">
          <div className="space-y-5 px-6 py-4 max-h-[70vh] overflow-y-auto no-scrollbar">
            {isEdit && isDetailLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Spinner className="size-8" />
                <span className="text-xs text-muted-foreground">Memuat detail diskon...</span>
              </div>
            ) : (
              <>
                <DiscountFormFields
                  control={control}
                  register={register}
                  errors={errors}
                  discountType={discountType}
                  isPending={isPending}
                />

                {/* Separator line */}
                <hr className="border-border" />

                <DiscountFormProductsSection
                  availableProducts={availableProducts}
                  isProductsLoading={isProductsLoading}
                  isPending={isPending}
                  formProducts={formProducts}
                  productDetailsCache={productDetailsCache}
                  onSelectProduct={handleSelectProduct}
                  onStatusChange={(productId, isActive) => {
                    const newProducts = formProducts.map((p) =>
                      p.productId === productId ? { ...p, isActive } : p
                    )
                    setValue("products", newProducts, { shouldValidate: true })
                  }}
                  onRemoveProduct={handleRemoveProduct}
                  errors={errors}
                />
              </>
            )}
          </div>

          <DialogFooter className="border-t border-border px-6 py-4 shrink-0">
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
              disabled={isPending || (isEdit && isDetailLoading)}
            >
              {isPending ? <Spinner className="size-4" /> : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

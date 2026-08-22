"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, FormProvider, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { useUnits } from "@/features/units/hooks"
import { cn } from "@/utils/cn"
import { resolveStaticUrl } from "@/utils/format"
import { createProductSchema, updateProductSchema } from "../schemas/product.schema"
import { ProductFormValues, SelectedProductUnit } from "../types/product"
import {
  useProductDetails,
  useCreateProduct,
  useUpdateProduct,
} from "../hooks"
import { ProductUnitFormDialog } from "./ProductUnitFormDialog"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { ProductGeneralInfoStep } from "./ProductGeneralInfoStep"
import { ProductUnitsCreateStep } from "./ProductUnitsCreateStep"
import { ProductUnitsEditStep } from "./ProductUnitsEditStep"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId?: string | null
}

export function ProductFormDialog({ open, onOpenChange, productId }: ProductFormDialogProps) {
  const isEdit = Boolean(productId)
  const [step, setStep] = useState<1 | 2>(1)
  const lastSyncedProductIdRef = useRef<string | null>(null)

  // Mutations
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isPending = createProduct.isPending || updateProduct.isPending

  // Fetch product details if in edit mode
  const { data: detailResponse, isLoading: isDetailLoading } = useProductDetails(productId)
  const product = detailResponse?.data

  // Fetch categories & master units
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories({ page: 1, limit: 100 })
  const { data: unitsData, isLoading: isUnitsLoading } = useUnits({ page: 1, limit: 100 })
  const categories = categoriesData?.items ?? []
  const masterUnits = unitsData?.items ?? []

  // Sub-dialog states
  const [unitDialogOpen, setUnitDialogOpen] = useState(false)
  const [selectedProductUnit, setSelectedProductUnit] = useState<SelectedProductUnit | null>(null)
  const [deleteUnitConfirmOpen, setDeleteUnitConfirmOpen] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<SelectedProductUnit | null>(null)
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null)

  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Form setups
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(isEdit ? updateProductSchema : createProductSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      categoryId: "",
      minimumStock: "0",
      marginThresholdPercent: "0",
      image: undefined,
      units: [
        {
          unitId: "",
          conversionToBase: "1",
          sellingPrice: "0",
          isBaseUnit: true,
        },
      ],
    },
  })

  const { reset, setValue, watch, trigger, clearErrors, handleSubmit } = methods

  // Sync data when opening modal or detail loaded
  useEffect(() => {
    if (!open) {
      lastSyncedProductIdRef.current = null
      return
    }

    clearErrors()

    if (!isEdit) {
      if (lastSyncedProductIdRef.current !== "create") {
        setStep(1)
        setSelectedFile(null)
        setImagePreview(null)
        reset({
          name: "",
          categoryId: "",
          minimumStock: "0",
          marginThresholdPercent: "0",
          image: undefined,
          units: [
            {
              unitId: "",
              conversionToBase: "1",
              sellingPrice: "0",
              isBaseUnit: true,
            },
          ],
        })
        lastSyncedProductIdRef.current = "create"
      }
    } else {
      if (product && lastSyncedProductIdRef.current !== productId) {
        setStep(1)
        setSelectedFile(null)
        setImagePreview(null)
        reset({
          name: product.name,
          categoryId: product.category.id,
          minimumStock: String(product.minimumStock),
          marginThresholdPercent: String(product.marginThresholdPercent),
          image: undefined,
          units: product.units?.map((u) => ({
            id: u.id,
            unitId: u.unit.id,
            conversionToBase: String(u.conversionToBase),
            sellingPrice: String(u.sellingPrice),
            isBaseUnit: u.isBaseUnit,
            isActive: u.isActive,
          })) ?? [],
        })
        if (product.image) {
          setImagePreview(resolveStaticUrl(product.image))
        }
        lastSyncedProductIdRef.current = productId ?? null
      }
    }
  }, [open, isEdit, productId, product, reset, clearErrors])

  // Triggered when user clicks "Lanjut" in Step 1
  const handleLanjutStep1 = async () => {
    if (!isEdit) {
      const isValid = await trigger(["name", "categoryId", "minimumStock", "marginThresholdPercent"])
      if (isValid) setStep(2)
    } else {
      setStep(2)
    }
  }

  // Header click handler to step between pages
  const handleStepHeaderClick = async (targetStep: 1 | 2) => {
    if (targetStep === 1) {
      setStep(1)
    } else {
      if (!isEdit) {
        const isValid = await trigger(["name", "categoryId", "minimumStock", "marginThresholdPercent"])
        if (isValid) setStep(2)
      } else {
        setStep(2)
      }
    }
  }

  const handleUnitDialogSubmit = (values: { unitId: string; conversionToBase: string; sellingPrice: string }) => {
    const currentUnits = watch("units")
    if (selectedUnitIndex !== null) {
      setValue(`units.${selectedUnitIndex}.unitId`, values.unitId)
      setValue(`units.${selectedUnitIndex}.conversionToBase`, values.conversionToBase)
      setValue(`units.${selectedUnitIndex}.sellingPrice`, values.sellingPrice)
    } else {
      setValue("units", [
        ...currentUnits,
        {
          unitId: values.unitId,
          conversionToBase: values.conversionToBase,
          sellingPrice: values.sellingPrice,
          isBaseUnit: false,
          isActive: true,
        }
      ])
    }
    setUnitDialogOpen(false)
  }

  // Form submit handler for both create and edit modes
  const handleFormSubmit = (values: ProductFormValues) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("categoryId", values.categoryId)
    formData.append("minimumStock", String(Number(values.minimumStock || 0)))
    formData.append("marginThresholdPercent", String(Number(values.marginThresholdPercent || 0)))

    if (selectedFile) {
      formData.append("image", selectedFile)
    }

    const formattedUnits = values.units.map((u) => ({
      id: u.id,
      unitId: u.unitId,
      conversionToBase: Number(u.conversionToBase),
      sellingPrice: Number(u.sellingPrice),
      isBaseUnit: u.isBaseUnit,
      isActive: u.isActive ?? true,
    }))
    formData.append("units", JSON.stringify(formattedUnits))

    if (!isEdit) {
      createProduct.mutate(formData, {
        onSuccess: () => onOpenChange(false),
      })
    } else if (isEdit && productId) {
      updateProduct.mutate(
        { id: productId, formData },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden sm:max-w-2xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? `Edit Produk: ${product?.name ?? ""}` : "Tambah Produk Baru"}
          </DialogTitle>
        </DialogHeader>

        {/* Wizard progress steps */}
        <div className="flex border-b border-border bg-muted/20 shrink-0 px-6 justify-center py-2.5 gap-8">
          <button
            type="button"
            onClick={() => handleStepHeaderClick(1)}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold pb-1.5 border-b-2 transition-all cursor-pointer",
              step === 1 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className={cn(
              "flex items-center justify-center size-5 rounded-full text-[10px]",
              step === 1 ? "bg-primary text-primary-foreground font-bold" : "bg-muted-foreground/10 text-muted-foreground"
            )}>1</span>
            Informasi Umum
          </button>
          <button
            type="button"
            onClick={() => handleStepHeaderClick(2)}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold pb-1.5 border-b-2 transition-all cursor-pointer",
              step === 2 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className={cn(
              "flex items-center justify-center size-5 rounded-full text-[10px]",
              step === 2 ? "bg-primary text-primary-foreground font-bold" : "bg-muted-foreground/10 text-muted-foreground"
            )}>2</span>
            Satuan (Multi-Unit)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {isEdit && isDetailLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="size-8" />
              <span className="text-xs text-muted-foreground">Memuat detail produk...</span>
            </div>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="h-full flex flex-col flex-1">
                {/* STEP 1: GENERAL INFO FORM */}
                {step === 1 && (
                  <ProductGeneralInfoStep
                    isPending={isPending}
                    categories={categories}
                    isCategoriesLoading={isCategoriesLoading}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    setSelectedFile={setSelectedFile}
                  />
                )}

                {/* STEP 1: FOOTER (Batal & Lanjut ONLY) */}
                {step === 1 && (
                  <DialogFooter className="border-t border-border px-6 py-4 shrink-0 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isPending}
                      className="cursor-pointer font-medium px-3 py-4"
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      onClick={handleLanjutStep1}
                      disabled={isPending}
                      className="cursor-pointer font-medium px-3 py-4 gap-1"
                    >
                      Lanjut <ChevronRight className="size-4" />
                    </Button>
                  </DialogFooter>
                )}

                {/* STEP 2: CREATION MODE (Daftar Satuan) */}
                {step === 2 && !isEdit && (
                  <>
                    <ProductUnitsCreateStep
                      masterUnits={masterUnits}
                      isUnitsLoading={isUnitsLoading}
                      isPending={isPending}
                    />

                    {/* STEP 2 CREATE: FOOTER (Kembali & Simpan) */}
                    <DialogFooter className="border-t border-border px-6 py-4 shrink-0 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        disabled={isPending}
                        className="cursor-pointer font-medium px-3 py-4 gap-1"
                      >
                        <ChevronLeft className="size-4" /> Kembali
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer font-medium px-3 py-4"
                      >
                        {isPending ? <Spinner className="size-4" /> : "Simpan"}
                      </Button>
                    </DialogFooter>
                  </>
                )}

                {/* STEP 2: EDIT MODE (Manajemen Satuan Form State) */}
                {step === 2 && isEdit && product && (
                  <>
                    <ProductUnitsEditStep
                      product={product}
                      masterUnits={masterUnits}
                      onEditUnit={(index, unitVal) => {
                        setSelectedUnitIndex(index)
                        setSelectedProductUnit(unitVal)
                        setUnitDialogOpen(true)
                      }}
                      onDeleteUnit={(index, unitVal) => {
                        setSelectedUnitIndex(index)
                        setUnitToDelete(unitVal)
                        setDeleteUnitConfirmOpen(true)
                      }}
                      onAddUnit={() => {
                        setSelectedUnitIndex(null)
                        setSelectedProductUnit(null)
                        setUnitDialogOpen(true)
                      }}
                    />

                    {/* STEP 2 EDIT: FOOTER (Kembali & Simpan submit) */}
                    <DialogFooter className="border-t border-border px-6 py-4 shrink-0 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="cursor-pointer font-medium px-3 py-4 gap-1"
                      >
                        <ChevronLeft className="size-4" /> Kembali
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer font-medium px-3 py-4"
                      >
                        {isPending ? <Spinner className="size-4" /> : "Simpan"}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </form>
            </FormProvider>
          )}
        </div>
      </DialogContent>

      {/* Sub-dialog modal to add/edit unit packaging in Edit Mode */}
      {isEdit && product && (
        <ProductUnitFormDialog
          open={unitDialogOpen}
          onOpenChange={setUnitDialogOpen}
          productUnit={selectedProductUnit}
          existingUnitIds={watch("units")?.map((u) => u.unitId) ?? []}
          onSubmit={handleUnitDialogSubmit}
        />
      )}

      {/* Product unit deletion confirmation dialog */}
      {isEdit && product && (
        <ConfirmModal
          open={deleteUnitConfirmOpen}
          onOpenChange={setDeleteUnitConfirmOpen}
          title="Hapus Satuan"
          description={
            unitToDelete ? (
              <>
                Apakah Anda yakin ingin menghapus satuan <strong className="font-bold">{unitToDelete.unit?.name || ""}</strong>? Perubahan ini baru akan disimpan setelah Anda menekan tombol "Simpan" di form utama.
              </>
            ) : ""
          }
          confirmText="Hapus"
          variant="danger"
          onConfirm={() => {
            if (selectedUnitIndex !== null) {
              const currentUnits = watch("units")
              setValue("units", currentUnits.filter((_, idx) => idx !== selectedUnitIndex))
              setDeleteUnitConfirmOpen(false)
              setUnitToDelete(null)
              setSelectedUnitIndex(null)
            }
          }}
        />
      )}
    </Dialog>
  )
}

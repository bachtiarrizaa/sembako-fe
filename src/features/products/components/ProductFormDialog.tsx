"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Pencil, Image as ImageIcon, Upload, Info, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { useUnits } from "@/features/units/hooks"
import { cn } from "@/utils/cn"
import { formatCurrency, resolveStaticUrl } from "@/utils/format"
import { createProductSchema, updateProductSchema } from "../schemas/product.schema"
import { ProductResponse, ProductUnit } from "../types/product"
import {
  useProductDetails,
  useCreateProduct,
  useUpdateProduct,
} from "../hooks"
import { ProductUnitFormDialog } from "./ProductUnitFormDialog"
import { ConfirmModal } from "@/components/common/ConfirmModal"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId?: string | null
}

interface ProductFormValues {
  name: string
  categoryId: string
  minimumStock: string
  marginThresholdPercent: string
  image?: any
  units: {
    id?: string
    unitId: string
    conversionToBase: string
    sellingPrice: string
    isBaseUnit: boolean
    isActive?: boolean
  }[]
}

export function ProductFormDialog({ open, onOpenChange, productId }: ProductFormDialogProps) {
  const isEdit = Boolean(productId)
  const [step, setStep] = useState<1 | 2>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  // Sub-dialog for adding/editing product units in Edit Mode
  const [unitDialogOpen, setUnitDialogOpen] = useState(false)
  const [selectedProductUnit, setSelectedProductUnit] = useState<any>(null)
  const [deleteUnitConfirmOpen, setDeleteUnitConfirmOpen] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<any>(null)
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null)

  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Form setups
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(isEdit ? updateProductSchema : createProductSchema) as any,
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

  // Field array for units (only used in Create Mode)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "units",
  })

  const formUnits = watch("units")
  const formCategoryId = watch("categoryId")

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

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB")
        return
      }
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle Base Unit radio toggle in Create Mode
  const handleSetBaseUnit = (index: number) => {
    formUnits.forEach((_, idx) => {
      setValue(`units.${idx}.isBaseUnit`, idx === index)
      if (idx === index) {
        setValue(`units.${idx}.conversionToBase`, "1")
      }
    })
  }

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
    if (selectedUnitIndex !== null) {
      setValue(`units.${selectedUnitIndex}.unitId`, values.unitId)
      setValue(`units.${selectedUnitIndex}.conversionToBase`, values.conversionToBase)
      setValue(`units.${selectedUnitIndex}.sellingPrice`, values.sellingPrice)
    } else {
      append({
        unitId: values.unitId,
        conversionToBase: values.conversionToBase,
        sellingPrice: values.sellingPrice,
        isBaseUnit: false,
        isActive: true,
      })
    }
    setUnitDialogOpen(false)
  }

  // Form submit handler for both create and edit modes
  const handleFormSubmit = (values: any) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("categoryId", values.categoryId)
    formData.append("minimumStock", String(Number(values.minimumStock || 0)))
    formData.append("marginThresholdPercent", String(Number(values.marginThresholdPercent || 0)))

    if (selectedFile) {
      formData.append("image", selectedFile)
    }

    const formattedUnits = values.units.map((u: any) => ({
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
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="h-full flex flex-col flex-1">
              {/* STEP 1: GENERAL INFO FORM */}
              {step === 1 && (
                <div className="space-y-4 px-6 py-4 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div className="space-y-1.5 col-span-1 sm:col-span-2">
                      <Label htmlFor="name" className="text-xs font-semibold text-foreground">Nama Produk <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        placeholder="Contoh: Beras SPHP 5kg"
                        {...register("name")}
                        disabled={isPending}
                        className="bg-white"
                      />
                      {errors.name && (
                        <span className="text-[11px] text-destructive leading-none mt-1">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Kategori <span className="text-destructive">*</span></Label>
                      <ComboboxSelect
                        items={categories}
                        value={formCategoryId}
                        onChange={(val) => setValue("categoryId", val)}
                        getOptionValue={(c: any) => c.id}
                        getOptionLabel={(c: any) => c.name}
                        placeholder="Pilih Kategori..."
                        searchPlaceholder="Cari kategori..."
                        emptyText={isCategoriesLoading ? "Memuat kategori..." : "Kategori tidak ditemukan."}
                        isLoading={isCategoriesLoading}
                        className="w-full bg-white"
                      />
                      {errors.categoryId && (
                        <span className="text-[11px] text-destructive leading-none mt-1">
                          {errors.categoryId.message}
                        </span>
                      )}
                    </div>

                    {/* Image Upload Preview Block */}
                    <div className="space-y-1.5 row-span-3 sm:row-span-3 flex flex-col">
                      <Label className="text-xs font-semibold text-foreground">Gambar Produk (Max 2MB)</Label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isPending}
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "flex-1 min-h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all",
                          imagePreview ? "p-0 overflow-hidden relative group" : ""
                        )}
                      >
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <span className="text-xs text-white font-medium flex items-center gap-1">
                                <Upload className="size-3.5" /> Ganti Gambar
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-2 bg-muted rounded-full text-muted-foreground mb-1.5 shrink-0">
                              <ImageIcon className="size-5" />
                            </div>
                            <span className="text-xs font-semibold text-foreground">Upload Gambar</span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">Klik untuk telusuri berkas</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Minimum Stock */}
                    <div className="space-y-1.5">
                      <Label htmlFor="minimumStock" className="text-xs font-semibold text-foreground">Stok Minimal</Label>
                      <Input
                        id="minimumStock"
                        type="number"
                        placeholder="Contoh: 10"
                        {...register("minimumStock")}
                        disabled={isPending}
                        className="bg-white"
                      />
                      {errors.minimumStock && (
                        <span className="text-[11px] text-destructive leading-none mt-1">
                          {errors.minimumStock.message}
                        </span>
                      )}
                    </div>

                    {/* Margin Threshold */}
                    <div className="space-y-1.5">
                      <Label htmlFor="marginThresholdPercent" className="text-xs font-semibold text-foreground">Margin Threshold (%)</Label>
                      <Input
                        id="marginThresholdPercent"
                        type="number"
                        placeholder="Contoh: 15"
                        {...register("marginThresholdPercent")}
                        disabled={isPending}
                        className="bg-white"
                      />
                      {errors.marginThresholdPercent && (
                        <span className="text-[11px] text-destructive leading-none mt-1">
                          {errors.marginThresholdPercent.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
                <div className="space-y-3 px-6 py-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label className="text-xs font-bold text-foreground">Daftar Satuan</Label>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Info className="size-3 text-primary shrink-0" />
                        Tentukan 1 satuan sebagai Base Unit dengan konversi 1
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => append({ unitId: "", conversionToBase: "1", sellingPrice: "0", isBaseUnit: false })}
                      className="cursor-pointer h-8 text-xs gap-1 font-medium"
                    >
                      <Plus className="size-3.5" /> Tambah Satuan
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
                    {fields.map((field, index) => {
                      const isBase = formUnits[index]?.isBaseUnit
                      return (
                        <div
                          key={field.id}
                          className={cn(
                            "grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-lg border border-border bg-muted/10 items-end relative",
                            isBase ? "border-primary/20 bg-primary/[0.01]" : ""
                          )}
                        >
                          {/* Sub unit selector */}
                          <div className="space-y-1 sm:col-span-4">
                            <Label className="text-[10px] font-semibold text-muted-foreground">Satuan <span className="text-destructive">*</span></Label>
                            <ComboboxSelect
                              items={masterUnits}
                              value={formUnits[index]?.unitId || ""}
                              onChange={(val) => setValue(`units.${index}.unitId`, val)}
                              getOptionValue={(u: any) => u.id}
                              getOptionLabel={(u: any) => u.name}
                              placeholder="Pilih..."
                              searchPlaceholder="Cari..."
                              emptyText={isUnitsLoading ? "Memuat..." : "Kosong."}
                              isLoading={isUnitsLoading}
                              className="w-full bg-white h-8 text-xs"
                            />
                          </div>

                          {/* Conversion */}
                          <div className="space-y-1 sm:col-span-3">
                            <Label className="text-[10px] font-semibold text-muted-foreground">Faktor Konversi <span className="text-destructive">*</span></Label>
                            <Input
                              type="number"
                              step="any"
                              disabled={isBase}
                              placeholder="Contoh: 1"
                              {...register(`units.${index}.conversionToBase`)}
                              className="bg-white h-8 text-xs"
                            />
                          </div>

                          {/* Price */}
                          <div className="space-y-1 sm:col-span-3">
                            <Label className="text-[10px] font-semibold text-muted-foreground">Harga Jual (Rp) <span className="text-destructive">*</span></Label>
                            <Input
                              type="number"
                              placeholder="Contoh: 14000"
                              {...register(`units.${index}.sellingPrice`)}
                              className="bg-white h-8 text-xs"
                            />
                          </div>

                          {/* Actions (Base Radio & Remove) */}
                          <div className="flex items-center gap-2 sm:col-span-2 justify-end pb-1">
                            <button
                              type="button"
                              onClick={() => handleSetBaseUnit(index)}
                              className={cn(
                                "px-1.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer",
                                isBase
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-white text-muted-foreground border-border hover:bg-muted/50"
                              )}
                              title="Jadikan Base Unit"
                            >
                              Base
                            </button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1 || isBase}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {errors.units && (
                    <span className="text-[11px] text-destructive leading-none block mt-1">
                      {errors.units.message || (errors.units as any).root?.message}
                    </span>
                  )}

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
                </div>
              )}

              {/* STEP 2: EDIT MODE (Manajemen Satuan Form State) */}
              {step === 2 && isEdit && product && (
                <div className="space-y-4 px-6 py-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-foreground">Kemasan Satuan Produk</span>
                      <span className="text-[10px] text-muted-foreground">Kelola harga dan konversi multi-satuan</span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedUnitIndex(null)
                        setSelectedProductUnit(null)
                        setUnitDialogOpen(true)
                      }}
                      className="cursor-pointer h-8 text-xs gap-1 font-medium"
                    >
                      <Plus className="size-3.5" /> Tambah Satuan
                    </Button>
                  </div>

                  {/* Units Table */}
                  <div className="border border-border rounded-xl overflow-hidden bg-card flex-1">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40 border-b border-border">
                        <tr className="text-xs font-bold text-muted-foreground text-left">
                          <th className="px-4 py-2.5 font-bold">Satuan</th>
                          <th className="px-4 py-2.5 font-bold text-center">Base Unit?</th>
                          <th className="px-4 py-2.5 font-bold text-center">Faktor Konversi</th>
                          <th className="px-4 py-2.5 font-bold text-right">Harga Jual</th>
                          <th className="px-4 py-2.5 font-bold text-center">Status</th>
                          <th className="px-4 py-2.5 font-bold text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {fields.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground italic">
                              Belum ada satuan.
                            </td>
                          </tr>
                        ) : (
                          fields.map((field, index) => {
                            const unitVal = formUnits[index]
                            const unitDetail = masterUnits.find((mu) => mu.id === unitVal?.unitId)
                            const unitName = unitDetail?.name || ""
                            const isBase = unitVal?.isBaseUnit

                            // Find base unit name from form state
                            const baseUnitField = formUnits.find((u) => u.isBaseUnit)
                            const baseUnitDetail = masterUnits.find((mu) => mu.id === baseUnitField?.unitId)
                            const baseUnitName = baseUnitDetail?.name || product?.baseUnit?.name || ""

                            return (
                              <tr key={field.id} className="hover:bg-muted/10">
                                <td className="px-4 py-3 font-semibold text-foreground">{unitName}</td>
                                <td className="px-4 py-3 text-center">
                                  {isBase ? (
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-transparent text-[10px] font-bold">
                                      Base Unit
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-medium text-slate-600">
                                  {unitVal?.conversionToBase} {baseUnitName}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-foreground">
                                  {formatCurrency(Number(unitVal?.sellingPrice || 0))}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Switch
                                    checked={unitVal?.isActive ?? true}
                                    onCheckedChange={(checked) => setValue(`units.${index}.isActive`, checked)}
                                    disabled={isBase}
                                    className="cursor-pointer scale-90"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedUnitIndex(index)
                                        setSelectedProductUnit({
                                          ...unitVal,
                                          unit: { id: unitVal.unitId, name: unitName }
                                        })
                                        setUnitDialogOpen(true)
                                      }}
                                      className="h-7 w-7 text-yellow-500 hover:text-yellow-500/80 hover:bg-muted cursor-pointer"
                                    >
                                      <Pencil className="size-3.5" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedUnitIndex(index)
                                        setUnitToDelete({
                                          ...unitVal,
                                          unit: { id: unitVal.unitId, name: unitName }
                                        } as any)
                                        setDeleteUnitConfirmOpen(true)
                                      }}
                                      disabled={isBase}
                                      className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

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
                </div>
              )}
            </form>
          )}
        </div>
      </DialogContent>

      {/* Sub-dialog modal to add/edit unit packaging in Edit Mode */}
      {isEdit && product && (
        <ProductUnitFormDialog
          open={unitDialogOpen}
          onOpenChange={setUnitDialogOpen}
          productUnit={selectedProductUnit}
          existingUnitIds={formUnits?.map((u) => u.unitId) ?? []}
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
              remove(selectedUnitIndex)
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

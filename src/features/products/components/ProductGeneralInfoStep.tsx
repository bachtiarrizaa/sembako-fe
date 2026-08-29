"use client"

import { useRef } from "react"
import { useFormContext } from "react-hook-form"
import { Image as ImageIcon, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { cn } from "@/utils/cn"
import { CategoryInfo, ProductFormValues } from "../types/product"

interface ProductGeneralInfoStepProps {
  isPending: boolean
  categories: CategoryInfo[]
  isCategoriesLoading: boolean
  imagePreview: string | null
  setImagePreview: (url: string | null) => void
  setSelectedFile: (file: File | null) => void
}

export function ProductGeneralInfoStep({
  isPending,
  categories,
  isCategoriesLoading,
  imagePreview,
  setImagePreview,
  setSelectedFile,
}: ProductGeneralInfoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProductFormValues>()

  const formCategoryId = watch("categoryId")

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

  return (
    <div className="space-y-4 px-6 py-4 flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="space-y-1.5 col-span-1 sm:col-span-2">
          <Label htmlFor="name" className="text-xs font-semibold text-foreground">
            Nama Produk <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Contoh: Beras SPHP 5kg"
            {...register("name")}
            disabled={isPending}
            className="bg-white"
          />
          {errors.name && (
            <span className="text-[11px] text-destructive leading-none mt-1 block">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Kategori <span className="text-destructive">*</span>
          </Label>
          <ComboboxSelect
            items={categories}
            value={formCategoryId}
            onChange={(val) => setValue("categoryId", val)}
            getOptionValue={(c: CategoryInfo) => c.id}
            getOptionLabel={(c: CategoryInfo) => c.name}
            placeholder="Pilih Kategori..."
            searchPlaceholder="Cari kategori..."
            emptyText={isCategoriesLoading ? "Memuat kategori..." : "Kategori tidak ditemukan."}
            isLoading={isCategoriesLoading}
            className="w-full bg-white"
          />
          {errors.categoryId && (
            <span className="text-[11px] text-destructive leading-none mt-1 block">
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
          <Label htmlFor="minimumStock" className="text-xs font-semibold text-foreground">
            Stok Minimal
          </Label>
          <Input
            id="minimumStock"
            type="number"
            placeholder="Contoh: 10"
            {...register("minimumStock")}
            disabled={isPending}
            className="bg-white"
          />
          {errors.minimumStock && (
            <span className="text-[11px] text-destructive leading-none mt-1 block">
              {errors.minimumStock.message}
            </span>
          )}
        </div>

        {/* Margin Threshold */}
        <div className="space-y-1.5">
          <Label htmlFor="marginThresholdPercent" className="text-xs font-semibold text-foreground">
            Margin Threshold (%)
          </Label>
          <Input
            id="marginThresholdPercent"
            type="number"
            placeholder="Contoh: 15"
            {...register("marginThresholdPercent")}
            disabled={isPending}
            className="bg-white"
          />
          {errors.marginThresholdPercent && (
            <span className="text-[11px] text-destructive leading-none mt-1 block">
              {errors.marginThresholdPercent.message}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

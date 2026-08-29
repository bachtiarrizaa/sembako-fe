"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Plus, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { cn } from "@/utils/cn"
import { UnitInfo, ProductFormValues } from "../types/product"

interface ProductUnitsCreateStepProps {
  masterUnits: UnitInfo[]
  isUnitsLoading: boolean
  isPending: boolean
}

export function ProductUnitsCreateStep({
  masterUnits,
  isUnitsLoading,
  isPending,
}: ProductUnitsCreateStepProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProductFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "units",
  })

  const formUnits = watch("units")

  const handleSetBaseUnit = (index: number) => {
    formUnits.forEach((_, idx) => {
      setValue(`units.${idx}.isBaseUnit`, idx === index)
      if (idx === index) {
        setValue(`units.${idx}.conversionToBase`, "1")
      }
    })
  }

  return (
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
                <Label className="text-[10px] font-semibold text-muted-foreground">
                  Satuan <span className="text-destructive">*</span>
                </Label>
                <ComboboxSelect
                  items={masterUnits}
                  value={formUnits[index]?.unitId || ""}
                  onChange={(val) => setValue(`units.${index}.unitId`, val)}
                  getOptionValue={(u: UnitInfo) => u.id}
                  getOptionLabel={(u: UnitInfo) => u.name}
                  placeholder="Pilih..."
                  searchPlaceholder="Cari..."
                  emptyText={isUnitsLoading ? "Memuat..." : "Kosong."}
                  isLoading={isUnitsLoading}
                  className="w-full bg-white h-8 text-xs"
                />
              </div>

              {/* Conversion */}
              <div className="space-y-1 sm:col-span-3">
                <Label className="text-[10px] font-semibold text-muted-foreground">
                  Faktor Konversi <span className="text-destructive">*</span>
                </Label>
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
                <Label className="text-[10px] font-semibold text-muted-foreground">
                  Harga Jual (Rp) <span className="text-destructive">*</span>
                </Label>
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
          {errors.units.message || (errors.units as unknown as { root?: { message?: string } }).root?.message}
        </span>
      )}
    </div>
  )
}

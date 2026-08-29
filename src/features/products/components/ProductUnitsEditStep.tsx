"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Plus, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/format"
import { UnitInfo, ProductResponse, ProductFormValues, SelectedProductUnit } from "../types/product"

interface ProductUnitsEditStepProps {
  product: ProductResponse
  masterUnits: UnitInfo[]
  onEditUnit: (index: number, unitVal: SelectedProductUnit) => void
  onDeleteUnit: (index: number, unitVal: SelectedProductUnit) => void
  onAddUnit: () => void
}

export function ProductUnitsEditStep({
  product,
  masterUnits,
  onEditUnit,
  onDeleteUnit,
  onAddUnit,
}: ProductUnitsEditStepProps) {
  const { setValue, watch, control } = useFormContext<ProductFormValues>()
  const { fields } = useFieldArray({
    control,
    name: "units",
  })

  const formUnits = watch("units")

  return (
    <div className="space-y-4 px-6 py-4 flex-1 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-foreground">Kemasan Satuan Produk</span>
          <span className="text-[10px] text-muted-foreground">Kelola harga dan konversi multi-satuan</span>
        </div>
        <Button
          type="button"
          onClick={onAddUnit}
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
                            onEditUnit(index, {
                              ...unitVal,
                              unit: { id: unitVal.unitId, name: unitName }
                            })
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
                            onDeleteUnit(index, {
                              ...unitVal,
                              unit: { id: unitVal.unitId, name: unitName }
                            })
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
    </div>
  )
}

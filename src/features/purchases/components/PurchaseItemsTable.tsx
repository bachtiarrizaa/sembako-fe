"use client"

import { FieldArrayWithId } from "react-hook-form"
import { Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/utils/format"
import type { Product } from "@/features/products/types/product"
import { PurchaseItemPopover } from "./PurchaseItemPopover"
import { PurchaseItemFormValues } from "../types/purchase"
import type { PurchaseFormValues } from "./PurchaseFormDialog"

interface PurchaseItemsTableProps {
  fields: FieldArrayWithId<PurchaseFormValues, "items", "id">[]
  watchedItems: PurchaseFormValues["items"]
  products: Product[]
  onAddItem: (values: PurchaseItemFormValues) => void
  onEditItem: (index: number, values: PurchaseItemFormValues) => void
  onRemoveItem: (index: number) => void
  itemsRootError?: { message?: string }
}

export function PurchaseItemsTable({
  fields,
  watchedItems,
  products,
  onAddItem,
  onEditItem,
  onRemoveItem,
  itemsRootError,
}: PurchaseItemsTableProps) {
  const safeWatchedItems = watchedItems ?? []

  return (
    <div className="space-y-4">
      {/* Header and Add Button */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-bold text-foreground">Daftar Item</Label>
        <PurchaseItemPopover
          trigger={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer"
            >
              Tambah Item
            </Button>
          }
          products={products}
          item={null}
          onSubmitItem={onAddItem}
        />
      </div>

      {/* Table / Empty State */}
      {safeWatchedItems.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada item. Klik &quot;Tambah Item&quot; untuk menambahkan.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-primary">
              <TableRow className="bg-primary border-0 hover:bg-primary">
                <TableHead className="w-[30%] font-bold text-primary-foreground px-3 py-2">
                  Nama Produk
                </TableHead>
                <TableHead className="w-[18%] font-bold text-primary-foreground px-3 py-2">
                  Satuan
                </TableHead>
                <TableHead className="w-[14%] font-bold text-primary-foreground px-3 py-2 text-right">
                  Jumlah
                </TableHead>
                <TableHead className="w-[14%] font-bold text-primary-foreground px-3 py-2 text-right">
                  Harga
                </TableHead>
                <TableHead className="w-[16%] font-bold text-primary-foreground px-3 py-2 text-right">
                  Total
                </TableHead>
                <TableHead className="w-24 font-bold text-primary-foreground px-3 py-2 text-center">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, idx) => {
                const item = safeWatchedItems[idx]
                const product = products.find((p) => p.id === item?.productId)
                const unit = product?.units.find((u) => u.unit.id === item?.unitId)
                const unitLabel = unit?.unit.name ?? "-"

                return (
                  <TableRow key={field.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="h-9 text-gray-600 px-3 py-2 whitespace-normal break-words">
                      {product?.name || "-"}
                    </TableCell>
                    <TableCell className="h-9 text-gray-600 px-3 py-2 whitespace-normal break-words">
                      {unitLabel}
                    </TableCell>
                    <TableCell className="h-9 text-gray-600 px-3 py-2 text-right">
                      {item?.quantity ?? 0}
                    </TableCell>
                    <TableCell className="h-9 text-gray-600 px-3 py-2 text-right">
                      {formatCurrency(item?.purchasePrice)}
                    </TableCell>
                    <TableCell className="h-9 font-medium text-gray-800 px-3 py-2 text-right">
                      {formatCurrency(
                        Number(item?.quantity ?? 0) * Number(item?.purchasePrice ?? 0)
                      )}
                    </TableCell>
                    <TableCell className="h-9 text-gray-600 px-3 py-2">
                      <div className="flex justify-center gap-1">
                        <PurchaseItemPopover
                          trigger={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Edit Item"
                              className="text-yellow-500 hover:text-yellow-500/80 hover:bg-muted cursor-pointer"
                            >
                              <Pencil className="size-4" />
                            </Button>
                          }
                          products={products}
                          item={item}
                          onSubmitItem={(values) => onEditItem(idx, values)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Hapus Item"
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer"
                          onClick={() => onRemoveItem(idx)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter className="bg-muted/50">
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="font-semibold text-foreground px-3 py-2.5"
                >
                  Total
                </TableCell>
                <TableCell className="font-bold text-foreground px-3 py-2.5 text-right">
                  {formatCurrency(
                    safeWatchedItems.reduce(
                      (sum, item) =>
                        sum +
                        Number(item?.quantity ?? 0) * Number(item?.purchasePrice ?? 0),
                      0
                    )
                  )}
                </TableCell>
                <TableCell className="px-3 py-2.5" />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}

      {/* Error Message */}
      {itemsRootError?.message && (
        <p className="text-xs font-medium text-destructive">{itemsRootError.message}</p>
      )}
    </div>
  )
}

"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SelectedProductItem {
  productId: string
  isActive: boolean
}

interface DiscountFormProductsTableProps {
  formProducts: SelectedProductItem[]
  productDetailsCache: Record<string, { name: string; categoryName?: string }>
  onStatusChange: (productId: string, isActive: boolean) => void
  onRemoveProduct: (productId: string) => void
  isPending: boolean
}

export function DiscountFormProductsTable({
  formProducts,
  productDetailsCache,
  onStatusChange,
  onRemoveProduct,
  isPending,
}: DiscountFormProductsTableProps) {
  if (formProducts.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-xl py-6 text-center bg-muted/5 min-h-[90px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Belum ada produk terpilih.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
      <Table className="table-fixed w-full">
        <TableHeader className="bg-primary sticky top-0 z-10">
          <TableRow className="bg-primary border-0 hover:bg-primary">
            <TableHead className="w-[65%] font-bold text-primary-foreground px-4 py-2.5">
              Nama Produk
            </TableHead>
            <TableHead className="w-[20%] font-bold text-primary-foreground px-4 py-2.5 text-center">
              Status
            </TableHead>
            <TableHead className="w-[15%] min-w-[60px] font-bold text-primary-foreground px-4 py-2.5 text-center">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formProducts.map((fp) => {
            const cachedDetail = productDetailsCache[fp.productId]
            const productName = cachedDetail?.name || fp.productId

            return (
              <TableRow key={fp.productId} className="hover:bg-muted/30 transition-colors">
                <TableCell className="px-4 py-2 text-foreground font-semibold whitespace-normal break-words truncate">
                  {productName}
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  <Switch
                    checked={fp.isActive}
                    onCheckedChange={(checked) => onStatusChange(fp.productId, checked)}
                    disabled={isPending}
                    className="cursor-pointer mx-auto"
                  />
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer rounded-md mx-auto"
                    onClick={() => onRemoveProduct(fp.productId)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

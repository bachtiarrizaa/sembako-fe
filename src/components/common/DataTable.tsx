import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchX, Inbox } from "lucide-react"

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T, index: number) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading: boolean
  isFetching?: boolean
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  page?: number
  limit?: number
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  isFetching = false,
  emptyMessage = "Belum ada data",
  emptyIcon,
  page = 1,
  limit = 10,
}: DataTableProps<T>) {
  return (
    <div className="relative bg-card border border-border rounded-xl overflow-x-auto shadow-xs">
      <Table className="w-full min-w-[800px]">
        <TableHeader className="bg-primary">
          <TableRow className="hover:bg-primary">
            <TableHead className="w-12 font-bold text-center text-primary-foreground px-3 py-2">
              No
            </TableHead>
            {columns.map((col, idx) => (
              <TableHead
                key={`header-${idx}`}
                className={`font-bold text-primary-foreground px-3 py-2 ${col.className ?? ""}`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || isFetching ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="hover:bg-muted/30 transition-colors">
                <TableCell className="h-9 text-center px-3 py-2">
                  <Skeleton className="h-4 w-5 mx-auto" />
                </TableCell>
                {columns.map((_, colIdx) => (
                  <TableCell key={`skeleton-cell-${colIdx}`} className="h-9 px-3 py-2">
                    <Skeleton className="h-4 w-3/4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2 py-6">
                  {emptyIcon ?? <SearchX className="size-8 text-muted-foreground/60" />}
                  <span>{emptyMessage}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="h-9 text-gray-600 text-center px-3 py-2">
                  {(page - 1) * limit + index + 1}
                </TableCell>
                {columns.map((col, colIdx) => (
                  <TableCell
                    key={`cell-${colIdx}`}
                    className={`h-9 text-gray-600 px-3 py-2 ${col.className ?? ""}`}
                  >
                    {col.cell
                      ? col.cell(item, index)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? "")
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
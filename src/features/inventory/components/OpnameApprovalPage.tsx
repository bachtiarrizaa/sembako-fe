"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/DataTable"
import type { Column } from "@/components/common/DataTable"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import { LimitSelect } from "@/components/common/LimitSelect"
import { CustomPagination } from "@/components/common/Pagination"
import { usePermission } from "@/hooks/usePermission"
import { useProducts } from "@/features/products/hooks"
import { useOpnameSubmissions } from "../hooks"
import { OpnameSubmission } from "../types/inventory"
import { OPNAME_STATUSES, OPNAME_STATUS_LABELS, type OpnameStatus } from "../constants/inventory.constant"
import { formatDate } from "@/utils/format"
import { SearchX, Inbox, RefreshCw, Eye } from "lucide-react"
import { OpnameStatusBadge } from "./OpnameStatusBadge"
import { OpnameDetailDialog } from "./OpnameDetailDialog"
import { OpnameRejectDialog } from "./OpnameRejectDialog"

const statusOptions = (Object.keys(OPNAME_STATUSES) as (keyof typeof OPNAME_STATUSES)[]).map(
  (key) => ({ value: OPNAME_STATUSES[key], label: OPNAME_STATUS_LABELS[OPNAME_STATUSES[key]] })
)

export function OpnameApprovalPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { hasPermission } = usePermission()
  const canApprove = hasPermission("opname:approve")

  // Read URL query params
  const statusFilter = (searchParams.get("status") ?? "") as "" | OpnameStatus
  const productIdFilter = searchParams.get("productId") ?? ""
  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)

  // Fetch products for dropdown filter
  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    page: 1,
    limit: 500,
  })
  const products = useMemo(() => productsData?.items ?? [], [productsData])

  // Fetch submissions
  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    isFetching: isSubmissionsFetching,
    refetch,
  } = useOpnameSubmissions({
    page,
    limit,
    status: statusFilter || undefined,
    productId: productIdFilter || undefined,
  })

  const submissions = submissionsData?.items ?? []
  const pagination = submissionsData?.pagination

  // Dialogs state
  const [selectedSubmission, setSelectedSubmission] = useState<OpnameSubmission | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)

  const openDetail = (submission: OpnameSubmission) => {
    setSelectedSubmission(submission)
    setDetailOpen(true)
  }

  const openReject = (submission: OpnameSubmission) => {
    setSelectedSubmission(submission)
    setRejectDialogOpen(true)
  }

  // Handlers for URL updates
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set("page", "1") // reset to page 1 on filter change
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("limit", newLimit.toString())
      params.set("page", "1")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )


  const columns: Column<OpnameSubmission>[] = [
    {
      header: "Tanggal Pengajuan",
      className: "w-44",
      cell: (item) => formatDate(item.submittedAt),
    },
    {
      header: "Diajukan Oleh",
      className: "w-36",
      cell: (item) => item.submitter.name,
    },
    {
      header: "Produk",
      className: "min-w-40",
      cell: (item) => item.product.name,
    },
    {
      header: "Stok Sistem",
      className: "w-24 text-center",
      cell: (item) => item.systemQty,
    },
    {
      header: "Stok Fisik",
      className: "w-24 text-center",
      cell: (item) => item.physicalQty,
    },
    {
      header: "Selisih",
      className: "w-24 text-center",
      cell: (item) => (
        <span
          className={`font-semibold ${item.discrepancy > 0
            ? "text-emerald-600"
            : item.discrepancy < 0
              ? "text-destructive"
              : "text-slate-600"
            }`}
        >
          {item.discrepancy > 0 ? "+" : ""}
          {item.discrepancy}
        </span>
      ),
    },
    {
      header: "Status",
      className: "w-28 text-center",
      cell: (item) => <OpnameStatusBadge status={item.status} />,
    },
    {
      header: "Disetujui Oleh",
      className: "w-40",
      cell: (item) => item.approver?.name || "-",
    },
    {
      header: "Aksi",
      className: "w-20 text-center",
      cell: (item) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDetail(item)}
            title="Lihat Detail"
            className="text-blue-500 hover:text-blue-500/80 hover:bg-muted cursor-pointer"
          >
            <Eye className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Persetujuan Opname Stok</h1>
          <p className="text-sm text-muted-foreground">Tinjau dan setujui penyesuaian selisih stok fisik dari kasir/staf</p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          title="Refresh Data"
          className="cursor-pointer gap-2 font-medium self-end sm:self-auto"
        >
          <RefreshCw className="size-4" />
          Refresh Data
        </Button>
      </div>

      {/* Submissions List Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Limit Select di sebelah kiri */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Tampilkan:</span>
            <LimitSelect value={limit} onChange={handleLimitChange} />
          </div>

          {/* Filter Product & Status di sebelah kanan */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <ComboboxSelect
                items={statusOptions}
                value={statusFilter}
                onChange={(val) => handleFilterChange("status", val)}
                getOptionValue={(s) => s.value}
                getOptionLabel={(s) => s.label}
                placeholder="Semua Status"
                searchPlaceholder="Ketik status..."
                className="w-full"
              />
            </div>

            {/* Product Filter */}
            <div className="w-full sm:w-64">
              <ComboboxSelect
                items={products}
                value={productIdFilter}
                onChange={(val) => handleFilterChange("productId", val)}
                getOptionValue={(p) => p.id}
                getOptionLabel={(p) => p.name}
                placeholder="Semua Produk"
                searchPlaceholder="Ketik nama produk..."
                emptyText={isProductsLoading ? "Memuat produk..." : "Produk tidak ditemukan."}
                isLoading={isProductsLoading}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={submissions}
          isLoading={isSubmissionsLoading}
          isFetching={isSubmissionsFetching}
          emptyMessage="Tidak ada data pengajuan opname yang sesuai filter."
          emptyIcon={
            statusFilter || productIdFilter ? (
              <SearchX className="size-8 text-muted-foreground/60" />
            ) : (
              <Inbox className="size-8 text-muted-foreground/60" />
            )
          }
          page={page}
          limit={limit}
        />

        {pagination && (
          <CustomPagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </div>

      {/* Reject Dialog */}
      <OpnameRejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        submission={selectedSubmission}
      />

      {/* Detail Dialog */}
      <OpnameDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        submission={selectedSubmission}
        canApprove={canApprove}
        onReject={(sub) => openReject(sub)}
      />
    </div>
  )
}

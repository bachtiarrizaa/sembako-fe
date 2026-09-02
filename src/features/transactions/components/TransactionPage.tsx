"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { DataTable } from "@/components/common/DataTable"
import type { Column } from "@/components/common/DataTable"
import { SearchX, Inbox, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LimitSelect } from "@/components/common/LimitSelect"
import { SearchBar } from "@/components/common/SearchBar"
import { useDebouncedValue } from "@/hooks/useDebounceValue"
import { CustomPagination } from "@/components/common/Pagination"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatTransactionDate } from "@/utils/format"
import {
  PAYMENT_METHOD_LABELS,
  TRANSACTION_STATUSES,
} from "../constants/transaction.constant"
import { useTransactions } from "../hooks"
import type { TransactionResponse, PaymentMethod } from "../types/transaction"
import { TransactionDetailDialog } from "./TransactionDetailDialog"
import { VoidTransactionDialog } from "./VoidTransactionDialog"
import { useUserMe } from "@/features/users/hooks/useUserMe"

export function TransactionsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: userData } = useUserMe()
  const userRole = userData?.data?.role?.name?.toLowerCase()
  const isCashier = userRole === "cashier"

  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)
  const search = searchParams.get("search") ?? ""

  const { data, isLoading, isFetching, isError } = useTransactions({ page, limit, search })

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("limit", newLimit.toString())
      params.set("page", "1")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const handleSearchChange = useCallback(
    (value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set("search", value)
      else params.delete("search")
      params.set("page", "1")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const [searchInput, setSearchInput] = useState(search)
  const [prevSearch, setPrevSearch] = useState(search)

  if (search !== prevSearch) {
    setPrevSearch(search)
    setSearchInput(search)
  }

  const debouncedSearch = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    if (debouncedSearch === search) return
    handleSearchChange(debouncedSearch || undefined)
  }, [debouncedSearch, search, handleSearchChange])

  const handleSearchSubmit = () => {
    handleSearchChange(searchInput.trim() || undefined)
  }

  const transactions = data?.items ?? []
  const pagination = data?.pagination

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPage.toString())
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)

  const [voidDialogOpen, setVoidDialogOpen] = useState(false)
  const [selectedVoidTransaction, setSelectedVoidTransaction] = useState<TransactionResponse | null>(null)

  const handleViewDetail = (transaction: TransactionResponse) => {
    setSelectedTransactionId(transaction.id)
    setDetailOpen(true)
  }

  const handleOpenVoidDialog = (transaction: TransactionResponse) => {
    setSelectedVoidTransaction(transaction)
    setVoidDialogOpen(true)
  }

  const renderPaymentBadge = (method: PaymentMethod) => {
    const label = PAYMENT_METHOD_LABELS[method] || method
    switch (method) {
      case "cash":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 hover:bg-emerald-50">
            {label}
          </Badge>
        )
      case "qris":
        return (
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 hover:bg-blue-50">
            {label}
          </Badge>
        )
      case "transfer":
        return (
          <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 hover:bg-purple-50">
            {label}
          </Badge>
        )
      default:
        return <Badge variant="outline">{label}</Badge>
    }
  }

  const columns: Column<TransactionResponse>[] = [
    {
      header: "No. Struk",
      cell: (item) => (
        <button
          type="button"
          onClick={() => handleViewDetail(item)}
          className="font-semibold text-gray-600 hover:underline font-mono text-xs cursor-pointer text-left"
        >
          {item.receiptNumber || "-"}
        </button>
      ),
    },
    {
      header: "Tanggal Transaksi",
      cell: (item) => formatTransactionDate(item.createdAt),
    },
    {
      header: "Kasir",
      cell: (item) => item.cashier?.name || "-",
    },
    {
      header: "Customer",
      cell: (item) => item.customer?.name || "-",
    },
    {
      header: "Jumlah Item",
      cell: (item) => `${item.items?.length ?? 0} item`,
    },
    {
      header: "Metode Bayar",
      cell: (item) => renderPaymentBadge(item.paymentMethod),
    },
    {
      header: "Diskon",
      cell: (item) =>
        item.totalDiscount > 0 ? (
          formatCurrency(item.totalDiscount)
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      header: "Total",
      cell: (item) => (
        <span className="font-bold text-foreground">
          {formatCurrency(item.total)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item) => {
        if (item.status === TRANSACTION_STATUSES.VOID) {
          const voidedByName = item.voidedByUser?.name
          return (
            <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 hover:bg-rose-50">
              Dibatalkan{voidedByName ? ` — oleh ${voidedByName}` : ""}
            </Badge>
          )
        }
        return (
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 hover:bg-emerald-50">
            Selesai
          </Badge>
        )
      },
    },
    {
      header: "Aksi",
      className: "w-24 text-center",
      cell: (item) => {
        const isVoided = item.status === TRANSACTION_STATUSES.VOID
        return (
          <div className="flex justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="Detail Transaksi"
              onClick={() => handleViewDetail(item)}
              className="text-blue-500 hover:text-blue-500/80 hover:bg-muted cursor-pointer"
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={isVoided ? "Transaksi Sudah Dibatalkan" : "Batalkan Transaksi"}
              onClick={() => handleOpenVoidDialog(item)}
              disabled={isVoided}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <X className="size-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuat transaksi.</p>
  }

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Riwayat Transaksi
          </h1>
          <p className="text-sm text-muted-foreground">
            {isCashier
              ? "Daftar riwayat transaksi penjualan Anda"
              : "Daftar seluruh transaksi penjualan toko"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground">Tampilkan:</span>
          <LimitSelect value={limit} onChange={handleLimitChange} />
        </div>
        <div className="relative w-full sm:max-w-sm">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
            placeholder="Cari no. struk atau kasir..."
            isFetching={isFetching}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={search ? "Transaksi tidak ditemukan" : "Belum ada transaksi"}
        emptyIcon={
          search ? (
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

      <TransactionDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        transactionId={selectedTransactionId}
      />

      <VoidTransactionDialog
        open={voidDialogOpen}
        onOpenChange={setVoidDialogOpen}
        transaction={selectedVoidTransaction}
      />
    </div>
  )
}
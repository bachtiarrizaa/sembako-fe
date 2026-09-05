"use client";

import Link from "next/link";
import { Receipt, ChevronRight, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { formatCurrency, formatTransactionDate } from "@/utils/format";
import {
  PAYMENT_METHOD_LABELS,
  TRANSACTION_STATUSES,
} from "@/features/transactions/constants/transaction.constant";
import type { TransactionResponse } from "@/features/transactions/types/transaction";

interface CashierRecentTransactionsTableProps {
  shiftOpen: boolean;
  isLoading?: boolean;
  transactions: TransactionResponse[];
  onSelectTransaction: (id: string) => void;
}

export function CashierRecentTransactionsTable({
  shiftOpen,
  isLoading = false,
  transactions,
  onSelectTransaction,
}: CashierRecentTransactionsTableProps) {
  const columns: Column<TransactionResponse>[] = [
    {
      header: "No. Struk",
      cell: (trx) => (
        <span className="font-bold font-mono text-slate-800">{trx.receiptNumber}</span>
      ),
    },
    {
      header: "Tanggal Transaksi",
      cell: (trx) => formatTransactionDate(trx.createdAt),
    },
    {
      header: "Pelanggan",
      cell: (trx) => <span className="font-semibold text-slate-700">{trx.customer?.name || "-"}</span>,
    },
    {
      header: "Metode Bayar",
      cell: (trx) => (
        <Badge
          variant="outline"
          className={
            trx.paymentMethod === "cash"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
              : trx.paymentMethod === "qris"
              ? "bg-blue-50 text-blue-700 border-blue-200 font-semibold"
              : "bg-purple-50 text-purple-700 border-purple-200 font-semibold"
          }
        >
          {PAYMENT_METHOD_LABELS[trx.paymentMethod] || trx.paymentMethod}
        </Badge>
      ),
    },
    {
      header: "Total",
      className: "text-right",
      cell: (trx) => <span className="font-bold text-slate-800">{formatCurrency(trx.total)}</span>,
    },
    {
      header: "Status",
      cell: (trx) => (
        <Badge
          variant="outline"
          className={
            trx.status === TRANSACTION_STATUSES.COMPLETED
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
              : "bg-rose-50 text-rose-700 border-rose-200 font-semibold"
          }
        >
          {trx.status === TRANSACTION_STATUSES.COMPLETED ? "Selesai" : "Dibatalkan"}
        </Badge>
      ),
    },
    {
      header: "Aksi",
      className: "w-24 text-center",
      cell: (trx) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            title="Lihat Detail Transaksi"
            onClick={() => onSelectTransaction(trx.id)}
            className="h-8 w-8 p-0 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            title="Cetak Struk"
            onClick={() => onSelectTransaction(trx.id)}
            className="h-8 w-8 p-0 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* Header Luar Card: Title di kiri, Lihat Semua di kanan */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Transaksi Terakhir
        </h2>
        {shiftOpen && transactions.length > 0 && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs text-primary font-bold px-0 h-auto hover:bg-transparent hover:text-primary/80 cursor-pointer"
          >
            <Link href="/cashier/history" className="flex items-center gap-1">
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {/* Mobile View: List Card (< sm) */}
      <div className="block sm:hidden border border-border rounded-xl bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
            <p className="text-xs text-slate-500">Memuat data transaksi...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <Receipt className="size-8 text-slate-400 mb-2 stroke-[1.5]" />
            <span className="text-xs font-semibold text-slate-700">
              {shiftOpen ? "Belum Ada Transaksi Shift Ini" : "Shift Kasir Belum Aktif"}
            </span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((trx) => (
              <div key={trx.id} className="p-3.5 space-y-2 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-mono text-slate-900">
                    {trx.receiptNumber}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      trx.status === TRANSACTION_STATUSES.COMPLETED
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0 px-1.5 font-semibold"
                        : "bg-rose-50 text-rose-700 border-rose-200 text-[10px] py-0 px-1.5 font-semibold"
                    }
                  >
                    {trx.status === TRANSACTION_STATUSES.COMPLETED ? "Selesai" : "Dibatalkan"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <span>Pelanggan: </span>
                    <span className="font-semibold text-slate-800">
                      {trx.customer?.name || "-"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      trx.paymentMethod === "cash"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0 px-1.5 font-semibold"
                        : trx.paymentMethod === "qris"
                        ? "bg-blue-50 text-blue-700 border-blue-200 text-[10px] py-0 px-1.5 font-semibold"
                        : "bg-purple-50 text-purple-700 border-purple-200 text-[10px] py-0 px-1.5 font-semibold"
                    }
                  >
                    {PAYMENT_METHOD_LABELS[trx.paymentMethod] || trx.paymentMethod}
                  </Badge>
                </div>

                <div className="text-[11px] text-slate-400">
                  {formatTransactionDate(trx.createdAt)}
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                  <div className="font-bold text-sm text-slate-900">
                    {formatCurrency(trx.total)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      title="Lihat Detail Transaksi"
                      onClick={() => onSelectTransaction(trx.id)}
                      className="h-8 w-8 p-0 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      title="Cetak Struk"
                      onClick={() => onSelectTransaction(trx.id)}
                      className="h-8 w-8 p-0 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tablet & Desktop View: Shared DataTable Component (>= sm) */}
      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={transactions}
          isLoading={isLoading}
          emptyMessage={
            shiftOpen
              ? "Belum ada transaksi struk yang diproses pada shift ini."
              : "Shift Kasir Belum Aktif. Silakan buka toko dan isi modal kas awal."
          }
          emptyIcon={<Receipt className="size-8 text-muted-foreground/60 stroke-[1.5]" />}
        />
      </div>
    </div>
  );
}

"use client";

import { DollarSign, Receipt, Wallet, QrCode, Building2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface CashierMetricsGridProps {
  shiftOpen: boolean;
  isLoading?: boolean;
  totalRevenue: number;
  totalTransactions: number;
  cashInDrawer: number;
  qrisTotal: number;
  transferTotal: number;
}

export function CashierMetricsGrid({
  shiftOpen,
  isLoading = false,
  totalRevenue,
  totalTransactions,
  cashInDrawer,
  qrisTotal,
  transferTotal,
}: CashierMetricsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
      {/* 1. Omset Shift */}
      <Card className="col-span-1 border-emerald-100 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/20 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all rounded-2xl overflow-hidden">
        <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] sm:text-xs text-emerald-800 font-bold truncate">
              Omset Shift
            </span>
            <div className="p-2 bg-emerald-100/80 text-emerald-700 rounded-xl shrink-0">
              <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              {formatCurrency(totalRevenue)}
            </h3>
            {isLoading ? (
              <p className="text-[10px] text-slate-400 font-medium mt-1 animate-pulse">Memuat...</p>
            ) : shiftOpen ? (
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>Shift Aktif</span>
              </div>
            ) : (
              <p className="text-[10px] text-amber-600 font-medium mt-1">Shift Inaktif</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Transaksi */}
      <Card className="col-span-1 border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-sky-50/20 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all rounded-2xl overflow-hidden">
        <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] sm:text-xs text-blue-800 font-bold truncate">
              Total Transaksi
            </span>
            <div className="p-2 bg-blue-100/80 text-blue-700 rounded-xl shrink-0">
              <Receipt className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              {totalTransactions} Struk
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              {isLoading ? "Memuat..." : shiftOpen ? "Struk diproses" : "Shift Inaktif"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Kas di Laci (Full Width on Mobile & Tablet: 2 - 1 - 2 Layout) */}
      <Card className="col-span-2 lg:col-span-1 border-amber-100 bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/20 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all rounded-2xl overflow-hidden">
        <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] sm:text-xs text-amber-900 font-bold truncate">
              Kas di Laci
            </span>
            <div className="p-2 bg-amber-100/80 text-amber-700 rounded-xl shrink-0">
              <Wallet className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              {formatCurrency(cashInDrawer)}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              {isLoading ? "Memuat..." : shiftOpen ? "Modal + Tunai" : "Shift Inaktif"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Pembayaran QRIS */}
      <Card className="col-span-1 border-violet-100 bg-gradient-to-br from-violet-50/50 via-white to-purple-50/20 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all rounded-2xl overflow-hidden">
        <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] sm:text-xs text-violet-800 font-bold truncate">
              Pembayaran QRIS
            </span>
            <div className="p-2 bg-violet-100/80 text-violet-700 rounded-xl shrink-0">
              <QrCode className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              {formatCurrency(qrisTotal)}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              {isLoading ? "Memuat..." : shiftOpen ? "Total QRIS" : "Shift Inaktif"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5. Transfer Bank */}
      <Card className="col-span-1 border-cyan-100 bg-gradient-to-br from-cyan-50/50 via-white to-sky-50/20 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all rounded-2xl overflow-hidden">
        <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] sm:text-xs text-cyan-800 font-bold truncate">
              Transfer Bank
            </span>
            <div className="p-2 bg-cyan-100/80 text-cyan-700 rounded-xl shrink-0">
              <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              {formatCurrency(transferTotal)}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              {isLoading ? "Memuat..." : shiftOpen ? "Total Transfer" : "Shift Inaktif"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Receipt,
  Users,
  ClipboardList,
  DollarSign,
  CreditCard,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Tag,
  Printer,
  ChevronRight,
  Clock,
  CheckCircle2,
  PackageCheck,
  Percent,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserMe } from "@/features/users/hooks/useUserMe";
import { useActiveShift } from "@/features/shifts/hooks/useActiveShift";
import { OpenShiftModal } from "@/features/shifts/components/OpenShiftModal";
import { CloseShiftModal } from "@/features/shifts/components/CloseShiftModal";

export function CashierDashboardView() {
  const { data } = useUserMe();
  const user = data?.data;

  // Real Active Shift API hook
  const { data: activeShift, isLoading: isShiftLoading } = useActiveShift();
  const shiftOpen = !!activeShift && (activeShift.status === "open" || activeShift.status === "ACTIVE");

  // Modals state
  const [openShiftModalOpen, setOpenShiftModalOpen] = useState(false);
  const [closeShiftModalOpen, setCloseShiftModalOpen] = useState(false);

  // Real-time clock state
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateOnly = (date: Date | null) => {
    if (!date) return "Sabtu, 29 Agustus 2026";
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatTimeOnly = (date: Date | null) => {
    if (!date) return "--:--:-- WIB";
    const timeStr = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
    return `${timeStr} WIB`;
  };

  // Dynamic shift metrics from activeShift or fallback
  const shiftMetrics = {
    shiftId: activeShift?.id ? `#SF-${activeShift.id.substring(0, 8).toUpperCase()}` : "-",
    openedAt: activeShift?.openedAt
      ? new Date(activeShift.openedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
      : "-",
    initialModal: activeShift?.openingBalance || 0,
    totalRevenue: shiftOpen ? 2450000 : 0,
    totalTransactions: shiftOpen ? 18 : 0,
    cashInDrawer: shiftOpen ? (activeShift?.openingBalance || 0) + 1800000 : 0,
    nonCashTotal: shiftOpen ? 650000 : 0,
  };

  // Mock recent transactions (only available when shift is open)
  const recentTransactions = shiftOpen
    ? [
        { id: "TRX-1092", time: "10:15 WIB", method: "Tunai", total: 150000, items: 3 },
        { id: "TRX-1091", time: "09:50 WIB", method: "QRIS", total: 85000, items: 2 },
        { id: "TRX-1090", time: "09:12 WIB", method: "Tunai", total: 42000, items: 1 },
      ]
    : [];

  // Mock low stock alerts
  const lowStockItems = [
    { name: "Beras Ramos Super 5kg", stock: 2, unit: "Sak" },
    { name: "Minyak Goreng Kita 1L", stock: 4, unit: "Pouch" },
    { name: "Gula Pasir Kristal 1kg", stock: 5, unit: "Bungkus" },
  ];

  // Mock active promos
  const activePromos = [
    { name: "Promo Minyak 2L", discount: "Diskon 5%", minPurchase: "Min. Rp 50.000" },
    { name: "Potongan Member", discount: "-Rp 2.000", minPurchase: "Khusus Member" },
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
      <OpenShiftModal
        open={openShiftModalOpen}
        onOpenChange={setOpenShiftModalOpen}
        onSuccess={() => setOpenShiftModalOpen(false)}
      />
      <CloseShiftModal
        open={closeShiftModalOpen}
        onOpenChange={setCloseShiftModalOpen}
        shiftData={activeShift || null}
      />

      {/* 1. BANNER GREETING & SHIFT STATUS */}
      <Card className="border-slate-200 shadow-sm bg-slate-900 text-white rounded-2xl">
        <CardContent className="p-4 sm:p-6 space-y-3.5">
          {/* Header Banner: Date & Time (Left stacked) vs Status Toko Badge (Right) */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            {/* Left: Date (Line 1) & Live Clock (Line 2 below date) */}
            <div className="flex flex-col font-mono">
              <span className="text-xs sm:text-sm font-semibold text-slate-200">{formatDateOnly(now)}</span>
              <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{formatTimeOnly(now)}</span>
            </div>

            {/* Right: Status Toko Badge */}
            {shiftOpen ? (
              <button
                type="button"
                onClick={() => setCloseShiftModalOpen(true)}
                title="Tutup toko & rekap shift"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide border transition-all cursor-pointer shrink-0 bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
              >
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isShiftLoading ? "MEMUAT..." : "TOKO BUKA"}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide border shrink-0 bg-amber-500/20 text-amber-300 border-amber-500/40">
                <span className="size-2 rounded-full bg-amber-400" />
                <span>{isShiftLoading ? "MEMUAT..." : "TOKO TUTUP"}</span>
              </div>
            )}
          </div>

          {/* Greeting Utama Kasir (Di bawah Header) */}
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-snug">
              Halo, {user?.name || activeShift?.cashier?.name || "Kasir"}! Selamat Bertugas
            </h1>
          </div>

          {/* Operational Data Pills / Detail Info */}
          {shiftOpen ? (
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">Shift ID</span>
                <span className="font-semibold text-slate-100">{shiftMetrics.shiftId}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">Waktu Buka</span>
                <span className="font-semibold text-slate-100">{shiftMetrics.openedAt}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">Modal Kas Awal</span>
                <span className="font-semibold text-slate-100">{formatRupiah(shiftMetrics.initialModal)}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">Printer Struk</span>
                  <span className="font-semibold text-emerald-400">Terhubung</span>
                </div>
                <Printer className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 w-full sm:w-auto">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Shift Kasir Belum Aktif. Buka toko dan isi modal kas awal sebelum memulai transaksi.</span>
              </div>
              <Button
                onClick={() => setOpenShiftModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-9 px-4 text-xs rounded-xl shrink-0 cursor-pointer w-full sm:w-auto shadow-md shadow-primary/20"
              >
                Buka Toko Sekarang
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. SHIFT METRICS STAT CARDS (2 Columns on Mobile, 4 Columns on Tablet/Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Stat 1: Total Omset Shift */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-3 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                Omset Shift
              </span>
              <div className="p-1.5 sm:p-2.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-100 shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
                {formatRupiah(shiftMetrics.totalRevenue)}
              </h3>
              {shiftOpen ? (
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% vs lalu</span>
                </div>
              ) : (
                <p className="text-[10px] sm:text-[11px] text-amber-600 font-medium mt-1">Shift Belum Aktif</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stat 2: Total Transaksi */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-3 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                Total Transaksi
              </span>
              <div className="p-1.5 sm:p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
                {shiftMetrics.totalTransactions} Transaksi
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                {shiftOpen ? "Struk diproses" : "Shift Inaktif"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: Kas di Laci */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-3 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                Kas di Laci
              </span>
              <div className="p-1.5 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
                {formatRupiah(shiftMetrics.cashInDrawer)}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                {shiftOpen ? "Modal + Tunai" : "Shift Inaktif"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4: QRIS / Non-Tunai */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-3 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                QRIS / Bank
              </span>
              <div className="p-1.5 sm:p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 shrink-0">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
                {formatRupiah(shiftMetrics.nonCashTotal)}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                {shiftOpen ? "Non-tunai" : "Shift Inaktif"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. QUICK SHORTCUTS GRID */}
      <div className="space-y-2">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          Pintasan Akses Cepat
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <Button
            asChild
            variant="outline"
            className="h-auto p-3 sm:p-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-slate-200 hover:bg-teal-50/50 hover:border-teal-300 transition-all cursor-pointer group"
          >
            <Link href="/cashier/products">
              <div className="p-2 sm:p-2.5 rounded-xl bg-teal-100/70 text-teal-700 group-hover:scale-110 transition-transform">
                <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Daftar Produk</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto p-3 sm:p-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-slate-200 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group"
          >
            <Link href="/cashier/discounts">
              <div className="p-2 sm:p-2.5 rounded-xl bg-blue-100/70 text-blue-700 group-hover:scale-110 transition-transform">
                <Percent className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Daftar Diskon</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto p-3 sm:p-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-slate-200 hover:bg-purple-50/50 hover:border-purple-300 transition-all cursor-pointer group"
          >
            <Link href="/cashier/customers">
              <div className="p-2 sm:p-2.5 rounded-xl bg-purple-100/70 text-purple-700 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Daftar Member</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto p-3 sm:p-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-slate-200 hover:bg-amber-50/50 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <Link href="/cashier/opname">
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-100/70 text-amber-700 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Stok Opname</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS (Responsive: Card List on Mobile, Table on Tablet/Desktop) */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-3.5 sm:p-5 flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-slate-800">
              Transaksi Terakhir
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-slate-500">
              Struk terbaru shift ini
            </CardDescription>
          </div>
          {shiftOpen && recentTransactions.length > 0 && (
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-bold px-2">
              <Link href="/cashier/transactions" className="flex items-center gap-1">
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </CardHeader>

        {recentTransactions.length === 0 ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-slate-50/40">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400 border border-slate-200/60">
              <Receipt className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {shiftOpen ? "Belum Ada Transaksi Shift Ini" : "Shift Kasir Belum Aktif"}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {shiftOpen
                ? "Belum ada transaksi struk yang diproses pada shift ini."
                : "Silakan buka toko dan isi modal kas awal untuk mulai melayani transaksi POS."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View: Card List (< sm) */}
            <div className="block sm:hidden divide-y divide-slate-100">
              {recentTransactions.map((trx) => (
                <div key={trx.id} className="p-3.5 space-y-2 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{trx.id}</span>
                      <Badge
                        variant="outline"
                        className={
                          trx.method === "Tunai"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0 px-1.5 font-semibold"
                            : "bg-purple-50 text-purple-700 border-purple-200 text-[10px] py-0 px-1.5 font-semibold"
                        }
                      >
                        {trx.method}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400">{trx.time}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="text-[10px] text-slate-500">{trx.items} item barang</div>
                      <div className="font-bold text-sm text-slate-900">{formatRupiah(trx.total)}</div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5 text-xs gap-1 border-slate-200 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Struk</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop View: Table (>= sm) */}
            <CardContent className="hidden sm:block p-0 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">No. Struk</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Pembayaran</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-800">{trx.id}</td>
                      <td className="px-4 py-3 text-slate-500">{trx.time}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            trx.method === "Tunai"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
                              : "bg-purple-50 text-purple-700 border-purple-200 font-semibold"
                          }
                        >
                          {trx.method}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        {formatRupiah(trx.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs gap-1.5 border-slate-200 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" />
                          <span>Cetak Struk</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </>
        )}
      </Card>

      {/* 5. LOW STOCK & PROMO ALERTS (1 column on mobile, 2 columns on tablet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Warning Stok Menipis */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl">
          <CardHeader className="p-3.5 sm:p-4 flex flex-row items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-800">
                Stok Barang Menipis
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-[11px] text-slate-500">
                Info produk sembako sisa stok sedikit
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 space-y-2">
            {lowStockItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs"
              >
                <span className="font-semibold text-slate-800 truncate pr-2">{item.name}</span>
                <Badge variant="destructive" className="bg-amber-600 hover:bg-amber-600 shrink-0 text-[10px] sm:text-xs">
                  Sisa {item.stock} {item.unit}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Promo Hari Ini */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl">
          <CardHeader className="p-3.5 sm:p-4 flex flex-row items-center gap-2 pb-2 border-b border-slate-100">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-800">
                Promo & Diskon Aktif
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-[11px] text-slate-500">
                Info promo untuk ditawarkan ke pembeli
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 space-y-2">
            {activePromos.map((promo) => (
              <div
                key={promo.name}
                className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">{promo.name}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">{promo.minPurchase}</div>
                </div>
                <Badge className="bg-emerald-600 hover:bg-emerald-600 shrink-0 text-[10px] sm:text-xs">
                  {promo.discount}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"
import Link from "next/link"
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  Package,
  Percent,
  TriangleAlert,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

type Period = "today" | "week" | "month"

type StatKey =
  | "revenue"
  | "transactions"
  | "itemsSold"
  | "activeCustomers"
  | "stockValue"
  | "margin"

interface StatEntry {
  value: string
  change: string
}

// ----------------------------------------------------------------------------
// Dummy data (nanti diganti hasil fetch TanStack Query)
// ----------------------------------------------------------------------------

const statsByPeriod: Record<Period, Record<StatKey, StatEntry>> = {
  today: {
    revenue: { value: "Rp 3.450.000", change: "+12.5% dari kemarin" },
    transactions: { value: "84 Transaksi", change: "+4 pesanan baru" },
    itemsSold: { value: "142 Item", change: "Beras Premium paling favorit" },
    activeCustomers: { value: "56 Orang", change: "Member terdaftar" },
    stockValue: { value: "Rp 48.950.000", change: "320 SKU tersimpan" },
    margin: { value: "Rp 1.240.000", change: "Margin 14.5%" },
  },
  week: {
    revenue: { value: "Rp 21.180.000", change: "+8.2% dari minggu lalu" },
    transactions: { value: "512 Transaksi", change: "+36 pesanan baru" },
    itemsSold: { value: "934 Item", change: "Beras Premium paling favorit" },
    activeCustomers: { value: "148 Orang", change: "Member terdaftar" },
    stockValue: { value: "Rp 48.950.000", change: "320 SKU tersimpan" },
    margin: { value: "Rp 7.610.000", change: "Margin 14.1%" },
  },
  month: {
    revenue: { value: "Rp 89.640.000", change: "+5.4% dari bulan lalu" },
    transactions: { value: "2.108 Transaksi", change: "+142 pesanan baru" },
    itemsSold: { value: "3.860 Item", change: "Beras Premium paling favorit" },
    activeCustomers: { value: "312 Orang", change: "Member terdaftar" },
    stockValue: { value: "Rp 48.950.000", change: "320 SKU tersimpan" },
    margin: { value: "Rp 31.920.000", change: "Margin 13.8%" },
  },
}

const statMeta: {
  key: StatKey
  title: string
  icon: typeof DollarSign
  chip: string
  accent: string
}[] = [
  { key: "revenue", title: "Total Pendapatan", icon: DollarSign, chip: "bg-teal-100 text-teal-700", accent: "text-teal-600" },
  { key: "transactions", title: "Total Transaksi", icon: ShoppingBag, chip: "bg-sky-100 text-sky-700", accent: "text-sky-600" },
  { key: "itemsSold", title: "Produk Terjual", icon: Package, chip: "bg-amber-100 text-amber-700", accent: "text-amber-600" },
  { key: "activeCustomers", title: "Pelanggan Aktif", icon: Users, chip: "bg-violet-100 text-violet-700", accent: "text-violet-600" },
  { key: "stockValue", title: "Total Nilai Stok", icon: Package, chip: "bg-orange-100 text-orange-700", accent: "text-orange-600" },
  { key: "margin", title: "Margin / Laba Kotor", icon: Percent, chip: "bg-rose-100 text-rose-700", accent: "text-rose-600" },
]

const periodLabel: Record<Period, string> = {
  today: "Hari ini",
  week: "Minggu ini",
  month: "Bulan ini",
}

// Alert margin turun (ALRT-03) + opname pending approval (STK-07)
const marginAlerts = [
  { produk: "Minyak Goreng 2L", marginSekarang: "4.2%", threshold: "8%" },
  { produk: "Gula Pasir 1kg", marginSekarang: "5.8%", threshold: "8%" },
  { produk: "Telur Ayam (kg)", marginSekarang: "6.1%", threshold: "8%" },
]

const pendingOpnameCount = 2


const recentOrders = [
  { id: "TRX-089", customer: "Budi Santoso", items: "2x Beras Premium, 1x Gula Pasir", total: "Rp 65.000", payment: "qris", status: "Selesai", time: "Baru saja" },
  { id: "TRX-088", customer: "Siti Rahma", items: "1x Minyak Goreng, 1x Telur", total: "Rp 55.000", payment: "cash", status: "Diproses", time: "5 menit lalu" },
  { id: "TRX-087", customer: "Ahmad Fauzi", items: "3x Beras Pera, 1x Kecap", total: "Rp 105.000", payment: "transfer", status: "Selesai", time: "12 menit lalu" },
  { id: "TRX-086", customer: "Dewi Lestari", items: "1x Susu UHT, 1x Kopi", total: "Rp 32.000", payment: "cash", status: "Selesai", time: "20 menit lalu" },
]

const paymentMeta: Record<string, { label: string; badge: string }> = {
  qris: { label: "QRIS", badge: "bg-purple-100 text-purple-700" },
  cash: { label: "Cash", badge: "bg-teal-100 text-teal-700" },
  transfer: { label: "Transfer", badge: "bg-yellow-100 text-yellow-700" },
}

const lowStockItems = [
  { name: "Beras Premium 5kg", remaining: "2 karung" },
  { name: "Minyak Goreng 2L", remaining: "5 pcs" },
  { name: "Gula Pasir 1kg", remaining: "8 pcs" },
  { name: "Telur Ayam (tray)", remaining: "3 tray" },
]

// ----------------------------------------------------------------------------
// Small building blocks
// ----------------------------------------------------------------------------

function PeriodToggle({
  value,
  onChange,
}: {
  value: Period
  onChange: (p: Period) => void
}) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs font-medium">
      {(Object.keys(periodLabel) as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            value === p
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {periodLabel[p]}
        </button>
      ))}
    </div>
  )
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

export function DashboardPage() {
  const [period, setPeriod] = useState<Period>("today")
  const stats = statsByPeriod[period]

  const hasAlerts = marginAlerts.length > 0 || pendingOpnameCount > 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Ringkasan performa operasional dan penjualan Toko Beras Putra Mandiri.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Sistem Kasir Online
          </span>
        </div>
      </div>

      {/* Alert Bar: margin turun (ALRT-03) + opname pending approval (STK-07) */}
      {hasAlerts && (
        <div className="flex flex-col sm:flex-row gap-3">
          {marginAlerts.length > 0 && (
            <Link
              href="/admin/reports/margin"
              className="flex-1 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 hover:bg-amber-100/70 transition-colors"
            >
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                <TriangleAlert className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900">
                  {marginAlerts.length} produk margin turun di bawah threshold
                </p>
                <p className="text-xs text-amber-700 truncate">
                  {marginAlerts.map((a) => a.produk).join(", ")}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-amber-600 ml-auto shrink-0" />
            </Link>
          )}

          {pendingOpnameCount > 0 && (
            <Link
              href="/admin/inventory/opname"
              className="flex-1 flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 hover:bg-sky-100/70 transition-colors"
            >
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-sky-900">
                  {pendingOpnameCount} opname menunggu approval
                </p>
                <p className="text-xs text-sky-700">Perlu ditinjau sebelum stok sistem ter-update</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-sky-600 ml-auto shrink-0" />
            </Link>
          )}
        </div>
      )}

      {/* Stats Grid: 3x3 layout, dengan period toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Ringkasan Penjualan</h2>
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>

        {/* Baris 1: aktivitas penjualan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statMeta.slice(0, 3).map(({ key, title, icon: Icon, chip, accent }) => (
            <Card key={key} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
                <div className={`p-2.5 rounded-xl flex items-center justify-center ${chip}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats[key].value}</div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className={`w-3.5 h-3.5 ${accent}`} />
                  <span className={`${accent} font-medium`}>{stats[key].change}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Baris 2: posisi/kondisi toko */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statMeta.slice(3, 6).map(({ key, title, icon: Icon, chip, accent }) => (
            <Card key={key} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
                <div className={`p-2.5 rounded-xl flex items-center justify-center ${chip}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stats[key].value}</div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className={`w-3.5 h-3.5 ${accent}`} />
                  <span className={`${accent} font-medium`}>{stats[key].change}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Middle Row: Recent Transactions & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Transaksi Terbaru</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Daftar transaksi kasir yang masuk secara real-time.</p>
            </div>
            <Link href="/admin/transactions" className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ID Transaksi</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Metode</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-800">{order.id}</td>
                      <td className="py-3 px-4 text-slate-700">{order.customer}</td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">{order.items}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{order.total}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentMeta[order.payment]?.badge}`}>
                          {paymentMeta[order.payment]?.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Selesai'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <TriangleAlert className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-900">Stok Menipis</CardTitle>
            </div>
            <Link href="/cashier/inventory/ingredient-stock" className="text-xs font-medium text-teal-600 hover:text-teal-700">
              Kelola
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-slate-100">
              {lowStockItems.map((item, idx) => (
                <li key={idx} className="py-2.5 flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-700 truncate">{item.name}</span>
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                    {item.remaining}
                  </span>
                </li>
              ))}
            </ul>
            {/* Catatan: card "Mendekati Kedaluwarsa" sengaja dilepas dari dashboard ini.
                Entity Produk di PRD (section 5) belum punya field tanggal kedaluwarsa,
                jadi datanya belum ada basisnya. Tambahkan lagi kalau field expiry
                sudah masuk data model. */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
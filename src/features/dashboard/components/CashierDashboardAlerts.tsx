"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
import type { LowStockItem, ActivePromo } from "../types/dashboard";

interface CashierDashboardAlertsProps {
  lowStockItems: LowStockItem[];
  activePromos: ActivePromo[];
}

export function CashierDashboardAlerts({
  lowStockItems,
  activePromos,
}: CashierDashboardAlertsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {/* Warning Stok Menipis */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl">
        <CardHeader className="p-3.5 sm:p-4 flex flex-row items-center gap-2 pb-2 border-b border-slate-100">
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
          {lowStockItems.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center italic">
              Semua stok produk aman & mencukupi
            </p>
          ) : (
            lowStockItems.map((item, idx) => (
              <div
                key={item.id || item.name || idx}
                className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs"
              >
                <span className="font-semibold text-slate-800 truncate pr-2">{item.name}</span>
                <Badge
                  variant="destructive"
                  className="bg-amber-600 hover:bg-amber-600 shrink-0 text-[10px] sm:text-xs"
                >
                  Sisa {item.stock} {item.unit}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Promo Hari Ini */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl">
        <CardHeader className="p-3.5 sm:p-4 flex flex-row items-center gap-2 pb-2 border-b border-slate-100">
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-800">
              Promo & Diskon Aktif
            </CardTitle>
            <CardDescription className="text-[10px] sm:text-[11px] text-slate-500">
              Info promo untuk ditawarkan ke pelanggan
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-2">
          {activePromos.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center italic">
              Belum ada promo aktif saat ini
            </p>
          ) : (
            activePromos.map((promo) => (
              <div
                key={promo.id || promo.name}
                className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">{promo.name}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    {promo.minPurchase ? `Min. ${formatCurrency(promo.minPurchase)}` : "Tanpa minimal"}
                  </div>
                </div>
                <Badge className="bg-emerald-600 hover:bg-emerald-600 shrink-0 text-[10px] sm:text-xs">
                  {promo.discountType === "percent"
                    ? `Diskon ${promo.discountValue}%`
                    : `Potongan ${formatCurrency(promo.discountValue)}`}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

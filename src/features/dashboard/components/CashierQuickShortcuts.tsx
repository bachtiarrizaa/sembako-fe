"use client";

import Link from "next/link";
import { PackageCheck, Percent, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CashierQuickShortcuts() {
  return (
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
            <span className="text-xs font-bold text-slate-800">Daftar Pelanggan</span>
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
  );
}

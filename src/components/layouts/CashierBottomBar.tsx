"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  Bell,
  Grid,
} from "lucide-react";
import { CashierMenuSheet } from "./CashierMenuSheet";

export function CashierBottomBar() {
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const pathname = usePathname();

  const isPathActive = (path: string) => {
    if (path === "#") return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navItems = [
    {
      label: "Beranda",
      href: "/cashier/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Riwayat",
      href: "/cashier/history",
      icon: Receipt,
    },
    {
      label: "Transaksi",
      href: "/cashier/transactions",
      icon: ShoppingCart,
    },
    {
      label: "Notifikasi",
      href: "/cashier/notifications",
      icon: Bell,
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 sm:px-6">
        <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-around h-16 relative">
          {/* Item 1: Beranda */}
          {(() => {
            const item = navItems[0];
            const active = isPathActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer min-h-[48px] ${
                  active
                    ? "text-primary font-bold scale-105"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[11px] mt-1 leading-tight tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })()}

          {/* Item 2: Riwayat */}
          {(() => {
            const item = navItems[1];
            const active = isPathActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer min-h-[48px] ${
                  active
                    ? "text-primary font-bold scale-105"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[11px] mt-1 leading-tight tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })()}

          {/* Item 3 (CENTER FAB): Transaksi */}
          {(() => {
            const item = navItems[2];
            const active = isPathActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 cursor-pointer group -mt-5"
              >
                <div
                  className={`size-13 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-primary/40"
                      : "bg-primary text-primary-foreground hover:scale-105 shadow-primary/25"
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span
                  className={`text-[11px] mt-1 font-bold tracking-tight transition-colors ${
                    active ? "text-primary" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })()}

          {/* Item 4: Notifikasi */}
          {(() => {
            const item = navItems[3];
            const active = isPathActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer min-h-[48px] ${
                  active
                    ? "text-primary font-bold scale-105"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[11px] mt-1 leading-tight tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })()}

          {/* Item 5: Menu Lainnya (Triggers Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setShowMenuSheet(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer min-h-[48px] ${
              showMenuSheet
                ? "text-primary font-bold scale-105"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Grid className={`w-5 h-5 ${showMenuSheet ? "stroke-[2.5]" : "stroke-2"}`} />
            <span className="text-[11px] mt-1 leading-tight tracking-tight">
              Lainnya
            </span>
          </button>
        </div>
      </nav>

      {/* Menu Sheet Modal */}
      <CashierMenuSheet
        open={showMenuSheet}
        onClose={() => setShowMenuSheet(false)}
      />
    </>
  );
}

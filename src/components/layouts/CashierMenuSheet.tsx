"use client";

import Link from "next/link";
import {
  X,
  ClipboardList,
  PackageCheck,
  Percent,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";

interface CashierMenuSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CashierMenuSheet({ open, onClose }: CashierMenuSheetProps) {
  if (!open) return null;

  const menuItems = [
    {
      title: "Daftar Pelanggan",
      description: "Kelola & cari data pelanggan",
      icon: Users,
      href: "/cashier/customers",
      color: "bg-teal-50 text-teal-600 border-teal-200",
    },
    {
      title: "Stok Opname",
      description: "Opname & rekonsiliasi stok fisik",
      icon: ClipboardList,
      href: "/cashier/opname",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Daftar Produk",
      description: "Katalog & stok produk kasir",
      icon: PackageCheck,
      href: "/cashier/products",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Promo & Diskon",
      description: "Lihat daftar diskon aktif",
      icon: Percent,
      href: "/cashier/discounts",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      title: "Tutup toko & rekap shift",
      description: "Laporan kasir & penutupan shift",
      icon: Clock,
      href: "/cashier/shifts",
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet Modal */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl z-50 p-5 border-t border-slate-200 animate-in slide-in-from-bottom duration-250 flex flex-col max-h-[85vh]">
        {/* Header Sheet */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Menu Lainnya</h3>
            <p className="text-xs text-slate-500">Akses cepat fitur pendukung kasir</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Grid / List */}
        <div className="py-4 space-y-2 overflow-y-auto max-h-[60vh]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl border ${item.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800 group-hover:text-primary transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

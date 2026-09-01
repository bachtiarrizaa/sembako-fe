"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, Users, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PosProduct, ProductUnit } from "./PosProductCatalog";

export interface CartItem {
  id: string; // `${product.id}_${unit.id}`
  product: PosProduct;
  unit: ProductUnit;
  qty: number;
}

interface PosCartMatrixProps {
  items: CartItem[];
  onUpdateQty: (cartItemId: string, qty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onCheckout: (subtotal: number, discount: number, total: number, customerName?: string) => void;
}

export function PosCartMatrix({
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: PosCartMatrixProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>("Bpk. Ahmad (Member Gold)");

  const grandTotal = items.reduce((acc, item) => acc + item.unit.price * item.qty, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header Cart */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Keranjang Belanja</h3>
            <p className="text-[11px] text-slate-500">{items.length} jenis item</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[45vh] sm:max-h-[50vh]">
        {items.length === 0 ? (
          <div className="flex items-center justify-center p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 gap-2 text-slate-400 min-h-[56px]">
            <ShoppingCart className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-medium text-slate-500">Keranjang masih kosong</span>
          </div>
        ) : (
          items.map((item) => {
            const itemSubtotal = item.unit.price * item.qty;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-xs text-slate-800 truncate">
                      {item.product.name}
                    </h5>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 font-bold bg-white text-primary border-primary/30 shrink-0">
                      {item.unit.name}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{formatRupiah(item.unit.price)} / {item.unit.name}</span>
                    <span className="font-bold text-slate-700">({formatRupiah(itemSubtotal)})</span>
                  </div>
                </div>

                {/* Quantity Controls dengan Direct Input Desimal */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const nextQty = Math.max(0, Math.round((item.qty - 1) * 100) / 100);
                      onUpdateQty(item.id, nextQty);
                    }}
                    className="size-7 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  {/* Direct Decimal Input Field */}
                  <input
                    type="number"
                    step={item.unit.allowDecimal ? "any" : "1"}
                    min="0.1"
                    value={item.qty || ""}
                    onChange={(e) => {
                      const parsed = parseFloat(e.target.value);
                      if (isNaN(parsed)) {
                        onUpdateQty(item.id, 0);
                        return;
                      }
                      const val = item.unit.allowDecimal
                        ? parsed
                        : Math.floor(parsed);
                      onUpdateQty(item.id, val);
                    }}
                    className="w-14 h-7 text-center font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded-lg p-0 focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const nextQty = Math.round((item.qty + 1) * 100) / 100;
                      onUpdateQty(item.id, nextQty);
                    }}
                    className="size-7 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="size-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 cursor-pointer ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Member Widget */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-xs">
        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="truncate max-w-[160px]">
              {selectedCustomer || "Umum (Non-Member)"}
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setSelectedCustomer(
                selectedCustomer ? null : "Bpk. Ahmad (Member Gold)"
              )
            }
            className="text-[11px] text-primary font-bold hover:underline cursor-pointer"
          >
            {selectedCustomer ? "Ubah" : "+ Member"}
          </button>
        </div>
      </div>

      {/* Cart Summary Breakdown & Checkout Button */}
      <div className="p-4 bg-white border-t border-slate-200 text-slate-900 space-y-3">
        <div className="flex justify-between items-center text-sm font-bold text-slate-800">
          <span>Total Pembayaran</span>
          <span className="text-primary text-lg font-bold">{formatRupiah(grandTotal)}</span>
        </div>

        <Button
          disabled={items.length === 0}
          onClick={() =>
            onCheckout(grandTotal, 0, grandTotal, selectedCustomer || undefined)
          }
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-md shadow-primary/20 text-sm cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            <span>PROSES BAYAR ({formatRupiah(grandTotal)})</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Button>
      </div>
    </div>
  );
}

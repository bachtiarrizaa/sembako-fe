"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useLoyaltySettings } from "@/features/loyalty/hooks/useLoyaltySettings";
import { CustomerFormDialog } from "@/features/customers/components/CustomerFormDialog";
import type { CustomerResponse } from "@/features/customers/types/customer";
import type { CartItem, PosProduct, ProductUnit } from "../../types/pos";

export type { CartItem, PosProduct, ProductUnit };

interface PosCartMatrixProps {
  items: CartItem[];
  onUpdateQty: (cartItemId: string, qty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onCheckout: (subtotal: number, discount: number, total: number, customerName?: string, customerId?: string, usePoints?: boolean) => void;
  isMobile?: boolean;
}

const WALKIN_CUSTOMER: CustomerResponse = {
  id: "WALKIN",
  name: "Pelanggan Umum",
  phoneNumber: "",
  address: "",
  isActive: true,
  createdAt: "",
  updatedAt: "",
};

export function PosCartMatrix({
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isMobile = false,
}: PosCartMatrixProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("WALKIN");
  const [usePoints, setUsePoints] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [createCustomerOpen, setCreateCustomerOpen] = useState<boolean>(false);

  // Real API Customers query
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    page: 1,
    limit: 100,
  });

  // Real Loyalty Settings query from GET /api/loyalty-settings
  const { data: loyaltySettings } = useLoyaltySettings();
  const redemptionRate = loyaltySettings?.redemptionRate ?? 100;
  const minimumRedeem = loyaltySettings?.minimumRedeem ?? 0;

  const customerItems: CustomerResponse[] = [
    WALKIN_CUSTOMER,
    ...(customersData?.items || []),
  ];

  const selectedCustomerObj = customerItems.find((c) => c.id === selectedCustomerId) || WALKIN_CUSTOMER;

  const grandTotal = items.reduce((acc, item) => acc + item.unit.price * item.qty, 0);

  // Real customer points calculation using redemptionRate & minimumRedeem from BE
  const availableCustomerPoints = selectedCustomerObj.id !== "WALKIN" ? (selectedCustomerObj.totalPoints ?? 0) : 0;
  const pointsDiscountValue = availableCustomerPoints * redemptionRate;
  const canRedeemPoints = availableCustomerPoints >= minimumRedeem;
  const pointsDiscount = usePoints && selectedCustomerObj.id !== "WALKIN" && canRedeemPoints
    ? Math.min(grandTotal, pointsDiscountValue)
    : 0;

  const finalTotal = Math.max(0, grandTotal - pointsDiscount);

  return (
    <div className={isMobile ? "bg-white flex flex-col overflow-hidden h-full" : "bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden h-full"}>
      {/* Header Bar inside Content Body */}
      <div className={`py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0 ${isMobile ? "px-6" : "px-3.5"}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 text-primary rounded-xl">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-800">Ringkasan Item</h3>
            <p className="text-[10px] text-slate-500">{items.length} jenis item</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-[11px] text-red-500 hover:text-red-700 font-semibold cursor-pointer"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Cart Items List (Middle Scrollable Area) */}
      <div className={`flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0 flex flex-col ${items.length === 0 ? "justify-center" : "justify-start"}`}>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 text-center space-y-2 my-auto w-full">
            <div className="size-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-700">Keranjang Masih Kosong</p>
              <p className="text-[11px] text-slate-400">Klik atau scan produk di katalog untuk ditambahkan</p>
            </div>
          </div>
        ) : (
          items.map((item) => {
            const itemSubtotal = item.unit.price * item.qty;
            return (
              <div
                key={item.id}
                className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1.5 transition-all hover:bg-slate-50"
              >
                {/* Row 1: Product Title & Unit Price (Left) & Trash (Right) */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-xs text-slate-800 line-clamp-1">
                      {item.product.name}
                    </h5>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      {formatCurrency(item.unit.price)} / {item.unit.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="size-6.5 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 cursor-pointer shrink-0 transition-colors"
                    title="Hapus Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Row 2: Subtotal Amount (Left) & Quantity Controls (Right) */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-primary block truncate">
                      {formatCurrency(itemSubtotal)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const nextQty = Math.max(0, Math.round((item.qty - 1) * 100) / 100);
                        onUpdateQty(item.id, nextQty);
                      }}
                      className="size-6.5 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 cursor-pointer active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <input
                      type="number"
                      step={item.unit.allowDecimal ? "any" : "1"}
                      min="0.1"
                      value={inputValues[item.id] !== undefined ? inputValues[item.id] : item.qty}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setInputValues((prev) => ({ ...prev, [item.id]: raw }));

                        const parsed = parseFloat(raw);
                        if (!isNaN(parsed) && parsed > 0) {
                          const val = item.unit.allowDecimal
                            ? Math.round(parsed * 100) / 100
                            : Math.floor(parsed);
                          onUpdateQty(item.id, val);
                        }
                      }}
                      onBlur={() => {
                        const currentRaw = inputValues[item.id];
                        if (currentRaw !== undefined) {
                          const parsed = parseFloat(currentRaw);
                          if (isNaN(parsed) || parsed <= 0) {
                            onUpdateQty(item.id, 1);
                          }
                          setInputValues((prev) => {
                            const next = { ...prev };
                            delete next[item.id];
                            return next;
                          });
                        }
                      }}
                      className="w-12 h-6.5 text-center font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded-lg p-0 focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const nextQty = Math.round((item.qty + 1) * 100) / 100;
                        onUpdateQty(item.id, nextQty);
                      }}
                      className="size-6.5 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Member / Customer Selection Widget & Summary Breakdown */}
      <div className={`py-3 border-t border-slate-100 bg-slate-50/40 space-y-2 text-xs shrink-0 ${isMobile ? "px-6" : "px-3"}`}>
        {/* Top Row: Switch Point (Left) | + Tambah Pelanggan (Right) */}
        <div className="flex items-center justify-between gap-2 min-h-[20px]">
          <div>
            {selectedCustomerObj.id !== "WALKIN" ? (
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-amber-900 bg-amber-50/80 border border-amber-200/80 px-2 py-0.5 rounded-lg transition-all hover:bg-amber-100">
                <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-bold truncate">
                  Total Poin: {availableCustomerPoints.toLocaleString("id-ID")}
                </span>
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={(e) => setUsePoints(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-6 h-3.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-amber-600 relative shrink-0" />
              </label>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setCreateCustomerOpen(true)}
            className="text-[11px] text-primary font-bold hover:underline cursor-pointer shrink-0"
          >
            + Tambah Pelanggan
          </button>
        </div>

        {/* Bottom Row: Pelanggan / Member (Left) | ComboboxSelect (Right) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 shrink-0">
            Pelanggan / Member
          </span>
          <div className="flex-1 min-w-0">
            <ComboboxSelect<CustomerResponse>
              items={customerItems}
              value={selectedCustomerId}
              onChange={(id) => {
                setSelectedCustomerId(id || "WALKIN");
                if (id === "WALKIN") setUsePoints(false);
              }}
              getOptionValue={(c) => c.id}
              getOptionLabel={(c) => c.name}
              placeholder="Pilih Pelanggan..."
              searchPlaceholder="Cari nama pelanggan..."
              emptyText="Pelanggan tidak ditemukan."
              isLoading={isCustomersLoading}
              className="w-full bg-white h-8 rounded-lg border-slate-200 text-xs [&_input]:text-xs [&_input]:font-medium font-medium"
            />
          </div>
        </div>
        {/* Summary Breakdown (Inside Body Section) */}
        <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
          {pointsDiscount > 0 && (
            <div className="flex justify-between items-center text-[11px] text-amber-700 font-semibold">
              <span>Diskon Poin ({availableCustomerPoints} Poin)</span>
              <span>-{formatCurrency(pointsDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Total Pembayaran</span>
            <span className="text-primary text-base font-bold">{formatCurrency(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Clean Footer: Action Button Only */}
      <div className={`border-t border-border shrink-0 bg-white ${isMobile ? "px-6 py-4" : "px-3.5 py-3"}`}>
        <Button
          disabled={items.length === 0}
          onClick={() =>
            onCheckout(
              grandTotal,
              pointsDiscount,
              finalTotal,
              selectedCustomerObj.id === "WALKIN" ? undefined : selectedCustomerObj.name,
              selectedCustomerObj.id === "WALKIN" ? undefined : selectedCustomerObj.id,
              usePoints
            )
          }
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-xl shadow-md shadow-primary/20 text-xs cursor-pointer disabled:opacity-50 tracking-wide"
        >
          Proses Bayar
        </Button>
      </div>

      {/* Modal Quick Create Customer */}
      <CustomerFormDialog
        open={createCustomerOpen}
        onOpenChange={setCreateCustomerOpen}
      />
    </div>
  );
}

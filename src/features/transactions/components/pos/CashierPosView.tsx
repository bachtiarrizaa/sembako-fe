"use client";

import { useEffect, useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format";
import { PosProductCatalog } from "./PosProductCatalog";
import { PosCartMatrix } from "./PosCartMatrix";
import { OpenShiftModal } from "@/features/shifts/components/OpenShiftModal";
import { PosPaymentModal } from "./PosPaymentModal";
import { PosReceiptModal } from "./PosReceiptModal";
import { useActiveShift, ShiftStatus } from "@/features/shifts";
import { useCreateTransaction } from "@/features/transactions/hooks";
import type { CreateTransactionRequest } from "@/features/transactions/schemas/transaction.schema";
import type { CartItem, PosProduct, ProductUnit } from "../../types/pos";

export function CashierPosView() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { data: activeShift, isLoading: isShiftLoading } = useActiveShift();
  const shiftOpen = !!activeShift && activeShift.status === ShiftStatus.OPEN;
  const [openShiftModal, setOpenShiftModal] = useState<boolean>(false);
  const createTransactionMutation = useCreateTransaction();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Mobile cart dialog state
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);

  // Payment checkout state
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [checkoutSummary, setCheckoutSummary] = useState<{
    subtotal: number;
    discount: number;
    total: number;
    customerName?: string;
    customerId?: string;
    usePoints?: boolean;
  }>({ subtotal: 0, discount: 0, total: 0 });

  // Receipt modal state
  const [receiptModalOpen, setReceiptModalOpen] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<{
    items: CartItem[];
    subtotal: number;
    discount: number;
    totalAmount: number;
    paymentMethod: string;
    paidAmount: number;
    change: number;
    customerName?: string;
    receiptNumber?: string;
    createdAt?: string;
  }>({
    items: [],
    subtotal: 0,
    discount: 0,
    totalAmount: 0,
    paymentMethod: "",
    paidAmount: 0,
    change: 0,
  });

  // Handler: Add to cart
  const handleAddToCart = (product: PosProduct, unit: ProductUnit) => {
    if (!shiftOpen) {
      setOpenShiftModal(true);
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.unit.id === unit.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const nextQty = Math.round((next[existingIndex].qty + 1) * 100) / 100;
        next[existingIndex] = { ...next[existingIndex], qty: nextQty };
        return next;
      }

      return [
        ...prev,
        {
          id: `${product.id}-${unit.id}-${Date.now()}`,
          product,
          unit,
          qty: 1,
        },
      ];
    });
  };

  // Handler: Decrease quantity from catalog card
  const handleDecreaseFromCart = (product: PosProduct, unit: ProductUnit) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.unit.id === unit.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const nextQty = Math.round((next[existingIndex].qty - 1) * 100) / 100;
        if (nextQty <= 0) {
          return prev.filter((_, idx) => idx !== existingIndex);
        }
        next[existingIndex] = { ...next[existingIndex], qty: nextQty };
        return next;
      }

      return prev;
    });
  };

  // Handler: Update quantity
  const handleUpdateQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, qty } : item))
    );
  };

  // Handler: Remove item
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Handler: Clear cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handler: Reset cart for new transaction
  const handleNewTransaction = () => {
    setCartItems([]);
  };

  // Handler: Start checkout
  const handleCheckout = (
    subtotal: number,
    discount: number,
    total: number,
    customerName?: string,
    customerId?: string,
    usePoints?: boolean
  ) => {
    setCheckoutSummary({ subtotal, discount, total, customerName, customerId, usePoints });
    setMobileCartOpen(false);
    setPaymentModalOpen(true);
  };

  // Handler: Payment completed -> Hit POST /api/transactions
  const handlePaymentSuccess = (
    method: "cash" | "qris" | "transfer",
    paidAmount: number,
    change: number
  ) => {
    const payload: CreateTransactionRequest = {
      customerId: checkoutSummary.customerId,
      paymentMethod: method,
      cashReceived: method === "cash" ? paidAmount : undefined,
      usePoints: checkoutSummary.usePoints,
      items: cartItems.map((item) => ({
        productUnitId: item.unit.id,
        qty: item.qty,
      })),
    };

    createTransactionMutation.mutate(payload, {
      onSuccess: (res) => {
        const transaction = res.data;
        const methodLabel =
          method === "cash"
            ? "Tunai"
            : method === "transfer"
            ? "Transfer Bank"
            : "QRIS";

        setReceiptData({
          items: [...cartItems],
          subtotal: checkoutSummary.subtotal,
          discount: checkoutSummary.discount,
          totalAmount: checkoutSummary.total,
          paymentMethod: methodLabel,
          paidAmount,
          change,
          customerName: checkoutSummary.customerName,
          receiptNumber: transaction?.receiptNumber,
          createdAt: transaction?.createdAt,
        });
        setPaymentModalOpen(false);
        setReceiptModalOpen(true);
      },
    });
  };

  // Calculate cart counts per product for catalog badge
  const cartItemCounts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.product.id] = (acc[item.product.id] || 0) + item.qty;
    return acc;
  }, {});

  const totalCartCount = cartItems.length;
  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + item.unit.price * item.qty,
    0
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-3 max-w-[1600px] w-full mx-auto h-full flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Shift Warning Alert (If Shift Closed & Done Loading) */}
      {!isShiftLoading && !shiftOpen && (
        <div className="p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2.5 text-amber-800 dark:text-amber-300 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold leading-tight truncate sm:whitespace-normal">
              <span className="hidden sm:inline">Shift kasir belum dibuka. Buka shift untuk mulai transaksi.</span>
              <span className="sm:hidden">Shift kasir belum dibuka.</span>
            </span>
          </div>
          <Button
            onClick={() => setOpenShiftModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-7 sm:h-8 px-3 text-xs rounded-lg sm:rounded-xl shrink-0 cursor-pointer"
          >
            Buka Shift
          </Button>
        </div>
      )}

      {/* Main Grid: Catalog (Left) & Cart Matrix (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 flex-1 min-h-0 items-stretch">
        {/* Left Column: Product Catalog (7 Cols on tablet, 8 Cols on desktop) */}
        <div className="md:col-span-7 xl:col-span-8 h-full min-h-0 flex flex-col">
          <PosProductCatalog
            onAddToCart={handleAddToCart}
            onDecreaseFromCart={handleDecreaseFromCart}
            cartItemCounts={cartItemCounts}
          />
        </div>

        {/* Right Column: Order Cart Matrix (5 Cols on tablet, 4 Cols on desktop) */}
        <div className="hidden md:block md:col-span-5 xl:col-span-4 h-full min-h-0 flex flex-col">
          <PosCartMatrix
            items={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Mobile Floating Cart Action Bar (Visible only on small screens < md) */}
      {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-17 left-3 right-3 z-40">
          <Button
            onClick={() => setMobileCartOpen(true)}
            className="w-full bg-white/95 backdrop-blur-md text-slate-900 hover:bg-slate-50 h-14 rounded-2xl shadow-2xl p-3.5 flex items-center justify-between cursor-pointer border border-slate-200/80 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {totalCartCount}
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block">Total Belanja</span>
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(totalCartPrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl">
              <span>Keranjang</span>
            </div>
          </Button>
        </div>
      )}

      {/* Mobile Cart Dialog Overlay */}
      <Dialog open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
        <DialogContent className="gap-0 p-0 w-[95vw] sm:max-w-lg sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden">
          <button type="button" className="sr-only" />
          <DialogHeader className="border-b border-border px-6 py-4 shrink-0 text-left">
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
              Keranjang Belanja
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
            <PosCartMatrix
              items={cartItems}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
              isMobile
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 1: Open Shift */}
      <OpenShiftModal
        open={openShiftModal}
        onOpenChange={setOpenShiftModal}
        onSuccess={() => setOpenShiftModal(false)}
      />

      {/* Modal 2: Payment Checkout */}
      <PosPaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        totalAmount={checkoutSummary.total}
        customerName={checkoutSummary.customerName}
        customerId={checkoutSummary.customerId}
        isPending={createTransactionMutation.isPending}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Modal 3: Receipt Thermal Preview */}
      <PosReceiptModal
        open={receiptModalOpen}
        onOpenChange={setReceiptModalOpen}
        items={receiptData.items}
        subtotal={receiptData.subtotal}
        discount={receiptData.discount}
        totalAmount={receiptData.totalAmount}
        paymentMethod={receiptData.paymentMethod}
        paidAmount={receiptData.paidAmount}
        change={receiptData.change}
        customerName={receiptData.customerName}
        receiptNumber={receiptData.receiptNumber}
        createdAt={receiptData.createdAt}
        onNewTransaction={handleNewTransaction}
      />
    </div>
  );
}

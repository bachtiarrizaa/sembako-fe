"use client";

import { useState } from "react";
import { ShoppingCart, Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PosProductCatalog, PosProduct, ProductUnit } from "./PosProductCatalog";
import { PosCartMatrix, CartItem } from "./PosCartMatrix";
import { OpenShiftModal } from "./OpenShiftModal";
import { PosPaymentModal } from "./PosPaymentModal";
import { PosReceiptModal } from "./PosReceiptModal";

import { useActiveShift } from "@/features/shifts/hooks/useActiveShift";

export function CashierPosView() {
  const { data: activeShift } = useActiveShift();
  const shiftOpen = !!activeShift && (activeShift.status === "open" || activeShift.status === "ACTIVE");
  const [openShiftModal, setOpenShiftModal] = useState<boolean>(false);

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
  }>({
    items: [],
    subtotal: 0,
    discount: 0,
    totalAmount: 0,
    paymentMethod: "Tunai",
    paidAmount: 0,
    change: 0,
  });

  // Handler: Add to cart
  const handleAddToCart = (product: PosProduct, unit: ProductUnit) => {
    if (!shiftOpen) {
      setOpenShiftModal(true);
      return;
    }

    const cartItemId = `${product.id}_${unit.id}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, qty: Math.round((item.qty + 1) * 100) / 100 }
            : item
        );
      }
      return [...prev, { id: cartItemId, product, unit, qty: 1 }];
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

  // Handler: Start checkout
  const handleCheckout = (
    subtotal: number,
    discount: number,
    total: number,
    customerName?: string
  ) => {
    setCheckoutSummary({ subtotal, discount, total, customerName });
    setMobileCartOpen(false);
    setPaymentModalOpen(true);
  };

  // Handler: Payment completed
  const handlePaymentSuccess = (
    method: string,
    paidAmount: number,
    change: number
  ) => {
    setReceiptData({
      items: [...cartItems],
      subtotal: checkoutSummary.subtotal,
      discount: checkoutSummary.discount,
      totalAmount: checkoutSummary.total,
      paymentMethod: method,
      paidAmount,
      change,
      customerName: checkoutSummary.customerName,
    });
    setReceiptModalOpen(true);
  };

  // Handler: Reset for new transaction
  const handleNewTransaction = () => {
    setCartItems([]);
  };

  // Calculate cart counts per product for catalog badge
  const cartItemCounts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.product.id] = (acc[item.product.id] || 0) + item.qty;
    return acc;
  }, {});

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + item.unit.price * item.qty,
    0
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="h-full flex flex-col space-y-4 relative">
      {/* Top Banner Alert if Shift is Inactive */}
      {!shiftOpen && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Toko Belum Dibuka:</strong> Anda harus membuka shift dan mengisi modal kas awal sebelum memulai transaksi POS.
            </span>
          </div>
          <Button
            onClick={() => setOpenShiftModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-8 text-xs rounded-xl shrink-0 cursor-pointer"
          >
            Buka Toko Sekarang
          </Button>
        </div>
      )}

      {/* Main Grid: Catalog (Left) & Cart Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
        {/* Left Column: Product Catalog (7 Cols on desktop) */}
        <div className="lg:col-span-7 h-full">
          <PosProductCatalog
            onAddToCart={handleAddToCart}
            cartItemCounts={cartItemCounts}
          />
        </div>

        {/* Right Column: Order Cart Matrix (5 Cols on desktop, hidden on mobile in favor of floating bar) */}
        <div className="hidden lg:block lg:col-span-5 h-full sticky top-20">
          <PosCartMatrix
            items={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Mobile Floating Cart Action Bar (Visible only on small screens < lg) */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-22 left-3 right-3 z-40">
          <Button
            onClick={() => setMobileCartOpen(true)}
            className="w-full bg-white text-slate-900 hover:bg-slate-50 h-14 rounded-2xl shadow-xl p-4 flex items-center justify-between cursor-pointer border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                {totalCartCount}
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block">Total Belanja</span>
                <span className="text-sm font-bold text-primary">
                  {formatRupiah(totalCartPrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span>Lihat Keranjang</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </Button>
        </div>
      )}

      {/* Mobile Cart Dialog Overlay */}
      <Dialog open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-4 max-h-[85vh] flex flex-col">
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-base font-bold text-slate-900">
              Keranjang Belanja POS
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <PosCartMatrix
              items={cartItems}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
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
        onNewTransaction={handleNewTransaction}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { formatTransactionDate } from "@/utils/format";
import { useUserMe } from "@/features/users/hooks/useUserMe";
import { useActiveShift } from "@/features/shifts/hooks/useActiveShift";
import { useCashierDashboard } from "@/features/dashboard/hooks/useCashierDashboard";

import { CashierBanner } from "./CashierBanner";
import { CashierMetricsGrid } from "./CashierMetricsGrid";
import { CashierQuickShortcuts } from "./CashierQuickShortcuts";
import { CashierRecentTransactionsTable } from "./CashierRecentTransactionsTable";
import { CashierDashboardAlerts } from "./CashierDashboardAlerts";

import { OpenShiftModal } from "@/features/shifts/components/OpenShiftModal";
import { CloseShiftModal } from "@/features/shifts/components/CloseShiftModal";
import { TransactionDetailDialog } from "@/features/transactions/components/TransactionDetailDialog";

export function CashierDashboardPage() {
  const { data: userData } = useUserMe();
  const user = userData?.data;

  // Active Shift & Dashboard API hooks
  const { data: activeShift, isLoading: isShiftLoading } = useActiveShift();
  const { data: dashboardData, isLoading: isDashboardLoading } = useCashierDashboard();

  const isLoading = isShiftLoading || isDashboardLoading;

  const shiftOpen =
    dashboardData?.shiftOpen ??
    (!!activeShift && (activeShift.status === "open" || activeShift.status === "ACTIVE"));

  // Modals state
  const [openShiftModalOpen, setOpenShiftModalOpen] = useState(false);
  const [closeShiftModalOpen, setCloseShiftModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Real-time clock state
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(new Date()));
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
    };
  }, []);

  // Shift & Metrics calculations from dashboard API or fallbacks
  const activeShiftObj = dashboardData?.activeShift;
  const metricsObj = dashboardData?.shiftMetrics;

  const shiftIdDisplay = activeShiftObj?.shiftId
    ? `#SF-${activeShiftObj.shiftId.substring(0, 8).toUpperCase()}`
    : activeShift?.id
    ? `#SF-${activeShift.id.substring(0, 8).toUpperCase()}`
    : "-";

  const openedAtDisplay = activeShiftObj?.openedAt
    ? formatTransactionDate(activeShiftObj.openedAt)
    : activeShift?.openedAt
    ? formatTransactionDate(activeShift.openedAt)
    : "-";

  const openingBalance = activeShiftObj?.openingBalance ?? activeShift?.openingBalance ?? 0;

  const totalRevenue = metricsObj?.totalRevenue ?? 0;
  const totalTransactions = metricsObj?.totalTransactions ?? 0;
  const cashInDrawer = metricsObj?.cashInDrawer ?? openingBalance;

  const recentTransactions = dashboardData?.recentTransactions || [];
  const lowStockItems = dashboardData?.lowStockItems || [];
  const activePromos = dashboardData?.activePromos || [];

  const qrisTotal =
    metricsObj?.qrisTotal ??
    recentTransactions
      .filter((t) => t.paymentMethod === "qris" && t.status === "completed")
      .reduce((sum, t) => sum + t.total, 0);

  const transferTotal =
    metricsObj?.transferTotal ??
    recentTransactions
      .filter((t) => t.paymentMethod === "transfer" && t.status === "completed")
      .reduce((sum, t) => sum + t.total, 0);

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactionId(id);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
      {/* 1. Header Banner & Shift Status */}
      <CashierBanner
        userName={user?.name}
        cashierName={activeShiftObj?.cashierName}
        shiftOpen={shiftOpen}
        isShiftLoading={isLoading}
        now={now}
        shiftId={shiftIdDisplay}
        openedAt={openedAtDisplay}
        initialModal={openingBalance}
        onOpenShift={() => setOpenShiftModalOpen(true)}
        onCloseShift={() => setCloseShiftModalOpen(true)}
      />

      {/* 2. Metrics Stat Cards Grid */}
      <CashierMetricsGrid
        shiftOpen={shiftOpen}
        isLoading={isLoading}
        totalRevenue={totalRevenue}
        totalTransactions={totalTransactions}
        cashInDrawer={cashInDrawer}
        qrisTotal={qrisTotal}
        transferTotal={transferTotal}
      />

      {/* 3. Quick Navigation Shortcuts */}
      <CashierQuickShortcuts />

      {/* 4. Recent Transactions Table */}
      <CashierRecentTransactionsTable
        shiftOpen={shiftOpen}
        isLoading={isLoading}
        transactions={recentTransactions}
        onSelectTransaction={handleSelectTransaction}
      />

      {/* 5. Alerts Grid: Low Stock & Active Promos */}
      <CashierDashboardAlerts
        lowStockItems={lowStockItems}
        activePromos={activePromos}
      />

      {/* Shared Modals */}
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

      <TransactionDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        transactionId={selectedTransactionId}
      />
    </div>
  );
}

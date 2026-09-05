"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Eye, X, SearchX, Inbox } from "lucide-react";
import { LimitSelect } from "@/components/common/LimitSelect";
import { SearchBar } from "@/components/common/SearchBar";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import { CustomPagination } from "@/components/common/Pagination";
import { useShifts } from "../hooks";
import { ShiftData } from "../types/shift";
import { ShiftStatus, SHIFT_STATUS_LABELS } from "../constants/shift.constant";
import { ShiftDetailDialog } from "./ShiftDetailDialog";
import { ForceCloseShiftDialog } from "./ForceCloseShiftDialog";
import { formatCurrency, formatTransactionDate } from "@/utils/format";

export function ShiftsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? "";

  const { data, isLoading, isFetching, isError } = useShifts({ page, limit, search });

  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [forceCloseOpen, setForceCloseOpen] = useState(false);
  const [selectedForceCloseShift, setSelectedForceCloseShift] = useState<ShiftData | null>(null);

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", newLimit.toString());
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleSearchChange = useCallback(
    (value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("search", value);
      else params.delete("search");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const debouncedSearch = useDebouncedValue(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch === search) return;
    handleSearchChange(debouncedSearch || undefined);
  }, [debouncedSearch, search, handleSearchChange]);

  const handleSearchSubmit = () => {
    handleSearchChange(searchInput.trim() || undefined);
  };

  const shifts = data?.items ?? [];
  const pagination = data?.pagination;

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleOpenDetail = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    setDetailOpen(true);
  };

  const handleOpenForceClose = (shift: ShiftData) => {
    setSelectedForceCloseShift(shift);
    setForceCloseOpen(true);
  };

  const columns: Column<ShiftData>[] = [
    {
      header: "Tanggal Buka Toko",
      cell: (item) => formatTransactionDate(item.openedAt),
    },
    {
      header: "Tanggal Tutup Toko",
      cell: (item) => (item.closedAt ? formatTransactionDate(item.closedAt) : "-"),
    },
    {
      header: "Nama Kasir",
      cell: (item) => item.cashier?.name || "-",
    },
    {
      header: "Kas Awal",
      cell: (item) => formatCurrency(item.openingBalance),
    },
    {
      header: "Kas Akhir",
      cell: (item) =>
        item.closingBalance !== null && item.closingBalance !== undefined
          ? formatCurrency(item.closingBalance)
          : "-",
    },
    {
      header: "Status",
      cell: (item) => {
        const isOpen = item.status === ShiftStatus.OPEN;
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-block ${
              isOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {SHIFT_STATUS_LABELS[item.status]}
          </span>
        );
      },
    },
    {
      header: "Aksi",
      className: "w-24 text-center",
      cell: (item) => {
        const isOpen = item.status === ShiftStatus.OPEN;
        return (
          <div className="flex justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="Detail Shift"
              onClick={() => handleOpenDetail(item.id)}
              className="text-blue-500 hover:text-blue-500/80 hover:bg-muted cursor-pointer"
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={isOpen ? "Tutup Paksa Shift" : "Shift Sudah Ditutup"}
              onClick={() => handleOpenForceClose(item)}
              disabled={!isOpen}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <X className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuat riwayat shift.</p>;
  }

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Riwayat Shift Kasir</h1>
          <p className="text-sm text-muted-foreground">Pantau daftar shift kasir, saldo kas awal, kas akhir, dan status toko</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground">Tampilkan:</span>
          <LimitSelect value={limit} onChange={handleLimitChange} />
        </div>
        <div className="relative w-full sm:max-w-sm">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
            placeholder="Cari kasir..."
            isFetching={isFetching}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={shifts}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={search ? "Data tidak ditemukan" : "Belum ada riwayat shift"}
        emptyIcon={
          search ? (
            <SearchX className="size-8 text-muted-foreground/60" />
          ) : (
            <Inbox className="size-8 text-muted-foreground/60" />
          )
        }
        page={page}
        limit={limit}
      />

      {pagination && (
        <CustomPagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      <ShiftDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        shiftId={selectedShiftId}
      />

      <ForceCloseShiftDialog
        open={forceCloseOpen}
        onOpenChange={setForceCloseOpen}
        shiftData={selectedForceCloseShift}
      />
    </div>
  );
}

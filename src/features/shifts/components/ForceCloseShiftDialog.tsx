"use client";

import { useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency, formatTransactionDate } from "@/utils/format";
import { ShiftData } from "../types/shift";
import {
  forceCloseShiftSchema,
  ForceCloseShiftFormInput,
} from "../schemas/shift.schema";
import { useForceCloseShift } from "../hooks/useForceCloseShift";

interface ForceCloseShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftData: ShiftData | null;
}

export function ForceCloseShiftDialog({
  open,
  onOpenChange,
  shiftData,
}: ForceCloseShiftDialogProps) {
  const forceCloseMutation = useForceCloseShift();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForceCloseShiftFormInput>({
    resolver: zodResolver(
      forceCloseShiftSchema
    ) as unknown as Resolver<ForceCloseShiftFormInput>,
    defaultValues: {
      closingBalance: 0,
      reason: "",
      discrepancyNote: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        closingBalance: 0,
        reason: "",
        discrepancyNote: "",
      });
    }
  }, [open, reset]);

  const onSubmit = (values: ForceCloseShiftFormInput) => {
    if (!shiftData?.id) return;

    forceCloseMutation.mutate(
      {
        shiftId: shiftData.id,
        payload: {
          closingBalance: Number(values.closingBalance),
          reason: values.reason.trim(),
          discrepancyNote: values.discrepancyNote?.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:rounded-xl transition-all max-h-[90vh] flex flex-col overflow-hidden sm:max-w-md">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Tutup Paksa Shift Kasir
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="p-6 space-y-4 flex flex-col flex-1 overflow-y-auto"
        >
          {/* Shift Details Summary Box */}
          {shiftData && (
            <div className="bg-muted/20 border border-border rounded-xl p-3.5 space-y-2 text-xs shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nama Kasir</span>
                <span className="font-semibold text-foreground">
                  {shiftData.cashier?.name || "Kasir"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Waktu Buka Shift</span>
                <span className="font-medium text-foreground">
                  {formatTransactionDate(shiftData.openedAt)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-2">
                <span className="text-muted-foreground">Modal Kas Awal</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(shiftData.openingBalance)}
                </span>
              </div>
            </div>
          )}

          {/* Closing Balance Input */}
          <div className="space-y-1.5 shrink-0">
            <Label
              htmlFor="closingBalance"
              className="text-xs font-semibold text-foreground"
            >
              Total Fisik Uang Kas Akhir <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                Rp
              </span>
              <Input
                id="closingBalance"
                type="number"
                min={0}
                placeholder="0"
                {...register("closingBalance", { valueAsNumber: true })}
                disabled={forceCloseMutation.isPending}
                className="pl-10 font-medium text-foreground text-sm rounded-lg"
              />
            </div>
            {errors.closingBalance && (
              <span className="text-[11px] text-destructive leading-none block mt-1">
                {errors.closingBalance.message}
              </span>
            )}
          </div>

          {/* Force Close Reason */}
          <div className="space-y-1.5 shrink-0">
            <Label
              htmlFor="reason"
              className="text-xs font-semibold text-foreground"
            >
              Alasan Penutupan Paksa <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Contoh: Kasir lupa logout dan sudah pulang, shift dipaksa tutup oleh admin"
              {...register("reason")}
              disabled={forceCloseMutation.isPending}
              className="text-xs rounded-lg border-border resize-none h-20"
            />
            {errors.reason && (
              <span className="text-[11px] text-destructive leading-none block mt-1">
                {errors.reason.message}
              </span>
            )}
          </div>

          {/* Discrepancy Note Input */}
          <div className="space-y-1.5 shrink-0">
            <Label
              htmlFor="discrepancyNote"
              className="text-xs font-semibold text-foreground"
            >
              Catatan Selisih Kas (Opsional)
            </Label>
            <Textarea
              id="discrepancyNote"
              placeholder="Contoh: Selisih karena belum ada transaksi tercatat"
              {...register("discrepancyNote")}
              disabled={forceCloseMutation.isPending}
              className="text-xs rounded-lg border-border resize-none h-20"
            />
            {errors.discrepancyNote && (
              <span className="text-[11px] text-destructive leading-none block mt-1">
                {errors.discrepancyNote.message}
              </span>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="border-t border-border pt-4 -mx-6 -mb-6 px-6 pb-4 shrink-0 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={forceCloseMutation.isPending}
              className="cursor-pointer font-medium px-4 py-2"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={forceCloseMutation.isPending}
              className="cursor-pointer font-medium px-4 py-2 gap-1.5"
            >
              {forceCloseMutation.isPending ? (
                <>
                  <Spinner data-icon="inline-start" className="size-4" />
                </>
              ) : (
                "Tutup Shift"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

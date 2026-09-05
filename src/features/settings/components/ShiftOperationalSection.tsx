import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Clock, ShieldAlert } from "lucide-react";
import { StoreSetting } from "../types/setting";
import { StoreSettingFormValues } from "../schemas/setting.schema";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";

interface ShiftOperationalSectionProps {
  isEditing: boolean;
  isPending: boolean;
  toleranceValue: number;
  register: UseFormRegister<StoreSettingFormValues>;
  errors: FieldErrors<StoreSettingFormValues>;
  initialData: StoreSetting;
}

export function ShiftOperationalSection({
  isEditing,
  isPending,
  toleranceValue,
  register,
  errors,
  initialData,
}: ShiftOperationalSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="size-3.5 text-teal-600" />
        Operasional Shift Kasir
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="shiftDiscrepancyTolerance" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Toleransi Selisih Kas Shift (Rp)
          </label>
          {isEditing ? (
            <div className="space-y-1">
              <Input
                id="shiftDiscrepancyTolerance"
                type="number"
                min={0}
                placeholder="1000"
                className="font-semibold text-slate-700 h-9 max-w-md"
                disabled={isPending}
                {...register("shiftDiscrepancyTolerance", { valueAsNumber: true })}
              />
              {errors.shiftDiscrepancyTolerance && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.shiftDiscrepancyTolerance.message}
                </span>
              )}
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <ShieldAlert className="size-3.5 text-amber-500 shrink-0" />
                Nilai toleransi saat ini:{" "}
                <span className="font-bold text-slate-700">
                  {formatCurrency(Number(toleranceValue) || 0)}
                </span>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9 max-w-md">
              <Clock className="size-3.5 text-slate-400 shrink-0" />
              {formatCurrency(initialData.shiftDiscrepancyTolerance)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

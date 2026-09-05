import { UseFormRegister, Control, Controller, FieldErrors } from "react-hook-form";
import { Clock } from "lucide-react";
import { LoyaltySetting } from "../types/loyalty";
import { LoyaltySettingFormValues } from "../schemas/loyalty.schema";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";

interface LoyaltyExpirySectionProps {
  isEditing: boolean;
  isPending: boolean;
  register: UseFormRegister<LoyaltySettingFormValues>;
  control: Control<LoyaltySettingFormValues>;
  errors: FieldErrors<LoyaltySettingFormValues>;
  initialData: LoyaltySetting;
  isExpiryActiveVal: boolean;
}

export function LoyaltyExpirySection({
  isEditing,
  isPending,
  register,
  control,
  errors,
  initialData,
  isExpiryActiveVal,
}: LoyaltyExpirySectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="size-3.5 text-teal-600" />
        Masa Kadaluarsa Poin
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Toggle Is Expiry Active */}
        <div className="space-y-1">
          <label htmlFor="isExpiryActive" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer">
            Masa Berlaku Poin Kasir
          </label>
          {isEditing ? (
            <label htmlFor="isExpiryActive" className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-lg h-10 cursor-pointer">
              <span className="text-xs font-medium text-slate-600">Aktifkan Masa Kadaluarsa</span>
              <Controller
                name="isExpiryActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isExpiryActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                    className="cursor-pointer"
                  />
                )}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold h-9">
              <span className="text-slate-500 font-normal text-xs">Masa Kadaluarsa</span>
              <span className={initialData.isExpiryActive ? "text-teal-600 font-bold text-xs" : "text-slate-400 text-xs"}>
                {initialData.isExpiryActive ? "Aktif" : "Non-aktif"}
              </span>
            </div>
          )}
        </div>

        {/* Expiry Months */}
        <div className="space-y-1">
          <label htmlFor="expiryMonths" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Durasi Masa Kadaluarsa (Bulan)
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 h-9 font-semibold text-slate-700">
                <InputGroupAddon align="inline-start">
                  <Clock className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupInput
                  id="expiryMonths"
                  type="number"
                  min={1}
                  placeholder="12"
                  className="font-semibold text-slate-700 h-8"
                  disabled={isPending || !isExpiryActiveVal}
                  {...register("expiryMonths", { valueAsNumber: true })}
                />
              </InputGroup>
              {errors.expiryMonths && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.expiryMonths.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9">
              <Clock className="size-3.5 text-slate-400 shrink-0" />
              {initialData.isExpiryActive ? `${initialData.expiryMonths} Bulan` : "Tanpa Kadaluarsa"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

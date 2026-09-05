import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Coins, Gift } from "lucide-react";
import { LoyaltySetting } from "../types/loyalty";
import { LoyaltySettingFormValues } from "../schemas/loyalty.schema";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { formatCurrency } from "@/utils/format";

interface LoyaltyRulesSectionProps {
  isEditing: boolean;
  isPending: boolean;
  register: UseFormRegister<LoyaltySettingFormValues>;
  errors: FieldErrors<LoyaltySettingFormValues>;
  initialData: LoyaltySetting;
}

export function LoyaltyRulesSection({
  isEditing,
  isPending,
  register,
  errors,
  initialData,
}: LoyaltyRulesSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Coins className="size-3.5 text-teal-600" />
        Aturan Perolehan & Penukaran Poin
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Earning Rate */}
        <div className="space-y-1">
          <label htmlFor="earningRate" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Rasio Perolehan Poin (Nominal Belanja per 1 Poin)
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 h-9 font-semibold text-slate-700">
                <InputGroupAddon align="inline-start">
                  <Coins className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupInput
                  id="earningRate"
                  type="number"
                  min={1}
                  placeholder="10000"
                  className="font-semibold text-slate-700 h-8"
                  disabled={isPending}
                  {...register("earningRate", { valueAsNumber: true })}
                />
              </InputGroup>
              {errors.earningRate && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.earningRate.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9">
              <Coins className="size-3.5 text-slate-400 shrink-0" />
              Belanja {formatCurrency(initialData.earningRate)} = 1 Poin
            </div>
          )}
        </div>

        {/* Redemption Rate */}
        <div className="space-y-1">
          <label htmlFor="redemptionRate" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Nilai Penukaran Poin (Nilai 1 Poin dalam Rupiah)
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 h-9 font-semibold text-slate-700">
                <InputGroupAddon align="inline-start">
                  <Gift className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupInput
                  id="redemptionRate"
                  type="number"
                  min={1}
                  placeholder="100"
                  className="font-semibold text-slate-700 h-8"
                  disabled={isPending}
                  {...register("redemptionRate", { valueAsNumber: true })}
                />
              </InputGroup>
              {errors.redemptionRate && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.redemptionRate.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9">
              <Gift className="size-3.5 text-slate-400 shrink-0" />
              1 Poin = {formatCurrency(initialData.redemptionRate)}
            </div>
          )}
        </div>

        {/* Minimum Redeem */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="minimumRedeem" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Minimal Penukaran Poin
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 h-9 font-semibold text-slate-700 max-w-md">
                <InputGroupAddon align="inline-start">
                  <Gift className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupInput
                  id="minimumRedeem"
                  type="number"
                  min={0}
                  placeholder="50"
                  className="font-semibold text-slate-700 h-8"
                  disabled={isPending}
                  {...register("minimumRedeem", { valueAsNumber: true })}
                />
              </InputGroup>
              {errors.minimumRedeem && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.minimumRedeem.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9 max-w-md">
              <Gift className="size-3.5 text-slate-400 shrink-0" />
              {initialData.minimumRedeem} Poin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

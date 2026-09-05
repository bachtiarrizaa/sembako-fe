import { UseFormRegister, Control, Controller, FieldErrors } from "react-hook-form";
import { Receipt } from "lucide-react";
import { StoreSetting } from "../types/setting";
import { StoreSettingFormValues } from "../schemas/setting.schema";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";

interface ReceiptTemplateSectionProps {
  isEditing: boolean;
  isPending: boolean;
  register: UseFormRegister<StoreSettingFormValues>;
  control: Control<StoreSettingFormValues>;
  errors: FieldErrors<StoreSettingFormValues>;
  initialData: StoreSetting;
}

export function ReceiptTemplateSection({
  isEditing,
  isPending,
  register,
  control,
  errors,
  initialData,
}: ReceiptTemplateSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Receipt className="size-3.5 text-teal-600" />
        Template Struk Belanja
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Header Text */}
        <div className="space-y-1">
          <label htmlFor="receiptHeaderText" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Teks Header Struk (Salam Pembuka)
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 font-semibold text-slate-700 items-start">
                <InputGroupAddon align="inline-start" className="pt-2.5">
                  <Receipt className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupTextarea
                  id="receiptHeaderText"
                  rows={2}
                  placeholder="Selamat Datang di Toko Sembako Jaya!"
                  className="font-semibold text-slate-700 text-sm"
                  disabled={isPending}
                  {...register("receiptHeaderText")}
                />
              </InputGroup>
              {errors.receiptHeaderText && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.receiptHeaderText.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium select-all min-h-9">
              <Receipt className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
              {initialData.receiptHeaderText}
            </div>
          )}
        </div>

        {/* Footer Text */}
        <div className="space-y-1">
          <label htmlFor="receiptFooterText" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Teks Footer Struk (Pesan Penutup)
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 font-semibold text-slate-700 items-start">
                <InputGroupAddon align="inline-start" className="pt-2.5">
                  <Receipt className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupTextarea
                  id="receiptFooterText"
                  rows={2}
                  placeholder="Terima kasih telah berbelanja!"
                  className="font-semibold text-slate-700 text-sm"
                  disabled={isPending}
                  {...register("receiptFooterText")}
                />
              </InputGroup>
              {errors.receiptFooterText && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.receiptFooterText.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium select-all min-h-9">
              <Receipt className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
              {initialData.receiptFooterText}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="space-y-1">
          <label htmlFor="receiptShowCashierName" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer">
            Cetak Nama Kasir
          </label>
          {isEditing ? (
            <label htmlFor="receiptShowCashierName" className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-lg h-10 cursor-pointer">
              <span className="text-xs font-medium text-slate-600">Tampilkan Nama Kasir</span>
              <Controller
                name="receiptShowCashierName"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="receiptShowCashierName"
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
              <span className="text-slate-500 font-normal text-xs">Tampilkan Nama Kasir</span>
              <span className={initialData.receiptShowCashierName ? "text-teal-600 font-bold text-xs" : "text-slate-400 text-xs"}>
                {initialData.receiptShowCashierName ? "Aktif" : "Non-aktif"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="receiptShowCustomerName" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer">
            Cetak Nama Pelanggan
          </label>
          {isEditing ? (
            <label htmlFor="receiptShowCustomerName" className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-lg h-10 cursor-pointer">
              <span className="text-xs font-medium text-slate-600">Tampilkan Nama Pelanggan</span>
              <Controller
                name="receiptShowCustomerName"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="receiptShowCustomerName"
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
              <span className="text-slate-500 font-normal text-xs">Tampilkan Nama Pelanggan</span>
              <span className={initialData.receiptShowCustomerName ? "text-teal-600 font-bold text-xs" : "text-slate-400 text-xs"}>
                {initialData.receiptShowCustomerName ? "Aktif" : "Non-aktif"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

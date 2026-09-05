import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Store, Phone, MapPin } from "lucide-react";
import { StoreSetting } from "../types/setting";
import { StoreSettingFormValues } from "../schemas/setting.schema";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface StoreIdentitySectionProps {
  isEditing: boolean;
  isPending: boolean;
  register: UseFormRegister<StoreSettingFormValues>;
  errors: FieldErrors<StoreSettingFormValues>;
  initialData: StoreSetting;
}

export function StoreIdentitySection({
  isEditing,
  isPending,
  register,
  errors,
  initialData,
}: StoreIdentitySectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Store className="size-3.5 text-teal-600" />
        Profil & Identitas Toko
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Store Name */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="storeName" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Nama Toko
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 h-9 font-semibold text-slate-700">
                <InputGroupAddon align="inline-start">
                  <Store className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupInput
                  id="storeName"
                  placeholder="Contoh: Toko Sembako Jaya"
                  className="font-semibold text-slate-700 h-8"
                  disabled={isPending}
                  {...register("storeName")}
                />
              </InputGroup>
              {errors.storeName && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.storeName.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9">
              <Store className="size-3.5 text-slate-400 shrink-0" />
              {initialData.storeName}
            </div>
          )}
        </div>

        {/* Store Phone */}
        <div className="space-y-1">
          <label htmlFor="storePhone" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Nomor Telepon Toko
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 h-9 font-semibold text-slate-700">
                <InputGroupAddon align="inline-start">
                  <Phone className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupInput
                  id="storePhone"
                  placeholder="Contoh: 081234567890"
                  className="font-semibold text-slate-700 h-8"
                  disabled={isPending}
                  {...register("storePhone")}
                />
              </InputGroup>
              {errors.storePhone && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.storePhone.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9">
              <Phone className="size-3.5 text-slate-400 shrink-0" />
              {initialData.storePhone}
            </div>
          )}
        </div>

        {/* Store Address */}
        <div className="space-y-1">
          <label htmlFor="storeAddress" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Alamat Lengkap Toko
          </label>
          {isEditing ? (
            <div>
              <InputGroup className="bg-white border-slate-200 font-semibold text-slate-700 items-start">
                <InputGroupAddon align="inline-start" className="pt-2.5">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                </InputGroupAddon>
                <InputGroupTextarea
                  id="storeAddress"
                  rows={2}
                  placeholder="Jl. Raya Sembako No. 123, Jakarta"
                  className="font-semibold text-slate-700 text-sm"
                  disabled={isPending}
                  {...register("storeAddress")}
                />
              </InputGroup>
              {errors.storeAddress && (
                <span className="text-[11px] text-destructive leading-none mt-1 block">
                  {errors.storeAddress.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-medium select-all min-h-9">
              <MapPin className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
              {initialData.storeAddress}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

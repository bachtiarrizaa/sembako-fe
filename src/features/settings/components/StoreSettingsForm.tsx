"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Check, Printer } from "lucide-react";
import { StoreSetting } from "../types/setting";
import { storeSettingSchema, StoreSettingFormValues } from "../schemas/setting.schema";
import { useUpdateStoreSettings } from "../hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StoreIdentitySection } from "./StoreIdentitySection";
import { ReceiptTemplateSection } from "./ReceiptTemplateSection";
import { ShiftOperationalSection } from "./ShiftOperationalSection";
import { StoreReceiptPreviewModal } from "./StoreReceiptPreviewModal";

interface StoreSettingsFormProps {
  initialData: StoreSetting;
}

export function StoreSettingsForm({ initialData }: StoreSettingsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const updateStoreSettings = useUpdateStoreSettings();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<StoreSettingFormValues>({
    resolver: zodResolver(storeSettingSchema),
    defaultValues: {
      storeName: "",
      storeAddress: "",
      storePhone: "",
      receiptHeaderText: "",
      receiptFooterText: "",
      receiptShowCashierName: true,
      receiptShowCustomerName: true,
      shiftDiscrepancyTolerance: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        storeName: initialData.storeName || "",
        storeAddress: initialData.storeAddress || "",
        storePhone: initialData.storePhone || "",
        receiptHeaderText: initialData.receiptHeaderText || "",
        receiptFooterText: initialData.receiptFooterText || "",
        receiptShowCashierName: initialData.receiptShowCashierName ?? true,
        receiptShowCustomerName: initialData.receiptShowCustomerName ?? true,
        shiftDiscrepancyTolerance: initialData.shiftDiscrepancyTolerance ?? 0,
      });
    }
  }, [initialData, reset]);

  const formValues = watch();
  const toleranceValue = formValues.shiftDiscrepancyTolerance;

  const onSubmit = (data: StoreSettingFormValues) => {
    updateStoreSettings.mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancelEdit = () => {
    reset({
      storeName: initialData.storeName || "",
      storeAddress: initialData.storeAddress || "",
      storePhone: initialData.storePhone || "",
      receiptHeaderText: initialData.receiptHeaderText || "",
      receiptFooterText: initialData.receiptFooterText || "",
      receiptShowCashierName: initialData.receiptShowCashierName ?? true,
      receiptShowCustomerName: initialData.receiptShowCustomerName ?? true,
      shiftDiscrepancyTolerance: initialData.shiftDiscrepancyTolerance ?? 0,
    });
    setIsEditing(false);
  };

  return (
    <>
      <Card className="border border-slate-200/80 shadow-sm bg-white">
        <CardContent className="p-6 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-5">
              {/* Top Header Action Bar */}
              <div className="flex flex-row items-center justify-between pb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Pengaturan Konfigurasi Toko
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewOpen(true)}
                  className="h-7 text-xs font-semibold px-2.5 gap-1 cursor-pointer"
                >
                  <Printer className="size-3" /> Preview Struk
                </Button>
              </div>

              {/* Sub-Section 1: Profil & Identitas Toko */}
              <StoreIdentitySection
                isEditing={isEditing}
                isPending={updateStoreSettings.isPending}
                register={register}
                errors={errors}
                initialData={initialData}
              />

              <hr className="border-slate-100" />

              {/* Sub-Section 2: Template Struk Belanja */}
              <ReceiptTemplateSection
                isEditing={isEditing}
                isPending={updateStoreSettings.isPending}
                register={register}
                control={control}
                errors={errors}
                initialData={initialData}
              />

              <hr className="border-slate-100" />

              {/* Sub-Section 3: Operasional Shift Kasir */}
              <ShiftOperationalSection
                isEditing={isEditing}
                isPending={updateStoreSettings.isPending}
                toleranceValue={Number(toleranceValue) || 0}
                register={register}
                errors={errors}
                initialData={initialData}
              />

              <hr className="border-slate-100" />

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-end gap-3 pt-1">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={updateStoreSettings.isPending}
                      className="h-8 text-xs font-semibold px-3 cursor-pointer gap-1.5"
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSubmit(onSubmit)}
                      disabled={updateStoreSettings.isPending || !isDirty}
                      className="h-8 text-xs font-semibold px-3.5 cursor-pointer gap-1.5"
                    >
                      {updateStoreSettings.isPending ? (
                        <Spinner className="size-3.5" />
                      ) : (
                        <>
                          Simpan Pengaturan Toko
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 text-xs font-semibold px-3.5 cursor-pointer gap-1.5"
                  >
                    Ubah Pengaturan Toko
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Store Receipt Preview Modal */}
      <StoreReceiptPreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        setting={isEditing ? formValues : initialData}
      />
    </>
  );
}

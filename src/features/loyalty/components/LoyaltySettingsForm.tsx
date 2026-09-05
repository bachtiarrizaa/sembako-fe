"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoyaltySetting } from "../types/loyalty";
import { loyaltySettingSchema, LoyaltySettingFormValues } from "../schemas/loyalty.schema";
import { useUpdateLoyaltySettings } from "../hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { LoyaltyRulesSection } from "./LoyaltyRulesSection";
import { LoyaltyExpirySection } from "./LoyaltyExpirySection";

interface LoyaltySettingsFormProps {
  initialData: LoyaltySetting;
}

export function LoyaltySettingsForm({ initialData }: LoyaltySettingsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateLoyaltySettings = useUpdateLoyaltySettings();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<LoyaltySettingFormValues>({
    resolver: zodResolver(loyaltySettingSchema),
    defaultValues: {
      earningRate: 10000,
      redemptionRate: 100,
      minimumRedeem: 50,
      isExpiryActive: false,
      expiryMonths: 12,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        earningRate: initialData.earningRate ?? 10000,
        redemptionRate: initialData.redemptionRate ?? 100,
        minimumRedeem: initialData.minimumRedeem ?? 50,
        isExpiryActive: initialData.isExpiryActive ?? false,
        expiryMonths: initialData.expiryMonths ?? 12,
      });
    }
  }, [initialData, reset]);

  const isExpiryActiveVal = watch("isExpiryActive");

  const onSubmit = (data: LoyaltySettingFormValues) => {
    updateLoyaltySettings.mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancelEdit = () => {
    reset({
      earningRate: initialData.earningRate ?? 10000,
      redemptionRate: initialData.redemptionRate ?? 100,
      minimumRedeem: initialData.minimumRedeem ?? 50,
      isExpiryActive: initialData.isExpiryActive ?? false,
      expiryMonths: initialData.expiryMonths ?? 12,
    });
    setIsEditing(false);
  };

  return (
    <Card className="border border-slate-200/80 shadow-sm bg-white">
      <CardContent className="p-6 space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            {/* SUBSECTION 1: Aturan Perolehan & Penukaran Poin */}
            <LoyaltyRulesSection
              isEditing={isEditing}
              isPending={updateLoyaltySettings.isPending}
              register={register}
              errors={errors}
              initialData={initialData}
            />

            <hr className="border-slate-100" />

            {/* SUBSECTION 2: Masa Kadaluarsa Poin */}
            <LoyaltyExpirySection
              isEditing={isEditing}
              isPending={updateLoyaltySettings.isPending}
              register={register}
              control={control}
              errors={errors}
              initialData={initialData}
              isExpiryActiveVal={isExpiryActiveVal}
            />

            <hr className="border-slate-100" />

            {/* Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-1">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={updateLoyaltySettings.isPending}
                    className="h-8 text-xs font-semibold px-3 cursor-pointer gap-1.5"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateLoyaltySettings.isPending || !isDirty}
                    className="h-8 text-xs font-semibold px-3.5 cursor-pointer gap-1.5"
                  >
                    {updateLoyaltySettings.isPending ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <>
                        Simpan Pengaturan Poin
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
                  Ubah Pengaturan Poin
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

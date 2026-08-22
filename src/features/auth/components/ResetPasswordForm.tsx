"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormValues } from "../schemas/auth.schema";
import { useResetPassword } from "../hooks/useResetPassword";
import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const portal = searchParams.get("portal");
  const loginPath = portal === "cashier" ? "/cashier/login" : "/admin/login";
  const loginLabel = portal === "cashier" ? "Kembali ke Masuk Kasir" : "Kembali ke Masuk Admin";

  const { mutate: resetPassword, isPending } = useResetPassword();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({
      token: data.token || token,
      newPassword: data.newPassword,
    });
  };

  if (!token) {
    return (
      <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Token Tidak Valid</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tautan reset kata sandi tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Kirim ulang tautan reset
        </Link>
      </div>
    );
  }

  return (
    <form className={cn("flex flex-col gap-4", className)} onSubmit={handleSubmit(onSubmit)} {...props}>
      <input type="hidden" {...register("token")} value={token} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">Kata Sandi Baru</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pr-9"
            {...register("newPassword")}
          />
          <button
            type="button"
            aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            onClick={() => setShowNewPassword((v) => !v)}
            className="cursor-pointer absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none"
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pr-9"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="cursor-pointer absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
        {isPending ? (
          <Spinner data-icon="inline-start" className="size-4" />
        ) : "Atur Ulang Kata Sandi"}
      </Button>

      <Link
        href={loginPath}
        className="text-center text-xs text-primary underline-offset-4 hover:underline"
      >
        {loginLabel}
      </Link>
    </form>
  );
}

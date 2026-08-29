"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordRequest } from "../schemas/auth.schema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const portal = searchParams.get("portal");
  const loginPath = portal === "cashier" ? "/cashier/login" : "/admin/login";
  const loginLabel = portal === "cashier" ? "Kembali ke Masuk Kasir" : "Kembali ke Masuk Admin";

  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordRequest) => {
    forgotPassword(data);
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col items-center gap-4 text-center", className)} {...props}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <MailCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Periksa email Anda</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kami telah mengirim tautan reset kata sandi ke{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>.
            Tautan berlaku dalam waktu terbatas.
          </p>
        </div>
        {!portal ? (
          <div className="flex flex-col gap-2 w-full pt-2">
            <Link
              href="/admin/login"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Masuk sebagai Admin
            </Link>
            <Link
              href="/cashier/login"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Masuk sebagai Kasir
            </Link>
          </div>
        ) : (
          <Link
            href={loginPath}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            {loginLabel}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="space-y-3 text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Lupa Kata Sandi
        </h1>
        <div className="space-y-2 text-sm text-muted-foreground leading-tight">
          Masukkan email Anda dan kami akan mengirimkan tautan untuk
          mengatur ulang kata sandi
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
          {isPending ? (
            <Spinner data-icon="inline-start" className="size-4" />
          ) : (
            "Kirim Tautan Reset"
          )}
        </Button>
        <Link
          href={loginPath}
          className="text-center text-xs text-primary underline-offset-4 hover:underline"
        >
          {loginLabel}
        </Link>
      </form>
    </div>
  );
}

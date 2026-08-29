"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginRequest } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

interface LoginFormProps extends React.ComponentProps<"form"> {
  portal?: "admin" | "cashier";
}

export function LoginForm({ className, portal = "admin", ...props }: LoginFormProps) {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <form className={cn("flex flex-col gap-4", className)} onSubmit={handleSubmit(onSubmit)} {...props}>
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Kata Sandi</Label>
          <Link
            href={`/forgot-password?portal=${portal}`}
            className="ml-auto text-xs text-primary underline-offset-4 hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pr-9"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            onClick={() => setShowPassword((v) => !v)}
            className="cursor-pointer absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
        {isPending ? (
          <Spinner data-icon="inline-start" className="size-4" />
        ) : (
          "Masuk"
        )}
      </Button>
    </form>
  );
}

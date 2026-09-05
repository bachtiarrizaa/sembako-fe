"use client";

import type { ReactNode } from "react"
import { Wheat } from "lucide-react"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { AuthCoverPanel } from "@/features/auth/components/AuthCoverPanel"
import { useStoreInfo } from "@/features/store"

interface LoginPageProps {
  title?: string
  subtitle?: ReactNode
  portal?: "admin" | "cashier"
}

export function LoginPage({
  title = "Selamat Datang",
  subtitle,
  portal = "admin",
}: LoginPageProps) {
  const { data: storeInfo } = useStoreInfo()
  const storeName = storeInfo?.storeName || "Toko Beras Putra Mandiri"

  const defaultSubtitle = (
    <p className="text-sm text-muted-foreground leading-tight">
      Masuk dengan akun {portal === "admin" ? "admin" : "kasir"} untuk mengelola {storeName}
    </p>
  )

  return (
    <div className="theme-teal grid min-h-dvh w-full lg:grid-cols-2 bg-background overflow-x-hidden">
      <AuthCoverPanel storeName={storeName} />

      <div className="flex flex-col justify-between p-4 sm:p-6 md:p-10 bg-muted/20 min-h-dvh lg:min-h-screen">
        <div className="flex items-center justify-between shrink-0">
          <a href="#" className="flex items-center gap-2.5 font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wheat className="h-5 w-5" />
            </div>
            <span className="text-base sm:text-lg font-medium tracking-tight">{storeName}</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center py-4 sm:py-8 my-auto">
          <div className="w-full max-w-sm space-y-3.5 sm:space-y-4 rounded-2xl border bg-card shadow-xs p-5 sm:p-8">
            <div className="space-y-1.5 sm:space-y-3 text-center">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground leading-tight">
                {subtitle || defaultSubtitle}
              </div>
            </div>

            <LoginForm portal={portal} />
          </div>
        </div>

        <div className="text-center text-[11px] sm:text-xs text-muted-foreground shrink-0">
          &copy; {new Date().getFullYear()} {storeName}. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  )
}

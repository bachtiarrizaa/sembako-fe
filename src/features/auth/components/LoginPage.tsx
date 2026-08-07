import type { ReactNode } from "react"
import { Wheat } from "lucide-react"
import { LoginForm } from "@/features/auth/components/LoginForm"

const LOGIN_COVER =
  "https://images.unsplash.com/photo-1645331465778-eb409d112198?q=80&w=2000&auto=format&fit=crop"

interface LoginPageProps {
  title?: string
  subtitle?: ReactNode
}

export function LoginPage({
  title = "Selamat Datang",
  subtitle = "Masuk dengan akun Anda untuk mengelola Toko Beras Putra Mandiri",
}: LoginPageProps) {
  return (
    <div className="theme-teal grid min-h-screen w-full lg:grid-cols-2 bg-background">
      <div className="relative hidden bg-muted lg:block overflow-hidden">
        <img
          src={LOGIN_COVER}
          alt="Toko Beras Putra Mandiri"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-10000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        <div className="absolute bottom-12 left-12 right-12 text-left text-white space-y-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-xl leading-none">“</span>
          </div>
          <p className="text-lg font-medium italic text-neutral-200 leading-relaxed">
            Beras pilihan terbaik untuk kebutuhan rumah tangga Anda. Kelola
            transaksi toko beras Anda dengan mudah.
          </p>
          <div className="pt-4 border-t border-white/15 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">POS Toko Beras Putra Mandiri</p>
              <p className="text-xs text-neutral-400">Dashboard Manajemen Toko Sembako</p>
            </div>
            <span className="text-[10px] bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-neutral-200 font-mono">
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between p-6 md:p-10 bg-muted/20">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wheat className="h-5 w-5" />
            </div>
            <span className="text-lg font-medium tracking-tight">Toko Beras Putra Mandiri</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm space-y-4 rounded-2xl border bg-card shadow-xs p-6 sm:p-8">
            <div className="space-y-3 text-center">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <div className="space-y-2 text-sm text-muted-foreground leading-tight">
                {subtitle}
              </div>
            </div>

            <LoginForm />
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Toko Beras Putra Mandiri. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  )
}
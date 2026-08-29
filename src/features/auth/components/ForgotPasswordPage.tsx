import { Wheat } from "lucide-react"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"
import { AuthCoverPanel } from "@/features/auth/components/AuthCoverPanel"

export function ForgotPasswordPage() {
  return (
    <div className="theme-teal grid min-h-screen w-full lg:grid-cols-2 bg-background">
      <AuthCoverPanel />

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
            <ForgotPasswordForm />
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Toko Beras Putra Mandiri. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  )
}

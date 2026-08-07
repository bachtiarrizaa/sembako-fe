import { LoginPage } from "@/features/auth/components/LoginPage";

export default function CashierLoginPage() {
  return (
    <LoginPage
      title="Selamat Datang"
      subtitle={
        <>
          <p className="text-sm text-muted-foreground leading-tight">
            Masuk dengan akun kasir untuk transaksi
          </p>
          <p className="text-sm text-muted-foreground leading-tight">
            Toko Beras Putra Mandiri
          </p>
        </>
      }
    />
  );
}
import { LoginPage } from "@/features/auth/components/LoginPage";

export default function AdminLoginPage() {
  return (
    <LoginPage
      portal="admin"
      title="Selamat Datang"
      subtitle={
        <>
          <p className="text-sm text-muted-foreground leading-tight">
            Masuk dengan akun admin untuk mengelola
          </p>
          <p className="text-sm text-muted-foreground leading-tight">
            Toko Beras Putra Mandiri
          </p>
        </>
      }
    />
  );
}

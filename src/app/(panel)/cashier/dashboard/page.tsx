"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";

export default function CashierDashboard() {
  const { mutate: logout } = useLogout();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Halo Kasir</CardTitle>
          <CardDescription>Selamat datang di dashboard kasir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Fitur dashboard sedang disiapkan.
          </p>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
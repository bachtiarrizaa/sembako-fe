import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Halo Admin</CardTitle>
          <CardDescription>Selamat datang di dashboard admin</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          Fitur dashboard sedang disiapkan.
        </CardContent>
      </Card>
    </main>
  );
}
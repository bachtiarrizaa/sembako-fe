import { StoreSettingsPage } from "@/features/settings";

export const metadata = {
  title: "Pengaturan Toko",
  description: "Pengaturan profil toko, format nota transaksi, dan operasional shift kasir",
};

export default function AdminSettingsPage() {
  return <StoreSettingsPage />;
}

import { LoyaltySettingsPage } from "@/features/loyalty";

export const metadata = {
  title: "Pengaturan Poin",
  description: "Kelola aturan perolehan dan penukaran poin pelanggan member",
};

export default function AdminLoyaltySettingsRoute() {
  return <LoyaltySettingsPage />;
}

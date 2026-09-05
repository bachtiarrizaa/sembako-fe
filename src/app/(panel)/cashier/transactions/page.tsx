import { CashierPosView } from "@/features/pos/components/CashierPosView";

export const metadata = {
  title: "Transaksi Penjualan Kasir | Toko Sembako",
  description: "Layar transaksi mesin kasir penjualan sembako",
};

export default function CashierTransactionsPage() {
  return <CashierPosView />;
}

import { TransactionsPage } from "@/features/transactions/components/TransactionPage";

export const metadata = {
  title: "Riwayat Transaksi Penjualan | Toko Beras Putra Mandiri",
  description: "Daftar riwayat transaksi penjualan kasir",
};

export default function CashierTransactionsPage() {
  return <TransactionsPage />;
}

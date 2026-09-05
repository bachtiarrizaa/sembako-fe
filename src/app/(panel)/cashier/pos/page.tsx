import { redirect } from "next/navigation";

export default function CashierPosRedirectPage() {
  redirect("/cashier/transactions");
}

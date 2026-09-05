import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export function useCashierDashboard() {
  return useQuery({
    queryKey: ["cashier-dashboard"],
    queryFn: dashboardService.getCashierDashboard,
  });
}

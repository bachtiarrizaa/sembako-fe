import { NextRequest } from "next/server";
import { withAuthGuard } from "./middleware/auth.middleware";


export const config = {
  matcher: ["/admin/:path*", "/cashier/:path*"],
};

export function proxy(request: NextRequest) {
  return withAuthGuard(request);
}
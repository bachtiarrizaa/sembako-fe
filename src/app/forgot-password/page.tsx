import { Suspense } from "react";
import { ForgotPasswordPage } from "@/features/auth/components/ForgotPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPage />
    </Suspense>
  );
}

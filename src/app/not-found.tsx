"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function NotFoundPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const role = (user?.role?.name || "").toLowerCase();
  const homePath = !user
    ? "/admin/login"
    : role === "cashier"
      ? "/cashier/dashboard"
      : "/admin/dashboard";

  return (
    <section className="bg-background min-h-screen flex items-center justify-center">
      <div className="container flex items-center px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-primary rounded-full bg-primary-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
            Halaman Tidak Ditemukan
          </h1>
          <p className="mt-4 text-muted-foreground">
            Halaman yang Anda cari tidak ditemukan atau telah dipindahkan. Silakan gunakan tombol navigasi di bawah ini:
          </p>

          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-foreground transition-colors duration-200 bg-card border border-border rounded-lg gap-x-2 sm:w-auto hover:bg-muted cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => router.push(homePath)}
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-primary-foreground transition-colors duration-200 bg-primary rounded-lg shrink-0 sm:w-auto hover:bg-primary/90 font-medium cursor-pointer"
            >
              Halaman Utama
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { CashierBottomBar } from "./CashierBottomBar";
import { Spinner } from "@/components/ui/spinner";

export function CashierLayout({ children }: { children: React.ReactNode }) {
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const pathname = usePathname();

  const isNavigating = navigatingTo !== null && navigatingTo !== pathname;

  useEffect(() => {
    if (!isNavigating) return;

    const safetyTimer = setTimeout(() => {
      setNavigatingTo(null);
    }, 800);

    return () => clearTimeout(safetyTimer);
  }, [isNavigating]);

  useEffect(() => {
    const handlePopState = () => setNavigatingTo(null);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("/") && href !== pathname && !href.startsWith("#")) {
          setNavigatingTo(href);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return (
    <div className="theme-teal h-screen flex flex-col bg-slate-50 overflow-hidden relative">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area (pb-24 sm:pb-20 ensures content is not blocked by fixed BottomBar) */}
      <main className="flex-1 overflow-y-auto pb-24 sm:pb-20 p-3.5 sm:p-6 relative">
        {children}
      </main>

      {/* Bottom Bar Navigation */}
      <CashierBottomBar />

      {/* Navigation Loader Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-xs z-50 flex items-center justify-center transition-opacity">
          <Spinner className="size-6 text-primary" />
        </div>
      )}
    </div>
  );
}

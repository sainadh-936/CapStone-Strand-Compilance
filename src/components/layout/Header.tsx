"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Hide header on public submission pages
  if (pathname?.startsWith("/submit/")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
            S
          </div>
          <span className="font-semibold text-slate-100 text-2xl">
            Strand Logistics
          </span>
        </Link>
      </div>
    </header>
  );
}

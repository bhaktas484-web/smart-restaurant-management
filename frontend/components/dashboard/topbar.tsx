"use client";

import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/lib/api-client";

export function Topbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      logout();
      router.push("/login");
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-charcoal/10 bg-white/70 px-6 py-4 backdrop-blur-md">
      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
        <input
          type="search"
          placeholder="Search orders, dishes, staff..."
          className="w-full rounded-xl border border-charcoal/10 bg-white py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-charcoal/10 text-charcoal hover:bg-charcoal/5"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl border border-charcoal/10 py-1.5 pl-1.5 pr-3 hover:bg-charcoal/5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sunset-gradient text-xs font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </span>
            <span className="text-sm font-medium text-charcoal">{user?.name || "Account"}</span>
            <ChevronDown size={14} className="text-slate-light" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-charcoal/10 bg-white p-1.5 shadow-soft-lg">
              <p className="truncate px-3 py-2 text-xs text-slate-light">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
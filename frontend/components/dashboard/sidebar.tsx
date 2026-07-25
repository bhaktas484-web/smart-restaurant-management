"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  LayoutGrid,
  Users,
  Package,
  ChefHat,
  UserCog,
  Receipt,
  BarChart3,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/store/auth-store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[]; // undefined = visible to all staff roles
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Tables", href: "/dashboard/tables", icon: LayoutGrid },
  { label: "Kitchen", href: "/dashboard/kitchen", icon: ChefHat, roles: ["CHEF", "MANAGER", "ADMIN"] },
  { label: "Customers", href: "/dashboard/customers", icon: Users, roles: ["MANAGER", "ADMIN"] },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package, roles: ["MANAGER", "ADMIN"] },
  { label: "Billing", href: "/dashboard/billing", icon: Receipt, roles: ["CASHIER", "MANAGER", "ADMIN"] },
  { label: "Staff", href: "/dashboard/staff", icon: UserCog, roles: ["MANAGER", "ADMIN"] },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["MANAGER", "ADMIN"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["ADMIN"] },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-charcoal-gradient p-5 lg:flex">
      <Link href="/" className="flex items-center gap-2 px-2 font-display text-lg font-semibold text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sunset-gradient">
          <UtensilsCrossed size={18} />
        </span>
        Plateful
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold text-white">Need a hand?</p>
        <p className="mt-1 text-xs text-white/50">Check the docs or ping support.</p>
      </div>
    </aside>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Stethoscope, Users, Activity, X, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/authService";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    name: "Access Control",
    href: "/access",
    icon: ShieldCheck,
  },
];

export function Sidebar({ className, onClose }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-full lg:w-[calc((260/1920)*100vw)] bg-surface lg:border-r border-line select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-[calc((56/375)*100vw)] lg:h-[calc((64/1920)*100vw)] px-[calc((16/375)*100vw)] lg:px-[calc((20/1920)*100vw)] border-b border-line shrink-0">
        <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
          <div className="flex items-center justify-center w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] lg:w-[calc((36/1920)*100vw)] lg:h-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] bg-medical-blue/15 border border-medical-blue/30 text-medical-blue shrink-0">
            <Activity className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-manrope font-bold text-[calc((14/375)*100vw)] lg:text-[calc((16/1920)*100vw)] tracking-tight text-content-primary leading-tight">
              Doctor Tracker
            </span>
            <span className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-medium text-content-secondary tracking-wider uppercase leading-tight mt-0.5">
              Hospital Admin
            </span>
          </div>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-content-secondary hover:text-content-primary lg:hidden h-[calc((36/375)*100vw)] w-[calc((36/375)*100vw)] rounded-[calc((8/375)*100vw)] flex items-center justify-center cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)]" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[calc((12/375)*100vw)] lg:px-[calc((16/1920)*100vw)] py-[calc((14/375)*100vw)] lg:py-[calc((18/1920)*100vw)] space-y-[calc((8/375)*100vw)] lg:space-y-[calc((6/1920)*100vw)] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="px-3 pb-1 text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-semibold text-content-disabled uppercase tracking-wider">
          Main Navigation
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center justify-between gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((12/375)*100vw)] lg:py-[calc((12/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-medical-blue/20 text-medical-blue font-semibold border border-medical-blue/40 shadow-xs lg:bg-surface-selected lg:text-content-primary lg:border-transparent"
                  : "bg-surface-elevated/70 lg:bg-transparent border border-line/60 lg:border-transparent text-content-secondary hover:bg-surface-hover hover:text-content-primary active:bg-surface-hover active:scale-[0.99]"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-medical-blue transition-all duration-200" />
              )}
              <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] min-w-0">
                <Icon
                  className={cn(
                    "w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] shrink-0 transition-colors duration-150",
                    isActive
                      ? "text-medical-blue"
                      : "text-content-secondary group-hover:text-content-primary"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </div>
              <ChevronRight className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] text-content-muted lg:hidden shrink-0" />
            </Link>
          );
        })}
      </nav>

      {/* Mobile User Profile & Logout Action */}
      {onClose && (
        <div className="p-[calc((12/375)*100vw)] mx-[calc((12/375)*100vw)] mb-[calc((12/375)*100vw)] rounded-[calc((12/375)*100vw)] border border-line bg-surface-elevated/50 space-y-[calc((10/375)*100vw)] shrink-0 lg:hidden">
          <div className="flex items-center gap-[calc((10/375)*100vw)]">
            <div className="flex items-center justify-center w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] rounded-full bg-medical-blue/20 text-medical-blue shrink-0">
              <ShieldCheck className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[calc((12/375)*100vw)] font-semibold text-content-primary truncate">
                Clinical Administrator
              </span>
              <span className="text-[calc((10/375)*100vw)] text-content-secondary truncate">
                Central Hospital Network
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full justify-center gap-2 text-[calc((11/375)*100vw)] border-red-900/50 text-red-300 hover:bg-red-950/40 hover:text-red-200 h-[calc((34/375)*100vw)] rounded-[calc((8/375)*100vw)] cursor-pointer"
          >
            <LogOut strokeWidth={2.4} className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)]" />
            Sign Out
          </Button>
        </div>
      )}

      {/* System Status Footer */}
      <div className="p-[calc((12/375)*100vw)] lg:p-[calc((14/1920)*100vw)] mx-[calc((12/375)*100vw)] lg:mx-[calc((16/1920)*100vw)] mb-[calc((20/375)*100vw)] lg:mb-[calc((24/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] border border-line bg-surface-elevated/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-sage opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-sage"></span>
          </span>
          <span className="text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)] font-semibold text-content-primary truncate">
            Hospital Cloud Network
          </span>
        </div>
        <p className="mt-1 text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-content-secondary leading-tight truncate">
          HIPAA Secured &bull; 511 Clinical Records
        </p>
      </div>
    </aside>
  );
}

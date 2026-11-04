"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Stethoscope, Users, Activity, X, ShieldCheck, LogOut } from "lucide-react";
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
];

export function Sidebar({ className, onClose }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-full lg:w-64 bg-surface lg:border-r border-line select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-line shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-medical-blue/15 border border-medical-blue/30 text-medical-blue">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-manrope font-bold text-base tracking-tight text-content-primary">
              Doctor Tracker
            </span>
            <span className="text-[11px] font-medium text-content-secondary tracking-wide uppercase">
              Administration
            </span>
          </div>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-content-secondary hover:text-content-primary lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-content-disabled uppercase tracking-wider">
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
                "group relative flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-surface-selected text-content-primary font-semibold"
                  : "text-content-secondary hover:bg-surface-hover hover:text-content-primary"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-medical-blue transition-all duration-200" />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors duration-150",
                  isActive
                    ? "text-medical-blue"
                    : "text-content-secondary group-hover:text-content-primary"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile User Profile & Logout Action */}
      {onClose && (
        <div className="p-4 mx-3 mb-3 rounded-xl border border-line bg-surface-elevated/40 space-y-3 shrink-0 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-medical-blue/20 text-medical-blue shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-semibold text-content-primary truncate">
                Clinical Administrator
              </span>
              <span className="text-[10px] text-content-secondary truncate">
                Central Hospital Network
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full justify-center gap-2 text-xs border-red-900/50 text-red-300 hover:bg-red-950/40 hover:text-red-200 h-8"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </Button>
        </div>
      )}

      {/* System Status Footer */}
      <div className="p-3.5 mx-3 mb-4 rounded-xl border border-line bg-surface-elevated/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-sage opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-sage"></span>
          </span>
          <span className="text-xs font-semibold text-content-primary">
            MongoDB Atlas Cluster
          </span>
        </div>
        <p className="mt-1 text-[11px] text-content-secondary leading-tight">
          Live Sync &bull; 511 Clinical Records
        </p>
      </div>
    </aside>
  );
}


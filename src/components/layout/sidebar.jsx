"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Stethoscope, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "flex flex-col h-full w-64 bg-surface border-r border-line select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-line">
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
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
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-surface-selected text-content-primary font-semibold"
                  : "text-content-secondary hover:bg-surface-hover hover:text-content-primary"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-medical-blue transition-all duration-200" />
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

      {/* System Status Footer */}
      <div className="p-4 mx-3 mb-4 rounded-md border border-line bg-surface-elevated/50">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-sage"></span>
          </span>
          <span className="text-xs font-medium text-content-primary">
            System Operational
          </span>
        </div>
        <p className="mt-1 text-[11px] text-content-secondary">
          v1.0.0 &bull; Healthcare Admin
        </p>
      </div>
    </aside>
  );
}


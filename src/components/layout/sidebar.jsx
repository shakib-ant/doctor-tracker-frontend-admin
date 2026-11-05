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
        "flex flex-col h-full w-full bg-[#0C1322] lg:border-r border-[#1B273A] select-none text-slate-300",
        className
      )}
    >
      {/* Brand Header with compact sleek height */}
      <div className="flex items-center justify-between h-[calc((60/375)*100vw)] sm:h-16 lg:h-[calc((70/1920)*100vw)] px-4 lg:px-[calc((16/1920)*100vw)] border-b border-[#1B273A] shrink-0">
        <div className="flex items-center gap-2.5 lg:gap-[calc((12/1920)*100vw)]">
          <div className="flex items-center justify-center w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] sm:w-9 sm:h-9 lg:w-[calc((36/1920)*100vw)] lg:h-[calc((36/1920)*100vw)] rounded-[calc((10/375)*100vw)] sm:rounded-xl lg:rounded-[calc((12/1920)*100vw)] bg-blue-600/20 border border-blue-500/40 text-blue-400 shrink-0 shadow-[0_0_12px_rgba(37,99,235,0.25)]">
            <Activity className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] sm:w-5 sm:h-5 lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] stroke-[2.4]" />
          </div>
          <div className="flex flex-col">
            <span className="font-manrope font-extrabold text-[calc((14/375)*100vw)] sm:text-base lg:text-[calc((16/1920)*100vw)] tracking-tight text-white leading-tight">
              Doctor Tracker
            </span>
            <span className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-medium text-slate-400 tracking-wider uppercase leading-tight mt-0.5">
              Hospital Admin
            </span>
          </div>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden h-9 w-9 rounded-xl flex items-center justify-center cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation: Compact & Sleek */}
      <nav className="flex-1 px-3 sm:px-4 lg:px-[calc((12/1920)*100vw)] pt-4 sm:pt-6 lg:pt-[calc((20/1920)*100vw)] pb-4 lg:pb-[calc((16/1920)*100vw)] space-y-1.5 sm:space-y-2 lg:space-y-[calc((7/1920)*100vw)] overflow-y-auto no-scrollbar">
        <div className="px-3 sm:px-3.5 pb-2 text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-400 tracking-wider uppercase">
          Menu
        </div>
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          const iconClass = cn(
            "w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] sm:w-[18px] sm:h-[18px] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] shrink-0 transition-all duration-200",
            isActive ? "text-white" : "text-slate-400 group-hover:text-white"
          );

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-2.5 sm:gap-3 lg:gap-[calc((12/1920)*100vw)] px-3 sm:px-3.5 lg:px-[calc((14/1920)*100vw)] py-2 sm:py-2.5 lg:py-[calc((8.5/1920)*100vw)] rounded-xl lg:rounded-[calc((12/1920)*100vw)] text-[calc((13/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.35)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06] active:scale-[0.99]"
              )}
            >
              {/* Perfectly crafted active icons (Fixes: "doctor access control er ta thik nai active") */}
              {item.href === "/" && (
                <LayoutDashboard className={cn(iconClass, isActive ? "fill-white" : "fill-none")} strokeWidth={isActive ? 2.4 : 2} />
              )}
              {item.href === "/doctors" && (
                isActive ? (
                  <svg viewBox="0 0 24 24" className={iconClass} fill="none">
                    <path
                      d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="20" cy="10" r="2.8" fill="white" stroke="white" strokeWidth="0.5" />
                    <circle cx="5" cy="2" r="1.5" fill="white" />
                    <circle cx="19" cy="2" r="1.5" fill="white" />
                  </svg>
                ) : (
                  <Stethoscope className={iconClass} strokeWidth={2} />
                )
              )}
              {item.href === "/patients" && (
                <Users className={cn(iconClass, isActive ? "fill-white" : "fill-none")} strokeWidth={isActive ? 2.4 : 2} />
              )}
              {item.href === "/access" && (
                isActive ? (
                  <svg viewBox="0 0 24 24" className={iconClass}>
                    <path
                      d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
                      fill="white"
                    />
                    <path
                      d="m9 12 2 2 4-4"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <ShieldCheck className={iconClass} strokeWidth={2} />
                )
              )}
              <span className="whitespace-nowrap font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: Log Out Button Only (Sun/Moon removed as requested) */}
      <div className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] border-t border-[#1B273A] shrink-0">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-[calc((8/375)*100vw)] lg:py-[calc((9/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-[#141E33] hover:bg-[#1A2744] text-slate-200 hover:text-white border border-[#1E2D4A] transition-all font-medium text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] cursor-pointer shadow-xs active:scale-[0.99]"
        >
          <LogOut strokeWidth={2.2} className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] text-slate-400 group-hover:text-white" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

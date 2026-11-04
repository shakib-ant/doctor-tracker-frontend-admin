"use client";

import React from "react";
import { Menu, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/authService";

export function Navbar({ onMenuClick, title = "Dashboard" }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 px-4 md:px-8 border-b border-line bg-surface/95 backdrop-blur-sm select-none">
      {/* Mobile Menu & Section Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-content-secondary hover:text-content-primary -ml-1 h-9 w-9 shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 truncate">
          <h1 className="font-manrope text-base sm:text-lg md:text-xl font-bold tracking-tight text-content-primary truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* User Status / Account Indicator & Logout (Hidden on mobile/tablet, strictly desktop LG+ only) */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-line bg-surface-elevated/70">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-medical-blue/20 text-medical-blue">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-content-primary leading-tight">
              Clinical Administrator
            </span>
            <span className="text-[10px] text-content-secondary leading-tight">
              Central Hospital Network
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-8 w-8 text-content-muted hover:text-red-400 hover:bg-surface-hover"
          title="Sign out of administration portal"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}

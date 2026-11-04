"use client";

import React from "react";
import { Menu, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/authService";

export function Navbar({ onMenuClick, title = "Dashboard" }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[calc((54/375)*100vw)] lg:h-[calc((64/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((32/1920)*100vw)] border-b border-line bg-surface/95 backdrop-blur-sm select-none">
      {/* Mobile Menu & Section Title */}
      <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-content-secondary hover:text-content-primary -ml-1 h-[calc((34/375)*100vw)] w-[calc((34/375)*100vw)] shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 truncate">
          <h1 className="font-manrope text-[calc((16/375)*100vw)] lg:text-[calc((20/1920)*100vw)] font-bold tracking-tight text-content-primary truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* User Status / Account Indicator & Logout (Hidden on mobile/tablet, strictly desktop LG+ only) */}
      <div className="hidden lg:flex items-center gap-[calc((12/1920)*100vw)]">
        <div className="flex items-center gap-[calc((10/1920)*100vw)] px-[calc((12/1920)*100vw)] py-[calc((6/1920)*100vw)] rounded-full border border-line bg-surface-elevated/70">
          <div className="flex items-center justify-center w-[calc((24/1920)*100vw)] h-[calc((24/1920)*100vw)] rounded-full bg-medical-blue/20 text-medical-blue">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[calc((12/1920)*100vw)] font-semibold text-content-primary leading-tight">
              Clinical Administrator
            </span>
            <span className="text-[calc((10/1920)*100vw)] text-content-secondary leading-tight">
              Central Hospital Network
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-[calc((32/1920)*100vw)] w-[calc((32/1920)*100vw)] text-content-muted hover:text-red-400 hover:bg-surface-hover"
          title="Sign out of administration portal"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}

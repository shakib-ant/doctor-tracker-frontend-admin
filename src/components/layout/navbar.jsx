"use client";

import React from "react";
import { Menu, ShieldCheck, LogOut, Activity, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/authService";

export function Navbar({ onMenuClick, title = "Dashboard" }) {
  // Determine appropriate clinical icon based on section title
  const getHeaderIcon = () => {
    if (title.includes("Access")) {
      return (
        <ShieldCheck className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.2]" />
      );
    }
    if (title.includes("Doctor")) {
      return (
        <Stethoscope className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.2]" />
      );
    }
    if (title.includes("Patient")) {
      return (
        <Users className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.2]" />
      );
    }
    return (
      <Activity className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.2]" />
    );
  };

  const getHeaderSubtitle = () => {
    if (title.includes("Access")) {
      return "SuperAdmin Security & Permissions";
    }
    if (title.includes("Doctor")) {
      return "Specialist Directory & Roster";
    }
    if (title.includes("Patient")) {
      return "Inpatient Census & Records";
    }
    return "Hospital Operations & Telemetry";
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[calc((60/375)*100vw)] lg:h-[calc((68/1920)*100vw)] px-[calc((16/375)*100vw)] lg:px-[calc((27/1920)*100vw)] border-b border-line bg-surface/95 backdrop-blur-sm select-none">
      {/* Mobile Menu & Section Header */}
      <div className="flex items-center gap-[calc((12/375)*100vw)] lg:gap-[calc((14/1920)*100vw)] min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-content-secondary hover:text-content-primary -ml-1 h-[calc((42/375)*100vw)] w-[calc((42/375)*100vw)] rounded-[calc((10/375)*100vw)] shrink-0 cursor-pointer flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <Menu className="w-[calc((26/375)*100vw)] h-[calc((26/375)*100vw)] stroke-[2.3]" />
        </Button>

        {/* Section title on desktop */}
        <div className="hidden lg:flex items-center gap-[calc((14/1920)*100vw)] min-w-0">
          <div className="flex items-center justify-center w-[calc((40/1920)*100vw)] h-[calc((40/1920)*100vw)] rounded-[calc((12/1920)*100vw)] bg-medical-blue/15 border border-medical-blue/30 text-medical-blue shrink-0 shadow-[0_0_12px_rgba(137,180,206,0.15)]">
            {getHeaderIcon()}
          </div>
          <div className="flex flex-col truncate">
            <h1 className="font-manrope text-[calc((18/1920)*100vw)] font-bold tracking-tight text-content-primary leading-tight truncate">
              {title}
            </h1>
            <span className="text-[calc((14/1920)*100vw)] font-medium text-content-secondary tracking-wider uppercase leading-tight mt-0.5 truncate">
              {getHeaderSubtitle()}
            </span>
          </div>
        </div>
      </div>

      {/* On mobile: Text placed on the right side */}
      <div className="flex flex-col text-right items-end truncate min-w-0 lg:hidden">
        <h1 className="font-manrope text-[calc((16/375)*100vw)] font-bold tracking-tight text-content-primary leading-tight truncate">
          {title}
        </h1>
        <span className="text-[calc((14/375)*100vw)] font-medium text-content-secondary tracking-wider uppercase leading-tight mt-0.5 truncate">
          {getHeaderSubtitle()}
        </span>
      </div>

      {/* User Status Glass Pill & Matching Logout Button */}
      <div className="hidden lg:flex items-center gap-[calc((12/1920)*100vw)] shrink-0">
        <div className="flex items-center gap-[calc((12/1920)*100vw)] h-[calc((40/1920)*100vw)] px-[calc((16/1920)*100vw)] rounded-full border border-white/[0.15] bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.2)] shrink-0 hover:border-medical-blue/40 transition-all duration-300">
          <div className="flex items-center justify-center w-[calc((28/1920)*100vw)] h-[calc((28/1920)*100vw)] rounded-full bg-medical-blue/20 text-medical-blue shrink-0 border border-medical-blue/35 shadow-[0_0_10px_rgba(137,180,206,0.35)]">
            <ShieldCheck className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((19/1920)*100vw)] lg:h-[calc((19/1920)*100vw)] stroke-[2.2] shrink-0" />
          </div>
          <div className="flex flex-col text-left shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[calc((14/1920)*100vw)] font-semibold text-content-primary leading-tight whitespace-nowrap tracking-tight">
                Clinical Administrator
              </span>
              <span className="relative flex h-[calc((8/1920)*100vw)] w-[calc((8/1920)*100vw)] shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-full w-full bg-emerald-400" />
              </span>
            </div>
            <span className="text-[calc((14/1920)*100vw)] text-content-secondary leading-tight whitespace-nowrap mt-0.5 tracking-normal">
              Central Hospital Network
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-[calc((40/1920)*100vw)] w-[calc((40/1920)*100vw)] rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] text-content-muted hover:text-red-300 hover:bg-red-950/40 hover:border-red-500/40 shrink-0 transition-all cursor-pointer flex items-center justify-center"
          title="Sign out of administration portal"
        >
          <LogOut
            strokeWidth={2.4}
            className="w-[calc((22/375)*100vw)] h-[calc((22/375)*100vw)] lg:w-[calc((24/1920)*100vw)] lg:h-[calc((24/1920)*100vw)]"
          />
        </Button>
      </div>
    </header>
  );
}

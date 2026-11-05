"use client";

import React from "react";
import { Menu, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "./notification-dropdown";

export function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-[calc((56/375)*100vw)] sm:h-16 lg:h-[calc((68/1920)*100vw)] px-[calc((14/375)*100vw)] sm:px-6 lg:px-[calc((28/1920)*100vw)] border-b border-slate-200/80 bg-white/95 backdrop-blur-md select-none gap-2 sm:gap-4 lg:gap-[calc((16/1920)*100vw)] shadow-xs">
      {/* Left side: Mobile Menu Button + Compact Search Input (Fixes mobile gap & search size) */}
      <div className="flex items-center gap-[calc((8/375)*100vw)] sm:gap-3 lg:gap-[calc((16/1920)*100vw)] flex-1 min-w-0 max-w-[calc((210/375)*100vw)] sm:max-w-xs md:max-w-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 hover:text-slate-900 -ml-1 h-[calc((36/375)*100vw)] w-[calc((36/375)*100vw)] sm:h-10 sm:w-10 rounded-[calc((8/375)*100vw)] sm:rounded-xl shrink-0 cursor-pointer flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <Menu className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] sm:w-5 sm:h-5 stroke-[2.2]" />
        </Button>

        {/* Search Capsule: Compact on mobile with generous gap to right-side buttons */}
        <div className="flex items-center gap-[calc((6/375)*100vw)] sm:gap-2 lg:gap-[calc((10/1920)*100vw)] h-[calc((34/375)*100vw)] sm:h-10 lg:h-[calc((42/1920)*100vw)] px-[calc((10/375)*100vw)] sm:px-3 lg:px-[calc((16/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl bg-slate-50 border border-slate-200 text-slate-400 focus-within:border-blue-500 focus-within:bg-white focus-within:text-slate-900 focus-within:shadow-xs transition-all duration-200 w-[calc((130/375)*100vw)] sm:w-56 md:w-64 lg:w-[calc((320/1920)*100vw)] shrink-0">
          <Search className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] text-slate-800 placeholder:text-slate-400 w-full"
            readOnly
          />
        </div>
      </div>

      {/* Right side: Message Icon + Live Notification Dropdown + User Avatar Circle */}
      <div className="flex items-center gap-[calc((8/375)*100vw)] sm:gap-3 lg:gap-[calc((14/1920)*100vw)] shrink-0">
        {/* Message Icon Button */}
        <button
          type="button"
          onClick={() => {
            alert("Hospital Messaging Service: All clinical dispatch lines are active and running normally.");
          }}
          className="flex items-center justify-center w-[calc((34/375)*100vw)] h-[calc((34/375)*100vw)] sm:w-10 sm:h-10 lg:w-[calc((42/1920)*100vw)] lg:h-[calc((42/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
          title="Clinical Dispatch & Messages"
        >
          <MessageSquare className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)]" />
        </button>

        {/* Live Server-Connected Notification Dropdown */}
        <NotificationDropdown />

        {/* User Avatar Photo with Unclipped Online Active Status Indicator */}
        <div
          className="relative inline-flex items-center justify-center shrink-0 cursor-pointer p-0.5"
          title="Clinical Administrator"
        >
          <div className="w-[calc((34/375)*100vw)] h-[calc((34/375)*100vw)] sm:w-10 sm:h-10 lg:w-[calc((42/1920)*100vw)] lg:h-[calc((42/1920)*100vw)] rounded-full overflow-hidden shadow-sm border-2 border-white ring-1 ring-slate-200 hover:scale-105 transition-transform bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Administrator Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230F172A"/><text x="50%" y="54%" font-family="Arial,sans-serif" font-size="34" font-weight="bold" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">AD</text></svg>`;
              }}
            />
          </div>
          <span className="absolute bottom-0.5 right-0.5 w-[calc((9/375)*100vw)] h-[calc((9/375)*100vw)] sm:w-2.5 sm:h-2.5 lg:w-[calc((11/1920)*100vw)] lg:h-[calc((11/1920)*100vw)] rounded-full bg-emerald-500 ring-2 ring-white z-10 pointer-events-none shadow-xs" />
        </div>
      </div>
    </header>
  );
}

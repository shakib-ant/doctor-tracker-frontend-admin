"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  MessageSquare,
  LogOut,
  ShieldCheck,
  Building2,
  CheckCircle2,
  UserCheck,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "./notification-dropdown";
import { getCurrentUser, logout } from "@/services/authService";

export function Navbar({ onMenuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const roleLabel =
    user?.level === "superAdmin"
      ? "Super Administrator"
      : user?.level === "admin"
      ? "Clinical Administrator"
      : "Medical Staff";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-[calc((56/375)*100vw)] sm:h-16 lg:h-[calc((68/1920)*100vw)] px-[calc((14/375)*100vw)] sm:px-6 lg:px-[calc((28/1920)*100vw)] border-b border-slate-200/80 bg-white/95 backdrop-blur-md select-none gap-2 sm:gap-4 lg:gap-[calc((16/1920)*100vw)] shadow-xs">
      {/* Left side: Mobile Menu Button + Compact Search Input */}
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

      {/* Right side: Message Icon + Live Notification Dropdown + User Avatar Profile Dropdown */}
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

        {/* User Profile Avatar with Clickable Dropdown Menu */}
        <div className="relative inline-flex items-center justify-center shrink-0" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative inline-flex items-center justify-center shrink-0 cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none"
            title="Account & Administrator Profile"
            aria-expanded={isProfileOpen}
          >
            <div className="w-[calc((34/375)*100vw)] h-[calc((34/375)*100vw)] sm:w-10 sm:h-10 lg:w-[calc((42/1920)*100vw)] lg:h-[calc((42/1920)*100vw)] rounded-full overflow-hidden shadow-sm border-2 border-white ring-1 ring-slate-200 bg-slate-100">
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
          </button>

          {/* User Profile Information Dropdown Panel */}
          {isProfileOpen && (
            <>
              {/* Mobile/Tablet Backdrop */}
              <div
                className="fixed inset-0 bg-slate-900/25 backdrop-blur-2xs z-40 lg:hidden"
                onClick={() => setIsProfileOpen(false)}
              />

              <div className="fixed left-1/2 -translate-x-1/2 top-[calc((62/375)*100vw)] w-[calc(100vw-28px)] max-w-[320px] sm:fixed sm:left-1/2 sm:-translate-x-1/2 sm:top-[70px] sm:w-80 lg:absolute lg:inset-x-auto lg:left-auto lg:right-0 lg:top-full lg:translate-x-0 lg:mt-2 lg:w-72 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22),0_10px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-200 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                {/* Header User Brief */}
                <div className="p-3.5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white ring-1 ring-slate-200 shadow-xs shrink-0 bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate leading-tight">
                      {user?.name || "Hospital Administrator"}
                    </h4>
                    <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">
                      {user?.email || "admin@doctortracker.org"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 leading-none">
                      {roleLabel}
                    </span>
                  </div>
                </div>

                {/* Information details */}
                <div className="p-3 space-y-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Department
                    </span>
                    <span className="font-medium text-slate-800 truncate max-w-[150px]">
                      {user?.department || "Executive Operations"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Account Status
                    </span>
                    <span className="font-semibold text-emerald-600 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active / Online
                    </span>
                  </div>
                </div>

                {/* Quick Actions Links */}
                <div className="p-1.5 space-y-0.5">
                  <Link
                    href="/access"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-blue-600 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Access & Staff Control</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>

                {/* Log Out Button */}
                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200/80 bg-white transition-all font-bold text-xs cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
                      <span>Log Out</span>
                    </div>
                    <span className="text-[10px] text-red-400 font-normal">End Session</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

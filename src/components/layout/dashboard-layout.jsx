"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { getAuthToken } from "@/utils/auth";

export function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!getAuthToken();
  });
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token && typeof window !== "undefined") {
      setIsAuthorized(false);
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-canvas text-content-secondary gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-sm font-medium">Verifying authorization...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-canvas text-content-primary no-scrollbar">
      {/* Desktop Sidebar with Fluid Calc Width */}
      <div className="hidden lg:block lg:w-[calc((280/1920)*100vw)] lg:shrink-0">
        <div className="fixed inset-y-0 left-0 w-[calc((280/1920)*100vw)] z-30">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-0 flex w-full flex-col bg-surface shadow-2xl z-50 animate-in slide-in-from-left duration-250 no-scrollbar">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area - Strictly constrained to prevent any horizontal scrolling */}
      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden no-scrollbar">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        <main className="flex-1 w-full p-[calc((16/375)*100vw)] lg:p-[calc((35/1920)*100vw)] no-scrollbar overflow-x-hidden">
          <div className="max-w-[1720px] w-full mx-auto space-y-[calc((18/375)*100vw)] lg:space-y-[calc((26/1920)*100vw)] transition-all duration-300 animate-in fade-in-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

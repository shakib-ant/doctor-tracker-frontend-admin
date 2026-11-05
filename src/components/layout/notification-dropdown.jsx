"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  X,
  UserCheck,
  Building2,
  Mail,
  Clock,
  Loader2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import {
  fetchAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
} from "@/services/accessService";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const dropdownRef = useRef(null);

  // Load real pending requests from MongoDB server
  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchAccessRequests();
      setRequests(res.requests || []);
    } catch (err) {
      // In case user is not superadmin or token expired, keep silent
      console.warn("Could not load notification access requests:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load + periodic polling for real-time telemetry updates
  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 25000); // Poll every 25s for live updates
    return () => clearInterval(interval);
  }, [loadRequests]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle direct approval from notification panel
  const handleApprove = async (id, e) => {
    e.stopPropagation();
    try {
      setActionLoadingId(id);
      await approveAccessRequest(id, "admin");
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to approve access request: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle direct rejection from notification panel
  const handleReject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to decline and remove this access request?")) return;
    try {
      setActionLoadingId(id);
      await rejectAccessRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to reject access request: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Helper for human-readable relative time
  const formatTime = (dateStr) => {
    if (!dateStr) return "Recent";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const pendingCount = requests.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Notification Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadRequests();
        }}
        className={`relative flex items-center justify-center w-[calc((38/375)*100vw)] h-[calc((38/375)*100vw)] lg:w-[calc((42/1920)*100vw)] lg:h-[calc((42/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-white border border-slate-200 transition-all duration-200 shadow-xs cursor-pointer ${
          isOpen
            ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-100"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
        title="Live Access & Telemetry Notifications"
        aria-label="Access Notifications"
      >
        <Bell className="w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)]" />

        {/* Real-time Counter Badge */}
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:min-w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] px-1 rounded-full bg-pink-600 text-white text-[calc((11/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-extrabold shadow-sm ring-2 ring-white animate-in zoom-in duration-200">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      {/* Centered Notification Panel on Mobile & Tablet, Anchored Dropdown on Desktop */}
      {isOpen && (
        <>
          {/* Mobile/Tablet Dim Backdrop for easy tap-to-dismiss */}
          <div
            className="fixed inset-0 bg-slate-900/25 backdrop-blur-2xs z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed left-1/2 -translate-x-1/2 top-[calc((62/375)*100vw)] w-[calc(100vw-24px)] max-w-[360px] sm:fixed sm:left-1/2 sm:-translate-x-1/2 sm:top-[70px] sm:w-[410px] sm:max-w-[92vw] lg:absolute lg:inset-x-auto lg:left-auto lg:right-0 lg:top-full lg:translate-x-0 lg:mt-2 lg:w-[calc((420/1920)*100vw)] bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22),0_10px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-200 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h4 className="font-manrope font-bold text-[calc((13/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] text-slate-900">
                Access & Join Requests
              </h4>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[calc((11/375)*100vw)] sm:text-xs font-bold leading-none">
                  {pendingCount} Pending
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={loadRequests}
              disabled={isLoading}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Refresh requests"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            </button>
          </div>

          {/* Body: List of Live Requests from Server with Tablet Protected Max-Height */}
          <div className="max-h-[calc((340/375)*100vw)] sm:max-h-[400px] lg:max-h-[calc((420/1920)*100vw)] overflow-y-auto no-scrollbar divide-y divide-slate-100">
            {isLoading && requests.length === 0 ? (
              <div className="py-[calc((24/375)*100vw)] lg:py-[calc((32/1920)*100vw)] text-center text-slate-400 space-y-2">
                <Loader2 className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] animate-spin text-blue-600 mx-auto" />
                <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)]">Checking server records...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="py-[calc((32/375)*100vw)] lg:py-[calc((40/1920)*100vw)] px-4 text-center space-y-2.5">
                <div className="w-[calc((38/375)*100vw)] h-[calc((38/375)*100vw)] lg:w-[calc((42/1920)*100vw)] lg:h-[calc((42/1920)*100vw)] rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] text-slate-800">
                    All Caught Up!
                  </p>
                  <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                    No pending employee or doctor access requests awaiting administrator review.
                  </p>
                </div>
              </div>
            ) : (
              requests.map((req) => {
                const isWorking = actionLoadingId === req._id;
                const initials =
                  req.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "DR";

                return (
                  <div
                    key={req._id}
                    className="p-[calc((12/375)*100vw)] lg:p-[calc((14/1920)*100vw)] hover:bg-slate-50/90 transition-colors flex flex-col gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]"
                  >
                    {/* Top row: Avatar + Name + Department + Time */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-[calc((36/375)*100vw)] h-[calc((36/375)*100vw)] lg:w-[calc((38/1920)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-full bg-blue-100 text-blue-700 font-bold text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] flex items-center justify-center shrink-0 border border-blue-200 font-manrope shadow-xs">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-900 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] truncate leading-tight">
                            {req.name}
                          </h5>
                          <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-slate-500 truncate leading-tight mt-0.5 flex items-center gap-1">
                            <Mail className="w-[calc((12/375)*100vw)] h-[calc((12/375)*100vw)] lg:w-[calc((13/1920)*100vw)] lg:h-[calc((13/1920)*100vw)] text-slate-400 shrink-0" />
                            <span>{req.email}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-slate-400 flex items-center gap-1">
                          <Clock className="w-[calc((12/375)*100vw)] h-[calc((12/375)*100vw)] lg:w-[calc((13/1920)*100vw)] lg:h-[calc((13/1920)*100vw)]" />
                          {formatTime(req.requestedAt || req.createdAt)}
                        </span>
                        <span className="mt-1 px-[calc((8/375)*100vw)] py-[calc((2/375)*100vw)] rounded-full bg-slate-100 text-slate-600 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold border border-slate-200 leading-none">
                          {req.department || "Clinical Staff"}
                        </span>
                      </div>
                    </div>

                    {/* Note message from applicant if provided */}
                    {req.requestNote && (
                      <div className="p-2 rounded-lg bg-slate-100/70 border border-slate-200/80 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-slate-600 italic leading-snug">
                        &ldquo;{req.requestNote}&rdquo;
                      </div>
                    )}

                    {/* Quick Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleReject(req._id, e)}
                        disabled={isWorking}
                        className="px-[calc((10/375)*100vw)] py-[calc((4/375)*100vw)] lg:px-[calc((12/1920)*100vw)] lg:py-[calc((5/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                        title="Decline access request"
                      >
                        <X className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)]" />
                        <span>Decline</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleApprove(req._id, e)}
                        disabled={isWorking}
                        className="px-[calc((12/375)*100vw)] py-[calc((4/375)*100vw)] lg:px-[calc((14/1920)*100vw)] lg:py-[calc((5/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] bg-emerald-600 hover:bg-emerald-700 text-white text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        title="Approve access and grant administrator role"
                      >
                        {isWorking ? (
                          <Loader2 className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] animate-spin" />
                        ) : (
                          <Check className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] stroke-[2.5]" />
                        )}
                        <span>Approve Access</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer: Link to full Access Control module with Fluid Calc */}
          <div className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] border-t border-slate-100 bg-slate-50/70 text-center">
            <Link
              href="/access"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              <span>Manage All Staff Credentials in Access Control</span>
              <ExternalLink className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)]" />
            </Link>
          </div>
        </div>
        </>
      )}
    </div>
  );
}


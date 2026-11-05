"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { directAddAdmin } from "@/services/accessService";
import { ShieldCheck, User, Mail, Lock, Building2, Loader2, AlertCircle, X } from "lucide-react";

export function AddAdminModal({ isOpen, onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Hospital Administration");
  const [role, setRole] = useState("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter the administrator's full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid official email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await directAddAdmin({
        name: name.trim(),
        email: email.trim(),
        password,
        department: department.trim(),
        role,
      });

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setDepartment("Hospital Administration");
      setRole("admin");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to register administrator");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-[calc((12/375)*100vw)] lg:p-[calc((24/1920)*100vw)] bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[calc((340/375)*100vw)] sm:max-w-[calc((480/1920)*100vw)] p-[calc((16/375)*100vw)] lg:p-[calc((24/1920)*100vw)] rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] bg-surface border border-line shadow-2xl select-none animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line pb-[calc((12/375)*100vw)] lg:pb-[calc((14/1920)*100vw)] mb-[calc((12/375)*100vw)] lg:mb-[calc((14/1920)*100vw)]">
          <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
            <div className="w-[calc((36/375)*100vw)] h-[calc((36/375)*100vw)] lg:w-[calc((40/1920)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] bg-medical-blue/15 border border-medical-blue/30 text-medical-blue flex items-center justify-center shrink-0">
              <ShieldCheck className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] stroke-[2.3]" />
            </div>
            <div>
              <h3 className="font-manrope text-[calc((15/375)*100vw)] lg:text-[calc((18/1920)*100vw)] font-bold text-content-primary leading-tight">
                Direct Add Administrator
              </h3>
              <p className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-secondary mt-0.5">
                Register an approved administrator or staff member with immediate access.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-[calc((4/375)*100vw)] lg:p-[calc((6/1920)*100vw)] rounded-md text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)]" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] flex items-center gap-2">
            <AlertCircle className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[calc((10/375)*100vw)] lg:space-y-[calc((12/1920)*100vw)]">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-secondary">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled" />
              <Input
                type="text"
                placeholder="e.g. Dr. Arthur Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-[calc((30/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]"
                required
              />
            </div>
          </div>

          {/* Official Email */}
          <div className="space-y-1">
            <label className="block text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-secondary">
              Official Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled" />
              <Input
                type="email"
                placeholder="vance@doctortracker.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-[calc((30/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]"
                required
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label className="block text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-secondary">
              Department / Clinical Division
            </label>
            <div className="relative">
              <Building2 className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled" />
              <Input
                type="text"
                placeholder="e.g. Chief of Surgery / Inpatient Operations"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="pl-[calc((30/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]"
              />
            </div>
          </div>

          {/* Initial Password */}
          <div className="space-y-1">
            <label className="block text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-secondary">
              Initial Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-[calc((30/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]"
                required
              />
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-1">
            <label className="block text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-secondary">
              Administrative Permission Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`p-2.5 rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border text-left transition-all cursor-pointer ${
                  role === "admin"
                    ? "bg-medical-blue/20 border-medical-blue text-medical-blue font-semibold"
                    : "bg-surface-elevated/40 border-line text-content-secondary hover:bg-surface-elevated"
                }`}
              >
                <div className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-bold">
                  Administrator
                </div>
                <div className="text-[calc((9/375)*100vw)] lg:text-[calc((10/1920)*100vw)] text-content-muted mt-0.5">
                  Full access to doctors & patients
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("employee")}
                className={`p-2.5 rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border text-left transition-all cursor-pointer ${
                  role === "employee"
                    ? "bg-medical-sage/20 border-medical-sage text-medical-sage font-semibold"
                    : "bg-surface-elevated/40 border-line text-content-secondary hover:bg-surface-elevated"
                }`}
              >
                <div className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-bold">
                  Clinical Staff
                </div>
                <div className="text-[calc((9/375)*100vw)] lg:text-[calc((10/1920)*100vw)] text-content-muted mt-0.5">
                  View-only operational access
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] font-semibold cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] animate-spin mr-1.5" />
                  Registering...
                </>
              ) : (
                "Create & Grant Access"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

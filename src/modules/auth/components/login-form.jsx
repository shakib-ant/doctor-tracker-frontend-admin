"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
} from "lucide-react";
import { login, directAdminLogin } from "@/services/authService";
import { validateLoginForm } from "../utils/authUtils";

export function LoginForm() {
  const [email, setEmail] = useState("admin@doctortracker.com");
  const [password, setPassword] = useState("Password@123");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      window.location.href = "/";
    } catch (err) {
      setApiError(err.message || "Failed to authenticate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = () => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      directAdminLogin();
      window.location.href = "/";
    } catch (err) {
      setApiError(err.message || "Quick login failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden">
      {/* Decorative Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-medical-blue via-medical-sage to-medical-blue" />

      <div className="p-7 sm:p-9 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-medical-blue/15 border border-medical-blue/30 text-medical-blue mb-1 shadow-xs">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="font-manrope text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-xs text-content-secondary leading-relaxed max-w-xs mx-auto">
            Access hospital operations, clinical rosters, and patient records.
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <Button
          type="button"
          variant="secondary"
          size="default"
          onClick={handleQuickLogin}
          disabled={isSubmitting}
          className="w-full h-10 border-medical-sage/40 hover:border-medical-sage text-content-primary bg-surface-elevated/70 hover:bg-surface-elevated text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Zap className="w-4 h-4 text-medical-sage fill-medical-sage/20 shrink-0" />
          <span>Instant 1-Click Admin Access</span>
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-line/80 w-full" />
          <span className="bg-surface px-3 text-[11px] font-medium text-content-muted uppercase tracking-wider relative">
            Or credentials
          </span>
        </div>

        {/* Error banner */}
        {apiError && (
          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="leading-tight">{apiError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-content-secondary">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-content-disabled" />
              <Input
                type="email"
                placeholder="admin@doctortracker.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                className={`pl-9 pr-3 text-xs h-9 ${errors.email ? "border-red-500" : ""}`}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-content-secondary">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-medical-blue hover:underline inline-flex items-center gap-1 font-medium"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3 h-3" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" /> Show
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-content-disabled" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                className={`pl-9 pr-9 text-xs h-9 ${errors.password ? "border-red-500" : ""}`}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={isSubmitting}
            className="w-full text-xs font-bold h-10 mt-3 shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              <>
                Sign In with Credentials
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>

        {/* Credentials hint */}
        <div className="p-3 rounded-lg bg-surface-elevated/50 border border-line/70 text-[11px] text-content-muted space-y-0.5 font-mono text-center">
          <div>admin@doctortracker.com &bull; Password@123</div>
        </div>
      </div>
    </div>
  );
}

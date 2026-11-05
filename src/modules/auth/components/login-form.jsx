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
    <div className="w-full bg-surface border border-line rounded-[calc((14/375)*100vw)] lg:rounded-[calc((18/1920)*100vw)] shadow-2xl overflow-hidden select-none">
      {/* Decorative Gradient Bar */}
      <div className="h-[calc((4/375)*100vw)] lg:h-[calc((5/1920)*100vw)] w-full bg-gradient-to-r from-medical-blue via-medical-sage to-medical-blue" />

      <div className="p-[calc((18/375)*100vw)] lg:p-[calc((28/1920)*100vw)] space-y-[calc((14/375)*100vw)] lg:space-y-[calc((18/1920)*100vw)]">
        {/* Header */}
        <div className="text-center space-y-[calc((6/375)*100vw)] lg:space-y-[calc((8/1920)*100vw)]">
          <div className="inline-flex items-center justify-center w-[calc((42/375)*100vw)] h-[calc((42/375)*100vw)] lg:w-[calc((48/1920)*100vw)] lg:h-[calc((48/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-medical-blue/15 border border-medical-blue/30 text-medical-blue mb-1 shadow-xs">
            <Activity className="w-[calc((22/375)*100vw)] h-[calc((22/375)*100vw)] lg:w-[calc((26/1920)*100vw)] lg:h-[calc((26/1920)*100vw)] stroke-[2.5]" />
          </div>
          <h1 className="font-manrope text-[calc((18/375)*100vw)] lg:text-[calc((24/1920)*100vw)] font-extrabold text-content-primary tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-secondary leading-relaxed max-w-xs mx-auto">
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
          className="w-full h-[calc((38/375)*100vw)] lg:h-[calc((42/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] border-medical-sage/40 hover:border-medical-sage text-content-primary bg-surface-elevated/70 hover:bg-surface-elevated text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Zap className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2] text-medical-sage fill-medical-sage/20 shrink-0" />
          <span>Instant 1-Click Admin Access</span>
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-line/80 w-full" />
          <span className="bg-surface px-3 text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-medium text-content-muted uppercase tracking-wider relative">
            Or credentials
          </span>
        </div>

        {/* Error banner */}
        {apiError && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2] text-red-400 shrink-0" />
            <span className="leading-tight">{apiError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-[calc((12/375)*100vw)] lg:space-y-[calc((14/1920)*100vw)]">
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-secondary">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2] text-content-disabled" />
              <Input
                type="email"
                placeholder="admin@doctortracker.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                className={`pl-[calc((30/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] pr-3 text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((36/375)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] ${errors.email ? "border-red-500" : ""}`}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-secondary">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-medical-blue hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] stroke-[2.2]" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] stroke-[2.2]" /> Show
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2] text-content-disabled" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                className={`pl-[calc((30/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] pr-9 text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((36/375)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] ${errors.password ? "border-red-500" : ""}`}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={isSubmitting}
            className="w-full text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] font-bold h-[calc((40/375)*100vw)] lg:h-[calc((44/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] mt-2 shadow-md cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.4] animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              <>
                Sign In with Credentials
                <ArrowRight className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.4] ml-1.5" />
              </>
            )}
          </Button>
        </form>

        {/* Credentials hint */}
        <div className="p-[calc((8/375)*100vw)] lg:p-[calc((10/1920)*100vw)] rounded-lg bg-surface-elevated/50 border border-line/70 text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-content-muted space-y-0.5 font-mono text-center">
          <div>admin@doctortracker.com &bull; Password@123</div>
        </div>
      </div>
    </div>
  );
}

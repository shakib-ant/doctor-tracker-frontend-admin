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
  User,
  Building2,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { login } from "@/services/authService";
import { submitAccessRequest } from "@/services/accessService";
import { validateLoginForm } from "../utils/authUtils";

export function LoginForm() {
  const [mode, setMode] = useState("login"); // "login" | "request"

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Request Access form state
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqDepartment, setReqDepartment] = useState("");
  const [reqPassword, setReqPassword] = useState("");
  const [showReqPassword, setShowReqPassword] = useState(false);
  const [reqNote, setReqNote] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitLogin = async (e) => {
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

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!reqName.trim()) {
      setErrors({ name: "Please enter your full name" });
      return;
    }
    if (!reqEmail.trim() || !reqEmail.includes("@")) {
      setErrors({ email: "Please enter a valid official email" });
      return;
    }
    if (!reqPassword || reqPassword.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await submitAccessRequest({
        name: reqName.trim(),
        email: reqEmail.trim(),
        password: reqPassword,
        department: reqDepartment.trim() || "Clinical Staff",
        requestNote: reqNote.trim(),
      });

      setRequestSuccess(true);
      setSuccessMessage(
        res.message ||
          "Access request submitted successfully! Your account is pending Super Administrator approval."
      );
    } catch (err) {
      setApiError(err.message || "Failed to submit access request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToLogin = () => {
    setMode("login");
    setRequestSuccess(false);
    setApiError(null);
    setErrors({});
  };

  return (
    <div className="w-full bg-surface border border-line rounded-[calc((14/375)*100vw)] lg:rounded-[calc((20/1920)*100vw)] shadow-2xl overflow-hidden select-none">
      {/* Decorative Gradient Bar */}
      <div className="h-[calc((5/375)*100vw)] lg:h-[calc((6/1920)*100vw)] w-full bg-gradient-to-r from-medical-blue via-medical-sage to-medical-blue" />

      <div className="p-[calc((15/375)*100vw)] sm:p-6 lg:p-[calc((28/1920)*100vw)] space-y-[calc((12/375)*100vw)] sm:space-y-4 lg:space-y-[calc((18/1920)*100vw)]">
        {/* Mode Tabs with Fluid Calc & Zero-Wrap Labels */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setApiError(null);
              setErrors({});
            }}
            className={`py-[calc((6.5/375)*100vw)] sm:py-2.5 lg:py-[calc((9/1920)*100vw)] px-1 sm:px-3 text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center whitespace-nowrap leading-tight ${
              mode === "login"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="sm:hidden">Admin Sign In</span>
            <span className="hidden sm:inline">Administrator Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("request");
              setApiError(null);
              setErrors({});
            }}
            className={`py-[calc((6.5/375)*100vw)] sm:py-2.5 lg:py-[calc((9/1920)*100vw)] px-1 sm:px-3 text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center whitespace-nowrap leading-tight ${
              mode === "request"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="sm:hidden">Request Access</span>
            <span className="hidden sm:inline">Request Access / Join</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-1 sm:space-y-2 lg:space-y-[calc((8/1920)*100vw)]">
          <div className="inline-flex items-center justify-center w-[calc((36/375)*100vw)] h-[calc((36/375)*100vw)] sm:w-11 sm:h-11 lg:w-[calc((46/1920)*100vw)] lg:h-[calc((46/1920)*100vw)] rounded-xl bg-medical-blue/15 border border-medical-blue/30 text-medical-blue mb-0.5 shadow-xs">
            {mode === "login" ? (
              <Activity className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] sm:w-5 sm:h-5 lg:w-[calc((24/1920)*100vw)] lg:h-[calc((24/1920)*100vw)] stroke-[2.5]" />
            ) : (
              <FileCheck className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] sm:w-5 sm:h-5 lg:w-[calc((24/1920)*100vw)] lg:h-[calc((24/1920)*100vw)] stroke-[2.5]" />
            )}
          </div>
          <h1 className="font-manrope text-[calc((16/375)*100vw)] sm:text-xl lg:text-[calc((22/1920)*100vw)] font-extrabold text-content-primary tracking-tight">
            {mode === "login" ? "Administrator Sign In" : "Request Portal Membership"}
          </h1>
          <p className="text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] text-content-secondary leading-relaxed max-w-xs mx-auto">
            {mode === "login"
              ? "Access hospital operations, clinical rosters, and patient records."
              : "Submit your details for Super Administrator verification & approval."}
          </p>
        </div>

        {/* Error banner */}
        {apiError && (
          <div className="p-2.5 sm:p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] sm:w-4 sm:h-4 stroke-[2.2] text-red-400 shrink-0" />
            <span className="leading-tight">{apiError}</span>
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === "login" && (
          <>
            <form onSubmit={handleSubmitLogin} className="space-y-[calc((10/375)*100vw)] sm:space-y-3.5 lg:space-y-[calc((15/1920)*100vw)]">
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold text-content-secondary">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-[calc((10/375)*100vw)] sm:left-3.5 lg:left-[calc((13/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] stroke-[2.2] text-content-disabled" />
                  <Input
                    type="email"
                    placeholder="name@doctortracker.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    className={`pl-[calc((29/375)*100vw)] sm:pl-9 lg:pl-[calc((36/1920)*100vw)] pr-3 text-[calc((11.5/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] h-[calc((36/375)*100vw)] sm:h-10 lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl lg:rounded-[calc((10/1920)*100vw)] ${errors.email ? "border-red-500" : ""}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-[calc((10/375)*100vw)] sm:text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold text-content-secondary">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-[calc((10/375)*100vw)] sm:left-3.5 lg:left-[calc((13/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] stroke-[2.2] text-content-disabled" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    className={`pl-[calc((29/375)*100vw)] sm:pl-9 lg:pl-[calc((36/1920)*100vw)] pr-[calc((32/375)*100vw)] sm:pr-9 lg:pr-[calc((38/1920)*100vw)] text-[calc((11.5/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] h-[calc((36/375)*100vw)] sm:h-10 lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl lg:rounded-[calc((10/1920)*100vw)] ${errors.password ? "border-red-500" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[calc((10/375)*100vw)] sm:right-3 lg:right-[calc((13/1920)*100vw)] top-1/2 -translate-y-1/2 text-content-disabled hover:text-content-primary transition-colors cursor-pointer p-1 flex items-center justify-center rounded-md"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] stroke-[2]" />
                    ) : (
                      <Eye className="w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] stroke-[2]" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[calc((10/375)*100vw)] sm:text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="default"
                size="default"
                disabled={isSubmitting}
                className="w-full text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((14.5/1920)*100vw)] font-bold h-[calc((38/375)*100vw)] sm:h-11 lg:h-[calc((44/1920)*100vw)] rounded-[calc((10/375)*100vw)] sm:rounded-xl mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.45)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] sm:w-4 sm:h-4 stroke-[2.4] animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In with Credentials
                    <ArrowRight className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] sm:w-4 sm:h-4 stroke-[2.4]" />
                  </>
                )}
              </Button>
            </form>

            {/* Bottom prompt to request access */}
            <div className="pt-2 text-center border-t border-line/60">
              <p className="text-[calc((10.5/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] text-content-muted">
                Need access to hospital admin portal?{" "}
                <button
                  type="button"
                  onClick={() => setMode("request")}
                  className="font-semibold text-medical-blue hover:underline cursor-pointer ml-1"
                >
                  Request to Join
                </button>
              </p>
            </div>
          </>
        )}

        {/* REQUEST ACCESS MODE */}
        {mode === "request" && (
          <div>
            {requestSuccess ? (
              <div className="space-y-[calc((12/375)*100vw)] sm:space-y-4 lg:space-y-[calc((16/1920)*100vw)] py-2 text-center animate-in fade-in duration-200">
                <div className="inline-flex items-center justify-center w-[calc((44/375)*100vw)] h-[calc((44/375)*100vw)] sm:w-14 sm:h-14 lg:w-[calc((56/1920)*100vw)] lg:h-[calc((56/1920)*100vw)] rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-[calc((22/375)*100vw)] h-[calc((22/375)*100vw)] sm:w-7 sm:h-7 lg:w-[calc((28/1920)*100vw)] lg:h-[calc((28/1920)*100vw)] stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-manrope font-bold text-[calc((15/375)*100vw)] sm:text-lg lg:text-[calc((18/1920)*100vw)] text-content-primary">
                    Request Submitted Successfully
                  </h3>
                  <p className="text-[calc((11.5/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] text-content-secondary max-w-xs mx-auto leading-relaxed">
                    {successMessage}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-surface-elevated/70 border border-line text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((12.5/1920)*100vw)] text-content-muted leading-relaxed">
                  The Super Administrator will review your clinical credentials. You will be able to log in with your email and password as soon as permission is granted.
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={resetToLogin}
                  className="w-full h-[calc((38/375)*100vw)] sm:h-10 lg:h-[calc((42/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl font-semibold cursor-pointer"
                >
                  Return to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-[calc((9/375)*100vw)] sm:space-y-3 lg:space-y-[calc((14/1920)*100vw)]">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold text-content-secondary">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-[calc((10/375)*100vw)] sm:left-3.5 lg:left-[calc((13/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled" />
                    <Input
                      type="text"
                      placeholder="Dr. John Doe"
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      className="pl-[calc((29/375)*100vw)] sm:pl-9 lg:pl-[calc((36/1920)*100vw)] text-[calc((11.5/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] h-[calc((36/375)*100vw)] sm:h-10 lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl lg:rounded-[calc((10/1920)*100vw)]"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[calc((10/375)*100vw)] sm:text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold text-content-secondary">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-[calc((10/375)*100vw)] sm:left-3.5 lg:left-[calc((13/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled" />
                    <Input
                      type="email"
                      placeholder="doctor@hospital.org"
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      className="pl-[calc((29/375)*100vw)] sm:pl-9 lg:pl-[calc((36/1920)*100vw)] text-[calc((11.5/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] h-[calc((36/375)*100vw)] sm:h-10 lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl lg:rounded-[calc((10/1920)*100vw)]"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[calc((10/375)*100vw)] sm:text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Department / Specialty */}
                <div className="space-y-1">
                  <label className="block text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold text-content-secondary">
                    Department / Clinical Ward
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-[calc((10/375)*100vw)] sm:left-3.5 lg:left-[calc((13/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled" />
                    <Input
                      type="text"
                      placeholder="e.g. Cardiology / Inpatient Ward"
                      value={reqDepartment}
                      onChange={(e) => setReqDepartment(e.target.value)}
                      className="pl-[calc((29/375)*100vw)] sm:pl-9 lg:pl-[calc((36/1920)*100vw)] text-[calc((11.5/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] h-[calc((36/375)*100vw)] sm:h-10 lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl lg:rounded-[calc((10/1920)*100vw)]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold text-content-secondary">
                    Desired Password (Min 6 chars) *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-[calc((10/375)*100vw)] sm:left-3.5 lg:left-[calc((13/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled" />
                    <Input
                      type={showReqPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={reqPassword}
                      onChange={(e) => setReqPassword(e.target.value)}
                      className="pl-[calc((29/375)*100vw)] sm:pl-9 lg:pl-[calc((36/1920)*100vw)] pr-[calc((32/375)*100vw)] sm:pr-9 lg:pr-[calc((38/1920)*100vw)] text-[calc((11.5/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] h-[calc((36/375)*100vw)] sm:h-10 lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl lg:rounded-[calc((10/1920)*100vw)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowReqPassword(!showReqPassword)}
                      className="absolute right-[calc((10/375)*100vw)] sm:right-3 lg:right-[calc((13/1920)*100vw)] top-1/2 -translate-y-1/2 text-content-disabled hover:text-content-primary transition-colors cursor-pointer p-1 flex items-center justify-center rounded-md"
                      aria-label={showReqPassword ? "Hide password" : "Show password"}
                    >
                      {showReqPassword ? (
                        <EyeOff className="w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] stroke-[2]" />
                      ) : (
                        <Eye className="w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] stroke-[2]" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[calc((10/375)*100vw)] sm:text-xs text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Reason Note */}
                <div className="space-y-1">
                  <label className="block text-[calc((11/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13.5/1920)*100vw)] font-semibold text-content-secondary">
                    Reason / Administrative Note
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Assigned to morning census triage"
                    value={reqNote}
                    onChange={(e) => setReqNote(e.target.value)}
                    className="px-3 text-[calc((11.5/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] h-[calc((36/375)*100vw)] sm:h-10 lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-xl lg:rounded-[calc((10/1920)*100vw)]"
                  />
                </div>

                {/* Submit Request Button */}
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSubmitting}
                  className="w-full text-[calc((11.5/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14.5/1920)*100vw)] font-bold h-[calc((38/375)*100vw)] sm:h-11 lg:h-[calc((44/1920)*100vw)] rounded-[calc((10/375)*100vw)] sm:rounded-xl mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 animate-spin shrink-0" />
                      <span className="sm:hidden">Submitting...</span>
                      <span className="hidden sm:inline">Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden whitespace-nowrap">Submit Access Request</span>
                      <span className="hidden sm:inline whitespace-nowrap">Submit Request to Super Administrator</span>
                      <ArrowRight className="w-[calc((13.5/375)*100vw)] h-[calc((13.5/375)*100vw)] sm:w-4 sm:h-4 lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] shrink-0" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Back link */}
            <div className="pt-2 text-center border-t border-line/60">
              <button
                type="button"
                onClick={resetToLogin}
                className="text-[calc((10.5/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((13/1920)*100vw)] font-medium text-content-muted hover:text-content-primary hover:underline cursor-pointer"
              >
                Already have an approved account? Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

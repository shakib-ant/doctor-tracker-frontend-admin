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
    <div className="w-full bg-surface border border-line rounded-[calc((16/375)*100vw)] lg:rounded-[calc((20/1920)*100vw)] shadow-2xl overflow-hidden select-none">
      {/* Decorative Gradient Bar */}
      <div className="h-[calc((6/375)*100vw)] lg:h-[calc((7/1920)*100vw)] w-full bg-gradient-to-r from-medical-blue via-medical-sage to-medical-blue" />

      <div className="p-[calc((20/375)*100vw)] lg:p-[calc((31/1920)*100vw)] space-y-[calc((16/375)*100vw)] lg:space-y-[calc((20/1920)*100vw)]">
        {/* Mode Tabs with Tablet Protection & Mobile Text 2px smaller */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setApiError(null);
              setErrors({});
            }}
            className={`py-2 sm:py-2.5 lg:py-[calc((11/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold rounded-lg transition-all cursor-pointer ${
              mode === "login"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Administrator Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("request");
              setApiError(null);
              setErrors({});
            }}
            className={`py-2 sm:py-2.5 lg:py-[calc((11/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold rounded-lg transition-all cursor-pointer ${
              mode === "request"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Request Access / Join
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-2.5 lg:space-y-[calc((10/1920)*100vw)]">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-[calc((50/1920)*100vw)] lg:h-[calc((50/1920)*100vw)] rounded-xl lg:rounded-[calc((14/1920)*100vw)] bg-medical-blue/15 border border-medical-blue/30 text-medical-blue mb-1 shadow-xs">
            {mode === "login" ? (
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[calc((28/1920)*100vw)] lg:h-[calc((28/1920)*100vw)] stroke-[2.5]" />
            ) : (
              <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[calc((28/1920)*100vw)] lg:h-[calc((28/1920)*100vw)] stroke-[2.5]" />
            )}
          </div>
          <h1 className="font-manrope text-[calc((18/375)*100vw)] sm:text-xl lg:text-[calc((24/1920)*100vw)] font-extrabold text-content-primary tracking-tight">
            {mode === "login" ? "Administrator Sign In" : "Request Portal Membership"}
          </h1>
          <p className="text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] text-content-secondary leading-relaxed max-w-xs mx-auto">
            {mode === "login"
              ? "Access hospital operations, clinical rosters, and patient records."
              : "Submit your details for Super Administrator verification & approval."}
          </p>
        </div>

        {/* Error banner */}
        {apiError && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] text-red-400 shrink-0" />
            <span className="leading-tight">{apiError}</span>
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === "login" && (
          <>
            <form onSubmit={handleSubmitLogin} className="space-y-3 sm:space-y-4 lg:space-y-[calc((16/1920)*100vw)]">
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] text-content-disabled" />
                  <Input
                    type="email"
                    placeholder="name@doctortracker.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    className={`pl-9 sm:pl-10 pr-3 text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] h-10 sm:h-11 lg:h-[calc((42/1920)*100vw)] rounded-xl ${errors.email ? "border-red-500" : ""}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-[calc((11/375)*100vw)] sm:text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[calc((11/375)*100vw)] sm:text-xs text-medical-blue hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" /> Show
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] text-content-disabled" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    className={`pl-9 sm:pl-10 pr-9 text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] h-10 sm:h-11 lg:h-[calc((42/1920)*100vw)] rounded-xl ${errors.password ? "border-red-500" : ""}`}
                    autoComplete="current-password"
                  />
                </div>
                {errors.password && (
                  <p className="text-[calc((11/375)*100vw)] sm:text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="default"
                size="default"
                disabled={isSubmitting}
                className="w-full text-[calc((13/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] font-bold h-11 sm:h-12 lg:h-[calc((46/1920)*100vw)] rounded-xl mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.45)] active:scale-[0.99] transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4] animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In with Credentials
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                  </>
                )}
              </Button>
            </form>

            {/* Bottom prompt to request access */}
            <div className="pt-2 text-center border-t border-line/60">
              <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted">
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
              <div className="space-y-[calc((14/375)*100vw)] lg:space-y-[calc((18/1920)*100vw)] py-2 text-center animate-in fade-in duration-200">
                <div className="inline-flex items-center justify-center w-[calc((50/375)*100vw)] h-[calc((50/375)*100vw)] lg:w-[calc((60/1920)*100vw)] lg:h-[calc((60/1920)*100vw)] rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-[calc((26/375)*100vw)] h-[calc((26/375)*100vw)] lg:w-[calc((30/1920)*100vw)] lg:h-[calc((30/1920)*100vw)] stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-manrope font-bold text-[calc((17/375)*100vw)] lg:text-[calc((19/1920)*100vw)] text-content-primary">
                    Request Submitted Successfully
                  </h3>
                  <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary max-w-xs mx-auto leading-relaxed">
                    {successMessage}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface-elevated/70 border border-line text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted leading-relaxed">
                  The Super Administrator will review your clinical credentials. You will be able to log in with your email and password as soon as permission is granted.
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={resetToLogin}
                  className="w-full h-[calc((40/375)*100vw)] lg:h-[calc((44/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] font-semibold cursor-pointer"
                >
                  Return to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-[calc((12/375)*100vw)] lg:space-y-[calc((14/1920)*100vw)]">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-[calc((12/375)*100vw)] lg:left-[calc((14/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] lg:w-[calc((19/1920)*100vw)] lg:h-[calc((19/1920)*100vw)] text-content-disabled" />
                    <Input
                      type="text"
                      placeholder="Dr. John Doe"
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      className="pl-[calc((33/375)*100vw)] lg:pl-[calc((39/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] h-[calc((38/375)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)]"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-content-disabled" />
                    <Input
                      type="email"
                      placeholder="doctor@hospital.org"
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      className="pl-9 sm:pl-10 text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] h-10 sm:h-11 lg:h-[calc((40/1920)*100vw)] rounded-xl"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[calc((11/375)*100vw)] sm:text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Department / Specialty */}
                <div className="space-y-1">
                  <label className="block text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary">
                    Department / Clinical Ward
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-content-disabled" />
                    <Input
                      type="text"
                      placeholder="e.g. Cardiology / Inpatient Ward"
                      value={reqDepartment}
                      onChange={(e) => setReqDepartment(e.target.value)}
                      className="pl-9 sm:pl-10 text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] h-10 sm:h-11 lg:h-[calc((40/1920)*100vw)] rounded-xl"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary">
                    Desired Password (Min 6 chars) *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-content-disabled" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={reqPassword}
                      onChange={(e) => setReqPassword(e.target.value)}
                      className="pl-9 sm:pl-10 text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] h-10 sm:h-11 lg:h-[calc((40/1920)*100vw)] rounded-xl"
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[calc((11/375)*100vw)] sm:text-xs text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Reason Note */}
                <div className="space-y-1">
                  <label className="block text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary">
                    Reason / Administrative Note
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Assigned to morning census triage"
                    value={reqNote}
                    onChange={(e) => setReqNote(e.target.value)}
                    className="text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] h-10 sm:h-11 lg:h-[calc((40/1920)*100vw)] rounded-xl"
                  />
                </div>

                {/* Submit Request Button */}
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSubmitting}
                  className="w-full text-[calc((13/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] font-bold h-11 sm:h-12 lg:h-[calc((44/1920)*100vw)] rounded-xl mt-2 shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Submit Request to Super Administrator
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
                className="text-[calc((12/375)*100vw)] sm:text-xs md:text-sm lg:text-[calc((14/1920)*100vw)] font-medium text-content-muted hover:text-content-primary hover:underline cursor-pointer"
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

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { login } from "@/services/authService";
import { validateLoginForm } from "../utils/authUtils";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@doctortracker.com");
  const [password, setPassword] = useState("Password@123");
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
      router.push("/");
    } catch (err) {
      setApiError(err.message || "Failed to authenticate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-surface border border-line rounded-xl shadow-2xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-medical-blue/15 border border-medical-blue/30 text-medical-blue mb-1">
          <Activity className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h1 className="font-manrope text-2xl font-bold text-content-primary tracking-tight">
          Doctor Tracker Portal
        </h1>
        <p className="text-xs text-content-secondary">
          Enter administrative credentials to access clinical records.
        </p>
      </div>

      {/* Error alert */}
      {apiError && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-content-secondary mb-1.5">
            Admin Email Address
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
              className={`pl-9 text-xs h-10 ${errors.email ? "border-red-500" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-content-secondary mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-content-disabled" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              className={`pl-9 text-xs h-10 ${errors.password ? "border-red-500" : ""}`}
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={isSubmitting}
          className="w-full text-xs font-semibold h-10 mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Verifying Authorization...
            </>
          ) : (
            "Authenticate & Sign In"
          )}
        </Button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="p-3 rounded-lg bg-surface-elevated border border-line text-[11px] text-content-muted space-y-1">
        <div className="font-semibold text-content-secondary">
          Initial Admin Account
        </div>
        <div className="flex justify-between">
          <span>Email: <code className="text-medical-blue font-mono">admin@doctortracker.com</code></span>
        </div>
        <div className="flex justify-between">
          <span>Password: <code className="text-medical-sage font-mono">Password@123</code></span>
        </div>
      </div>
    </div>
  );
}


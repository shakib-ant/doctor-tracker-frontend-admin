"use client";

import React from "react";
import { LoginForm } from "./components/login-form";
import { Stethoscope, ShieldCheck, HeartPulse } from "lucide-react";

export function LoginView() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 md:p-8 bg-canvas">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-medical-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-medical-sage/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Banner */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-3 select-none">
        <div className="w-9 h-9 rounded-xl bg-medical-blue/15 border border-medical-blue/30 text-medical-blue flex items-center justify-center shadow-xs">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-manrope font-bold text-base tracking-tight text-content-primary">
            Doctor Tracker
          </span>
          <span className="text-[11px] font-medium text-content-secondary tracking-wide uppercase">
            Clinical Administration
          </span>
        </div>
      </div>

      {/* Security Status Badge (Top Right) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-surface/80 text-xs text-content-secondary select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-medical-sage" />
        <span>Secure Healthcare Portal</span>
      </div>

      {/* Centered Login Form Card */}
      <div className="relative z-10 w-full max-w-md my-auto py-12">
        <LoginForm />
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-4 inset-x-0 text-center text-xs text-content-muted select-none flex items-center justify-center gap-2">
        <HeartPulse className="w-3.5 h-3.5 text-medical-blue" />
        <span>Doctor Tracker &bull; Hospital Information System v1.0.0</span>
      </div>
    </div>
  );
}

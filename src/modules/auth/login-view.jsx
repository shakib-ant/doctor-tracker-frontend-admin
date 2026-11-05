"use client";

import React from "react";
import { LoginForm } from "./components/login-form";
import { Stethoscope, ShieldCheck, HeartPulse } from "lucide-react";

export function LoginView() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-[calc((14/375)*100vw)] sm:p-6 lg:p-[calc((30/1920)*100vw)] bg-canvas overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[calc((280/375)*100vw)] h-[calc((280/375)*100vw)] lg:w-[calc((500/1920)*100vw)] lg:h-[calc((500/1920)*100vw)] bg-medical-blue/10 rounded-full blur-[90px] lg:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[calc((240/375)*100vw)] h-[calc((240/375)*100vw)] lg:w-[calc((450/1920)*100vw)] lg:h-[calc((450/1920)*100vw)] bg-medical-sage/10 rounded-full blur-[90px] lg:blur-[120px] pointer-events-none" />

      {/* Top Brand Banner */}
      <div className="absolute top-[calc((12/375)*100vw)] left-[calc((14/375)*100vw)] sm:top-5 sm:left-6 lg:top-[calc((24/1920)*100vw)] lg:left-[calc((32/1920)*100vw)] flex items-center gap-[calc((10/375)*100vw)] sm:gap-3 lg:gap-[calc((12/1920)*100vw)] select-none">
        <div className="w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] sm:w-9 sm:h-9 lg:w-[calc((38/1920)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-lg lg:rounded-[calc((10/1920)*100vw)] bg-medical-blue/15 border border-medical-blue/30 text-medical-blue flex items-center justify-center shadow-xs shrink-0">
          <Stethoscope className="w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] sm:w-5 sm:h-5 lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <span className="font-manrope font-bold text-[calc((13.5/375)*100vw)] sm:text-base lg:text-[calc((17/1920)*100vw)] tracking-tight text-content-primary leading-tight">
            Doctor Tracker
          </span>
          <span className="text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((12/1920)*100vw)] font-medium text-content-secondary tracking-wider uppercase leading-tight mt-0.5">
            Clinical Administration
          </span>
        </div>
      </div>

      {/* Security Status Badge (Top Right) */}
      <div className="absolute top-[calc((12/375)*100vw)] right-[calc((14/375)*100vw)] sm:top-5 sm:right-6 lg:top-[calc((24/1920)*100vw)] lg:right-[calc((32/1920)*100vw)] hidden sm:flex items-center gap-2 lg:gap-[calc((10/1920)*100vw)] px-3 lg:px-[calc((14/1920)*100vw)] py-1.5 lg:py-[calc((8/1920)*100vw)] rounded-full border border-line bg-surface/80 text-xs lg:text-[calc((13/1920)*100vw)] text-content-secondary select-none">
        <ShieldCheck className="w-4 h-4 lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2] text-medical-sage" />
        <span>Secure Healthcare Portal</span>
      </div>

      {/* Centered Login Form Card */}
      <div className="relative z-10 w-full max-w-[calc((336/375)*100vw)] sm:max-w-[420px] lg:max-w-[calc((420/1920)*100vw)] my-auto py-[calc((20/375)*100vw)] sm:py-6 lg:py-[calc((36/1920)*100vw)]">
        <LoginForm />
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-[calc((12/375)*100vw)] sm:bottom-4 lg:bottom-[calc((18/1920)*100vw)] inset-x-0 text-center text-[calc((9.5/375)*100vw)] sm:text-xs lg:text-[calc((12/1920)*100vw)] text-content-muted select-none flex items-center justify-center gap-[calc((6/375)*100vw)] sm:gap-2">
        <HeartPulse className="w-[calc((11.5/375)*100vw)] h-[calc((11.5/375)*100vw)] sm:w-3.5 sm:h-3.5 lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] stroke-[2.2] text-medical-blue shrink-0" />
        <span className="leading-tight">Doctor Tracker &bull; Hospital Information System v1.0.0</span>
      </div>
    </div>
  );
}

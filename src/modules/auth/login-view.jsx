"use client";

import React from "react";
import { LoginForm } from "./components/login-form";
import { Stethoscope, ShieldCheck, HeartPulse } from "lucide-react";

export function LoginView() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-[calc((18/375)*100vw)] lg:p-[calc((35/1920)*100vw)] bg-canvas overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[calc((320/375)*100vw)] h-[calc((320/375)*100vw)] lg:w-[calc((500/1920)*100vw)] lg:h-[calc((500/1920)*100vw)] bg-medical-blue/10 rounded-full blur-[100px] lg:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[calc((280/375)*100vw)] h-[calc((280/375)*100vw)] lg:w-[calc((450/1920)*100vw)] lg:h-[calc((450/1920)*100vw)] bg-medical-sage/10 rounded-full blur-[100px] lg:blur-[120px] pointer-events-none" />

      {/* Top Brand Banner */}
      <div className="absolute top-[calc((18/375)*100vw)] left-[calc((18/375)*100vw)] lg:top-[calc((26/1920)*100vw)] lg:left-[calc((34/1920)*100vw)] flex items-center gap-[calc((12/375)*100vw)] lg:gap-[calc((14/1920)*100vw)] select-none">
        <div className="w-[calc((36/375)*100vw)] h-[calc((36/375)*100vw)] lg:w-[calc((40/1920)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-medical-blue/15 border border-medical-blue/30 text-medical-blue flex items-center justify-center shadow-xs shrink-0">
          <Stethoscope className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <span className="font-manrope font-bold text-[calc((15/375)*100vw)] lg:text-[calc((18/1920)*100vw)] tracking-tight text-content-primary leading-tight">
            Doctor Tracker
          </span>
          <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary tracking-wider uppercase leading-tight mt-0.5">
            Clinical Administration
          </span>
        </div>
      </div>

      {/* Security Status Badge (Top Right) */}
      <div className="absolute top-[calc((18/375)*100vw)] right-[calc((18/375)*100vw)] lg:top-[calc((26/1920)*100vw)] lg:right-[calc((34/1920)*100vw)] hidden sm:flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((7/375)*100vw)] lg:py-[calc((8/1920)*100vw)] rounded-full border border-line bg-surface/80 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary select-none">
        <ShieldCheck className="w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] lg:w-[calc((19/1920)*100vw)] lg:h-[calc((19/1920)*100vw)] stroke-[2.2] text-medical-sage" />
        <span>Secure Healthcare Portal</span>
      </div>

      {/* Centered Login Form Card */}
      <div className="relative z-10 w-full max-w-[calc((365/375)*100vw)] lg:max-w-[calc((365/1920)*100vw)] my-auto py-[calc((35/375)*100vw)] lg:py-[calc((51/1920)*100vw)]">
        <LoginForm />
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-[calc((16/375)*100vw)] lg:bottom-[calc((18/1920)*100vw)] inset-x-0 text-center text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted select-none flex items-center justify-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
        <HeartPulse className="w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] lg:w-[calc((19/1920)*100vw)] lg:h-[calc((19/1920)*100vw)] stroke-[2.2] text-medical-blue" />
        <span>Doctor Tracker &bull; Hospital Information System v1.0.0</span>
      </div>
    </div>
  );
}

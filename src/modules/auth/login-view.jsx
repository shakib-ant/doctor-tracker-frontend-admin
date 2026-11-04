"use client";

import React from "react";
import { LoginForm } from "./components/login-form";

export function LoginView() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-canvas">
      <LoginForm />
    </div>
  );
}


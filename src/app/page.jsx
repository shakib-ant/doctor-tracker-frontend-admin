"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardView } from "@/modules/dashboard/dashboard-view";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Healthcare Operations">
      <DashboardView />
    </DashboardLayout>
  );
}

"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AccessView } from "@/modules/access/access-view";

export default function AccessPage() {
  return (
    <DashboardLayout title="Access Control & Permissions">
      <AccessView />
    </DashboardLayout>
  );
}


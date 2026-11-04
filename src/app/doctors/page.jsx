"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DoctorsView } from "@/modules/doctors/doctors-view";

export default function DoctorsPage() {
  return (
    <DashboardLayout title="Doctor Management">
      <DoctorsView />
    </DashboardLayout>
  );
}


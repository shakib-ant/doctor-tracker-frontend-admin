"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PatientsView } from "@/modules/patients/patients-view";

export default function PatientsPage() {
  return (
    <DashboardLayout title="Patient Management">
      <PatientsView />
    </DashboardLayout>
  );
}


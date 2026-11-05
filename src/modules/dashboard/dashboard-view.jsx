"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Stethoscope,
  Users,
  UserCheck,
  Activity,
  RefreshCw,
  Plus,
  ShieldAlert,
  Hospital,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { fetchDashboardAnalytics } from "@/services/analyticsService";
import { StatCard } from "./components/stat-card";
import { PatientsPerDoctorChart } from "./components/patients-per-doctor-chart";
import { AdmissionsTrendChart } from "./components/admissions-trend-chart";
import { ConditionDistributionCard } from "./components/condition-distribution-card";

export function DashboardView() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchDashboardAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      console.error("Dashboard analytics load error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const summary = analytics?.summary || {
    totalDoctors: 0,
    activeDoctors: 0,
    totalPatients: 0,
    activePatients: 0,
    averagePatientsPerDoctor: 0,
  };

  // Clinical triage calculation
  const criticalCount =
    analytics?.statusDistribution?.find((s) => s.status === "Critical")?.count || 0;
  const observationCount =
    analytics?.statusDistribution?.find((s) => s.status === "Under Observation")?.count || 0;
  const doctorDutyPct =
    summary.totalDoctors > 0
      ? Math.round((summary.activeDoctors / summary.totalDoctors) * 100)
      : 0;

  return (
    <div className="space-y-[calc((18/375)*100vw)] lg:space-y-[calc((26/1920)*100vw)] w-full max-w-full">
      {/* Clinical Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[calc((14/375)*100vw)] lg:gap-[calc((18/1920)*100vw)] pb-2 border-b border-line/60">
        <div>
          <h2 className="font-manrope text-[calc((22/375)*100vw)] lg:text-[calc((30/1920)*100vw)] font-extrabold tracking-tight text-content-primary">
            Clinical Operations & Telemetry
          </h2>
          <p className="text-[calc((14/375)*100vw)] lg:text-[calc((16/1920)*100vw)] text-content-secondary mt-1 leading-relaxed">
            Live hospital metrics: specialist duty roster, inpatient census, and epidemiological triage distribution.
          </p>
        </div>
        <div className="flex items-center gap-[calc((12/375)*100vw)] lg:gap-[calc((14/1920)*100vw)]">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
          >
            <RefreshCw
              className={`w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            Synchronize
          </Button>
          <Link href="/doctors">
            <Button
              variant="default"
              size="sm"
              className="h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
            >
              <Stethoscope className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)]" />
              Manage Specialists
            </Button>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-[calc((14/375)*100vw)] lg:p-[calc((18/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-red-950/40 border border-red-800 text-red-200 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
            <ShieldAlert className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-[calc((10/375)*100vw)]">
            {error.includes("401") && (
              <Link href="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] bg-red-700 hover:bg-red-600 text-white cursor-pointer"
                >
                  Log In
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] border-red-700 text-red-200 hover:bg-red-900/30 cursor-pointer"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* 4 Telemetry Stat Cards with Direct Clinical Purpose */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[calc((14/375)*100vw)] lg:gap-[calc((22/1920)*100vw)] w-full">
        <StatCard
          title="Active Medical Staff"
          value={summary.totalDoctors}
          tag={`${doctorDutyPct}% On Duty`}
          subtitle={`${summary.activeDoctors} specialists available for consult`}
          icon={Stethoscope}
          badgeColor="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Monitored Admissions"
          value={summary.totalPatients}
          tag={`${summary.activePatients} In Treatment`}
          subtitle="Real-time inpatient census across wards"
          icon={Users}
          badgeColor="sage"
          isLoading={isLoading}
        />
        <StatCard
          title="Physician Workload Ratio"
          value={summary.averagePatientsPerDoctor}
          tag="Balanced"
          subtitle="Mean patient roster per attending doctor"
          icon={UserCheck}
          badgeColor="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Monitored Conditions"
          value={analytics?.conditionDistribution?.length || 0}
          tag="Triage Active"
          subtitle="Distinct disease pathologies undergoing care"
          icon={Activity}
          badgeColor="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Balanced 2-Column Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[calc((16/375)*100vw)] lg:gap-[calc((26/1920)*100vw)] w-full items-stretch">
        <PatientsPerDoctorChart
          data={analytics?.patientsPerDoctor || []}
          isLoading={isLoading}
        />
        <AdmissionsTrendChart
          data={analytics?.dateBasedStats || []}
          isLoading={isLoading}
        />
      </div>

      {/* Condition & Capacity Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[calc((16/375)*100vw)] lg:gap-[calc((26/1920)*100vw)] w-full">
        <div className="lg:col-span-2">
          <ConditionDistributionCard
            conditions={analytics?.conditionDistribution || []}
            statuses={analytics?.statusDistribution || []}
            totalPatients={summary.totalPatients}
            isLoading={isLoading}
          />
        </div>

        {/* Clinical Department & Ward Capacity Telemetry */}
        <Card className="flex flex-col justify-between transition-colors duration-200 hover:border-medical-blue/40">
          <CardHeader className="p-[calc((16/375)*100vw)] lg:p-[calc((27/1920)*100vw)] pb-3 border-b border-line/60">
            <div className="space-y-1">
              <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
                <div className="p-1.5 rounded-md bg-medical-blue/15 text-medical-blue shrink-0">
                  <Hospital className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)]" />
                </div>
                <CardTitle className="text-[calc((18/375)*100vw)] lg:text-[calc((22/1920)*100vw)]">Hospital Ward Capacity</CardTitle>
              </div>
              <CardDescription className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)]">
                Real-time operational readiness and triage alert threshold
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-[calc((16/375)*100vw)] lg:p-[calc((27/1920)*100vw)] pt-4 flex-1 flex flex-col justify-between space-y-[calc((14/375)*100vw)] lg:space-y-[calc((18/1920)*100vw)]">
            <div className="space-y-[calc((12/375)*100vw)] lg:space-y-[calc((14/1920)*100vw)]">
              {/* Critical Triage Alert Pill */}
              <div className="p-[calc((12/375)*100vw)] lg:p-[calc((14/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-red-950/30 border border-red-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-red-400 shrink-0" />
                  <div>
                    <span className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold text-red-200 block">
                      Critical & High-Dependency
                    </span>
                    <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-red-300/80">
                      Requires intensive monitoring
                    </span>
                  </div>
                </div>
                <span className="text-[calc((15/375)*100vw)] lg:text-[calc((16/1920)*100vw)] font-extrabold text-red-300 font-manrope px-2 py-0.5 rounded-md bg-red-900/40 border border-red-700/60">
                  {criticalCount}
                </span>
              </div>

              {/* Observation Load */}
              <div className="p-[calc((12/375)*100vw)] lg:p-[calc((14/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-amber-950/25 border border-amber-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold text-amber-200 block">
                      Under Clinical Observation
                    </span>
                    <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-amber-300/80">
                      Pending discharge or re-evaluation
                    </span>
                  </div>
                </div>
                <span className="text-[calc((15/375)*100vw)] lg:text-[calc((16/1920)*100vw)] font-extrabold text-amber-300 font-manrope px-2 py-0.5 rounded-md bg-amber-900/40 border border-amber-700/60">
                  {observationCount}
                </span>
              </div>

              {/* Department Readiness */}
              <div className="p-[calc((12/375)*100vw)] lg:p-[calc((14/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-surface-elevated/40 border border-line/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-[calc((17/375)*100vw)] h-[calc((17/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-medical-sage shrink-0" />
                  <div>
                    <span className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold text-content-primary block">
                      Active Clinical Specializations
                    </span>
                    <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary">
                      Full departmental roster coverage
                    </span>
                  </div>
                </div>
                <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-bold text-medical-sage px-2 py-0.5 rounded-md bg-medical-sage/15 border border-medical-sage/30">
                  15 / 15 Depts
                </span>
              </div>
            </div>

            {/* Direct Clinical Action Buttons - Fully Calc Styled */}
            <div className="space-y-[calc((10/375)*100vw)] lg:space-y-[calc((12/1920)*100vw)] pt-[calc((12/375)*100vw)] lg:pt-[calc((14/1920)*100vw)] border-t border-line/60">
              <Link href="/patients" className="block">
                <Button
                  variant="default"
                  className="w-full justify-center gap-[calc((10/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] h-[calc((40/375)*100vw)] lg:h-[calc((44/1920)*100vw)] px-[calc((16/375)*100vw)] lg:px-[calc((18/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold cursor-pointer shadow-xs"
                >
                  <Plus className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] shrink-0" />
                  <span>Admit New Patient to Ward</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

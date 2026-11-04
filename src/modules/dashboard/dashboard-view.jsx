"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Stethoscope, Users, UserCheck, Activity, RefreshCw, ArrowRight, ShieldAlert } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h2 className="font-manrope text-2xl md:text-3xl font-extrabold tracking-tight text-content-primary">
            Healthcare Operations Overview
          </h2>
          <p className="text-xs md:text-sm text-content-secondary mt-1 leading-relaxed">
            Real-time analytics for medical staff roster and patient tracking across clinical chambers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
          <Link href="/doctors">
            <Button variant="default" size="sm">
              Manage Doctors
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2">
            {error.includes("401") && (
              <Link href="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="h-7 text-xs bg-red-700 hover:bg-red-600 text-white"
                >
                  Log In
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="h-7 text-xs border-red-700 text-red-200 hover:bg-red-900/30"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* 4 Stat Cards with Uniform Gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Doctors"
          value={summary.totalDoctors}
          subtitle={`${summary.activeDoctors} active in roster`}
          icon={Stethoscope}
          badgeColor="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Patients"
          value={summary.totalPatients}
          subtitle={`${summary.activePatients} currently in care`}
          icon={Users}
          badgeColor="sage"
          isLoading={isLoading}
        />
        <StatCard
          title="Avg. Patients / Doctor"
          value={summary.averagePatientsPerDoctor}
          subtitle="Workload balance index"
          icon={UserCheck}
          badgeColor="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Active Diagnoses"
          value={analytics?.conditionDistribution?.length || 0}
          subtitle="Distinct medical conditions"
          icon={Activity}
          badgeColor="sage"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Grid with Uniform Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PatientsPerDoctorChart
          data={analytics?.patientsPerDoctor || []}
          isLoading={isLoading}
        />
        <AdmissionsTrendChart
          data={analytics?.dateBasedStats || []}
          isLoading={isLoading}
        />
      </div>

      {/* Condition & Quick Actions Grid with Matching Card Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ConditionDistributionCard
            conditions={analytics?.conditionDistribution || []}
            statuses={analytics?.statusDistribution || []}
            totalPatients={summary.totalPatients}
            isLoading={isLoading}
          />
        </div>

        <Card className="flex flex-col justify-between">
          <CardHeader className="p-6 pb-4 border-b border-line/60">
            <div className="space-y-1">
              <CardTitle>Administrative Actions</CardTitle>
              <CardDescription>
                Direct access to specialist rosters and patient admission records
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-5 flex-1 flex flex-col justify-between space-y-5">
            <p className="text-xs text-content-secondary leading-relaxed">
              Manage clinical staff assignments, track patient admissions, or use multi-criteria search and date filters to locate hospital records.
            </p>
            <div className="space-y-2.5 pt-2">
              <Link href="/doctors" className="block">
                <Button variant="secondary" size="default" className="w-full justify-between">
                  <span>Open Doctor Registry</span>
                  <ArrowRight className="w-3.5 h-3.5 text-medical-blue" />
                </Button>
              </Link>
              <Link href="/patients" className="block">
                <Button variant="default" size="default" className="w-full justify-between">
                  <span>Open Patient Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

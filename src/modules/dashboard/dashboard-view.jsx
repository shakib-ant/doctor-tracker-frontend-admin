"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope, Users, UserCheck, Activity, RefreshCw, ArrowRight } from "lucide-react";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-2 border-b border-line/50">
        <div>
          <h2 className="font-manrope text-2xl md:text-3xl font-extrabold tracking-tight text-content-primary">
            Healthcare Operations Overview
          </h2>
          <p className="text-xs md:text-sm text-content-secondary mt-1.5 leading-relaxed">
            Real-time analytics for medical staff roster and patient tracking across hospital chambers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="h-9 px-3.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
          <Link href="/doctors">
            <Button variant="default" size="sm" className="h-9 px-4">
              Manage Doctors
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="h-7 text-xs border-red-700 text-red-200"
          >
            Retry
          </Button>
        </div>
      )}

      {/* 4 Stat Cards with Generous Breathing Room */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
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

      {/* Charts Grid with Generous Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">
        <PatientsPerDoctorChart
          data={analytics?.patientsPerDoctor || []}
          isLoading={isLoading}
        />
        <AdmissionsTrendChart
          data={analytics?.dateBasedStats || []}
          isLoading={isLoading}
        />
      </div>

      {/* Condition & Status Breakdown with Generous Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
        <div className="lg:col-span-2">
          <ConditionDistributionCard
            conditions={analytics?.conditionDistribution || []}
            statuses={analytics?.statusDistribution || []}
            totalPatients={summary.totalPatients}
            isLoading={isLoading}
          />
        </div>
        <div className="flex flex-col justify-between p-6 rounded-xl bg-surface border border-line shadow-sm space-y-6">
          <div className="space-y-3">
            <h3 className="font-manrope text-base font-bold text-content-primary">
              Administrative Quick Actions
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Access the clinical specialist registry or review patient charts with complete multi-criteria search, date filters, and nested patient assignment.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link href="/doctors" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-between h-9 text-xs">
                <span>Doctor Registry</span>
                <ArrowRight className="w-3.5 h-3.5 text-medical-blue" />
              </Button>
            </Link>
            <Link href="/patients" className="block">
              <Button variant="default" size="sm" className="w-full justify-between h-9 text-xs">
                <span>Patient Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { CONDITION_COLORS, calculatePercentage } from "../utils/dashboardUtils";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  Active: {
    dot: "bg-medical-blue",
    box: "hover:border-medical-blue/60",
    badge: "In Treatment",
  },
  Critical: {
    dot: "bg-red-400 animate-pulse",
    box: "border-red-800/70 bg-red-950/30 hover:border-red-700 text-red-200",
    badge: "High Priority",
  },
  "Under Observation": {
    dot: "bg-amber-400",
    box: "border-amber-800/70 bg-amber-950/30 hover:border-amber-700 text-amber-200",
    badge: "Monitoring",
  },
  Recovered: {
    dot: "bg-medical-sage",
    box: "hover:border-medical-sage/60",
    badge: "Discharged",
  },
};

export function ConditionDistributionCard({
  conditions = [],
  statuses = [],
  totalPatients = 0,
  isLoading = false,
}) {
  return (
    <Card className="h-full flex flex-col transition-colors duration-200 hover:border-medical-blue/40">
      <CardHeader className="p-6 pb-4 border-b border-line/60">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-medical-blue/15 text-medical-blue">
              <Activity className="w-4 h-4" />
            </div>
            Clinical Condition Distribution
          </CardTitle>
          <CardDescription>
            Categorized breakdown of registered diagnoses across patient records
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-6 pt-5">
        {isLoading ? (
          <div className="space-y-3.5 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : conditions.length === 0 ? (
          <div className="py-8 text-center text-xs text-content-muted">
            No patient conditions recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {conditions.map((item, idx) => {
              const pct = calculatePercentage(item.count, totalPatients);
              const color = CONDITION_COLORS[idx % CONDITION_COLORS.length];
              return (
                <div key={item.condition} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-content-primary font-medium">
                      {item.condition}
                    </span>
                    <span className="text-content-secondary text-[11px] font-semibold">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden border border-line/60">
                    <div
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(pct, 4)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Semantic Status Caseload */}
        {statuses.length > 0 && (
          <div className="pt-4 border-t border-line/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-content-muted block mb-2.5">
              Care Caseload & Triage Urgency
            </span>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => {
                const conf = STATUS_CONFIG[s.status] || {
                  dot: "bg-content-muted",
                  box: "",
                };
                return (
                  <div
                    key={s.status}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs bg-surface-elevated border border-line flex items-center gap-2 transition-colors",
                      conf.box
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full shrink-0 shadow-xs", conf.dot)} />
                    <span className="text-content-secondary font-medium">{s.status}:</span>
                    <span className="font-bold text-content-primary">{s.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
      <CardHeader className="p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pb-3 border-b border-line/60">
        <div className="space-y-1">
          <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
            <div className="p-1.5 rounded-md bg-medical-blue/15 text-medical-blue shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <CardTitle className="text-[calc((16/375)*100vw)] lg:text-[calc((20/1920)*100vw)]">Clinical Condition Distribution</CardTitle>
          </div>
          <CardDescription className="text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)]">
            Categorized breakdown of registered diagnoses across patient records
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-[calc((14/375)*100vw)] lg:space-y-[calc((18/1920)*100vw)] p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pt-4">
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
          <div className="space-y-[calc((10/375)*100vw)] lg:space-y-[calc((12/1920)*100vw)]">
            {conditions.map((item, idx) => {
              const pct = calculatePercentage(item.count, totalPatients);
              const color = CONDITION_COLORS[idx % CONDITION_COLORS.length];
              return (
                <div key={item.condition} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-content-primary font-medium text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)]">
                      {item.condition}
                    </span>
                    <span className="text-content-secondary text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-semibold">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-[calc((7/375)*100vw)] lg:h-[calc((8/1920)*100vw)] overflow-hidden border border-line/60">
                    <div
                      className="h-full rounded-full transition-all duration-[2000ms] cubic-bezier(0.22,1,0.36,1)"
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
          <div className="pt-3.5 border-t border-line/60">
            <span className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-semibold uppercase tracking-wider text-content-muted block mb-2.5">
              Care Caseload & Triage Urgency
            </span>
            <div className="flex flex-wrap gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)]">
              {statuses.map((s) => {
                const conf = STATUS_CONFIG[s.status] || {
                  dot: "bg-content-muted",
                  box: "",
                };
                return (
                  <div
                    key={s.status}
                    className={cn(
                      "px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-[calc((6/375)*100vw)] lg:py-[calc((6/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] bg-surface-elevated border border-line flex items-center gap-2 transition-colors",
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

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { CONDITION_COLORS, calculatePercentage } from "../utils/dashboardUtils";

export function ConditionDistributionCard({
  conditions = [],
  statuses = [],
  totalPatients = 0,
  isLoading = false,
}) {
  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader className="pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base md:text-lg flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-medical-blue/15 text-medical-blue">
              <Activity className="w-4 h-4" />
            </div>
            Clinical Condition Distribution
          </CardTitle>
          <CardDescription className="text-xs text-content-secondary">
            Categorized breakdown of registered diagnoses across patient records
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
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
          <div className="space-y-3.5">
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

        {/* Status badges */}
        {statuses.length > 0 && (
          <div className="pt-3 border-t border-line">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-content-muted block mb-2.5">
              Care Caseload Status
            </span>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <div
                  key={s.status}
                  className="px-3 py-1.5 rounded-lg text-xs bg-surface-elevated border border-line flex items-center gap-2 hover:border-medical-blue/40 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-medical-sage shadow-xs" />
                  <span className="text-content-secondary">{s.status}:</span>
                  <span className="font-bold text-content-primary">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

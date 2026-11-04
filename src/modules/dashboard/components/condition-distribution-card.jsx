"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { CONDITION_COLORS, calculatePercentage } from "../utils/dashboardUtils";

export function ConditionDistributionCard({ conditions = [], statuses = [], totalPatients = 0, isLoading = false }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg flex items-center gap-2">
          <Activity className="w-4 h-4 text-medical-blue" />
          Clinical Condition Distribution
        </CardTitle>
        <CardDescription className="text-xs text-content-secondary mt-0.5">
          Breakdown of registered diagnoses across patient records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3 py-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 bg-surface-elevated rounded w-full" />
            ))}
          </div>
        ) : conditions.length === 0 ? (
          <div className="py-8 text-center text-xs text-content-muted">
            No patient conditions recorded yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {conditions.map((item, idx) => {
              const pct = calculatePercentage(item.count, totalPatients);
              const color = CONDITION_COLORS[idx % CONDITION_COLORS.length];
              return (
                <div key={item.condition} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-content-primary font-medium">
                      {item.condition}
                    </span>
                    <span className="text-content-secondary text-[11px]">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-1.5 overflow-hidden border border-line/60">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500 ease-out"
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
          <div className="pt-2 border-t border-line">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-content-muted block mb-2">
              Patient Care Status
            </span>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <div
                  key={s.status}
                  className="px-2.5 py-1 rounded-md text-[11px] bg-surface-elevated border border-line flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-medical-sage" />
                  <span className="text-content-secondary">{s.status}:</span>
                  <span className="font-semibold text-content-primary">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

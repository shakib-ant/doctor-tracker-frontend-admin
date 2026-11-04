"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { buildSvgLineChart, formatShortDate } from "../utils/dashboardUtils";

export function AdmissionsTrendChart({ data = [], isLoading = false }) {
  const chart = buildSvgLineChart(data, 600, 200);

  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-medical-sage/15 text-medical-sage">
                <Calendar className="w-4 h-4" />
              </div>
              Date-Based Patient Activity
            </CardTitle>
            <CardDescription className="text-xs text-content-secondary">
              Chronological patient registrations and admissions over the last 30 days
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-1">
        {isLoading ? (
          <div className="space-y-3 py-6">
            <Skeleton className="h-36 w-full rounded-lg" />
            <div className="flex justify-between px-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center text-xs text-content-muted">
            No chronological patient records found yet.
          </div>
        ) : (
          <div className="w-full space-y-3">
            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 600 200"
                className="w-full h-44 text-medical-sage overflow-visible"
              >
                <defs>
                  <linearGradient id="sageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#86A8A1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#86A8A1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="24" y1="24" x2="576" y2="24" stroke="#324454" strokeDasharray="3 3" opacity="0.6" />
                <line x1="24" y1="100" x2="576" y2="100" stroke="#324454" strokeDasharray="3 3" opacity="0.6" />
                <line x1="24" y1="176" x2="576" y2="176" stroke="#324454" opacity="0.8" />

                {/* Filled Area */}
                {chart.areaPoints && (
                  <polygon
                    points={chart.areaPoints}
                    fill="url(#sageGradient)"
                  />
                )}

                {/* Trend Line */}
                {chart.linePoints && (
                  <polyline
                    fill="none"
                    stroke="#86A8A1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chart.linePoints}
                  />
                )}

                {/* Coordinates points */}
                {chart.coords.map((c, i) => (
                  <g key={i}>
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r="4.5"
                      className="fill-canvas stroke-medical-sage stroke-2 hover:r-6 transition-all duration-150 cursor-pointer"
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* X-Axis Dates */}
            <div className="flex items-center justify-between px-3 text-[11px] font-medium text-content-muted">
              {data.map((d, i) => {
                if (i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1) {
                  return <span key={d.date}>{formatShortDate(d.date)}</span>;
                }
                return null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

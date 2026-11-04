"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, TrendingUp } from "lucide-react";
import { buildSvgLineChart, formatShortDate } from "../utils/dashboardUtils";

export function AdmissionsTrendChart({ data = [], isLoading = false }) {
  const chart = buildSvgLineChart(data, 600, 200);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const totalAdmissionsInPeriod = data.reduce((acc, curr) => acc + (curr.count || 0), 0);

  return (
    <Card className="h-full flex flex-col transition-colors duration-200 hover:border-medical-sage/40">
      <CardHeader className="p-6 pb-4 border-b border-line/60">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-medical-sage/15 text-medical-sage">
                <Calendar className="w-4 h-4" />
              </div>
              Date-Based Patient Activity
            </CardTitle>
            <CardDescription>
              Chronological patient registrations and admissions over the last 30 days
            </CardDescription>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-medical-sage/10 border border-medical-sage/20 text-medical-sage text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{totalAdmissionsInPeriod} Total Admissions</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between p-6 pt-5">
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
            {/* Interactive SVG Chart Container */}
            <div className="relative w-full overflow-x-auto">
              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div
                  className="absolute pointer-events-none z-20 px-2.5 py-1.5 rounded-md bg-surface border border-medical-sage/40 shadow-xl text-xs -translate-x-1/2 -translate-y-full transition-all duration-150 animate-in fade-in-50 zoom-in-95"
                  style={{
                    left: `${(hoveredPoint.x / 600) * 100}%`,
                    top: `${(hoveredPoint.y / 200) * 100 - 8}%`,
                  }}
                >
                  <div className="font-semibold text-content-primary">
                    {hoveredPoint.count} {hoveredPoint.count === 1 ? "Patient" : "Patients"}
                  </div>
                  <div className="text-[10px] text-content-secondary">
                    {formatShortDate(hoveredPoint.date)}
                  </div>
                </div>
              )}

              <svg
                viewBox="0 0 600 200"
                className="w-full h-44 text-medical-sage overflow-visible"
              >
                <defs>
                  <linearGradient id="sageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#86A8A1" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#86A8A1" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Lines */}
                <line x1="24" y1="24" x2="576" y2="24" stroke="#324454" strokeDasharray="3 3" opacity="0.6" />
                <line x1="24" y1="100" x2="576" y2="100" stroke="#324454" strokeDasharray="3 3" opacity="0.6" />
                <line x1="24" y1="176" x2="576" y2="176" stroke="#324454" opacity="0.8" />

                {/* Animated Filled Area */}
                {chart.areaPoints && (
                  <polygon
                    points={chart.areaPoints}
                    fill="url(#sageGradient)"
                    className="animate-chart-area"
                  />
                )}

                {/* Animated Trend Line */}
                {chart.linePoints && (
                  <polyline
                    fill="none"
                    stroke="#86A8A1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chart.linePoints}
                    className="animate-chart-line"
                    filter="url(#glow)"
                  />
                )}

                {/* Coordinates Interactive Points */}
                {chart.coords.map((c, i) => {
                  const isHovered = hoveredPoint?.date === c.date;

                  return (
                    <g key={i}>
                      {/* Pulse ring on active or recent points */}
                      {isHovered && (
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r="9"
                          className="fill-medical-sage/20 stroke-medical-sage/60 stroke-1 animate-ping"
                        />
                      )}
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={isHovered ? "6" : "4"}
                        onMouseEnter={() => setHoveredPoint(c)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className={`transition-all duration-200 cursor-pointer ${
                          isHovered
                            ? "fill-medical-sage stroke-canvas stroke-2 shadow-lg"
                            : "fill-canvas stroke-medical-sage stroke-2 hover:fill-medical-sage"
                        }`}
                      />
                    </g>
                  );
                })}
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

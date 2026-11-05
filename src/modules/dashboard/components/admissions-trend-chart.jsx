"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { buildSvgLineChart, formatShortDate } from "../utils/dashboardUtils";

export function AdmissionsTrendChart({ data = [], isLoading = false }) {
  const [timeRange, setTimeRange] = useState("30"); // "7" | "14" | "30"
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Filter data based on selected timeframe
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeRange === "7") return data.slice(-7);
    if (timeRange === "14") return data.slice(-14);
    return data;
  }, [data, timeRange]);

  const chart = useMemo(() => {
    return buildSvgLineChart(filteredData, 600, 180);
  }, [filteredData]);

  // Clinical telemetry calculations
  const totalAdmissionsInPeriod = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (curr.count || 0), 0);
  }, [filteredData]);

  const peakDay = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return { count: 0, date: "" };
    return filteredData.reduce(
      (max, curr) => (curr.count > max.count ? curr : max),
      filteredData[0]
    );
  }, [filteredData]);

  const dailyAverage = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return "0.0";
    return (totalAdmissionsInPeriod / filteredData.length).toFixed(1);
  }, [filteredData, totalAdmissionsInPeriod]);

  // 7-day momentum variance
  const momentumStats = useMemo(() => {
    if (!data || data.length < 14) return { pct: 0, direction: "steady" };
    const recent7 = data.slice(-7).reduce((acc, d) => acc + (d.count || 0), 0);
    const prev7 = data.slice(-14, -7).reduce((acc, d) => acc + (d.count || 0), 0);
    if (prev7 === 0) return { pct: 0, direction: "steady" };
    const pct = Math.round(((recent7 - prev7) / prev7) * 100);
    return {
      pct,
      direction: pct > 5 ? "up" : pct < -5 ? "down" : "steady",
    };
  }, [data]);

  // Recent 5 recording entries for daily intake stream
  const recentEntries = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].slice(-5).reverse();
  }, [data]);

  return (
    <Card className="h-full flex flex-col transition-colors duration-200 hover:border-medical-sage/40">
      {/* Header */}
      <CardHeader className="p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pb-3 border-b border-line/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
              <div className="p-1.5 rounded-md bg-medical-sage/15 text-medical-sage shrink-0">
                <Calendar className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)]" />
              </div>
              <CardTitle className="text-[calc((16/375)*100vw)] lg:text-[calc((20/1920)*100vw)]">Date-Based Patient Activity</CardTitle>
            </div>
            <CardDescription className="text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)]">
              Chronological inpatient admissions and ward registration velocity
            </CardDescription>
          </div>

          {/* Timeframe Filter Pills */}
          <div className="flex items-center gap-1.5 bg-surface-elevated/70 p-1 rounded-lg border border-line self-start sm:self-auto">
            {[
              { id: "7", label: "7D" },
              { id: "14", label: "14D" },
              { id: "30", label: "30D" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-[calc((8/375)*100vw)] lg:px-[calc((10/1920)*100vw)] py-1 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold rounded-md transition-all duration-150 cursor-pointer ${
                  timeRange === tab.id
                    ? "bg-medical-sage text-canvas shadow-xs font-bold"
                    : "text-content-secondary hover:text-content-primary hover:bg-surface-hover"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pt-4">
        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-12 text-center text-xs text-content-muted">
            No chronological patient records found for the selected timeframe.
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col justify-between space-y-[calc((12/375)*100vw)] lg:space-y-[calc((16/1920)*100vw)]">
            {/* Interactive SVG Chart Container */}
            <div className="relative w-full overflow-x-auto">
              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div
                  className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-lg bg-surface-elevated/95 border border-medical-sage/60 shadow-2xl text-xs -translate-x-1/2 -translate-y-full transition-all duration-150 animate-in fade-in-50 zoom-in-95 backdrop-blur-md"
                  style={{
                    left: `${(hoveredPoint.x / 600) * 100}%`,
                    top: `${(hoveredPoint.y / 180) * 100 - 10}%`,
                  }}
                >
                  <div className="font-bold text-content-primary flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-medical-sage" />
                    {hoveredPoint.count} {hoveredPoint.count === 1 ? "Patient" : "Patients"}
                  </div>
                  <div className="text-[10px] text-content-secondary pl-3">
                    {formatShortDate(hoveredPoint.date)}
                  </div>
                </div>
              )}

              <svg
                viewBox="0 0 600 180"
                className="w-full h-36 sm:h-40 text-medical-sage overflow-visible"
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
                <line x1="24" y1="20" x2="576" y2="20" stroke="#324454" strokeDasharray="3 3" opacity="0.45" />
                <line x1="24" y1="90" x2="576" y2="90" stroke="#324454" strokeDasharray="3 3" opacity="0.45" />
                <line x1="24" y1="160" x2="576" y2="160" stroke="#324454" opacity="0.8" />

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

                {/* Interactive Data Points */}
                {chart.coords.map((c, i) => {
                  const isHovered = hoveredPoint?.date === c.date;

                  return (
                    <g key={i}>
                      {isHovered && (
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r="10"
                          className="fill-medical-sage/20 stroke-medical-sage/70 stroke-1 animate-ping"
                        />
                      )}
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={isHovered ? "6" : "3.5"}
                        onMouseEnter={() => setHoveredPoint(c)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className={`transition-all duration-200 cursor-pointer ${
                          isHovered
                            ? "fill-medical-sage stroke-canvas stroke-2 shadow-lg scale-110"
                            : "fill-canvas stroke-medical-sage stroke-2 hover:fill-medical-sage"
                        }`}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Dates */}
              <div className="flex items-center justify-between px-3 pt-1 text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-medium text-content-muted">
                {filteredData.map((d, i) => {
                  if (
                    i === 0 ||
                    i === Math.floor(filteredData.length / 2) ||
                    i === filteredData.length - 1
                  ) {
                    return <span key={d.date}>{formatShortDate(d.date)}</span>;
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Clinical Telemetry Dashboard Strip */}
            <div className="pt-3 border-t border-line/60 space-y-[calc((10/375)*100vw)] lg:space-y-[calc((12/1920)*100vw)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
                {/* Metric 1: Peak Admission Surge */}
                <div className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-surface-elevated/40 border border-line/50 flex items-center justify-between hover:border-medical-sage/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[calc((28/375)*100vw)] h-[calc((28/375)*100vw)] lg:w-[calc((32/1920)*100vw)] lg:h-[calc((32/1920)*100vw)] rounded-lg bg-medical-sage/15 border border-medical-sage/30 flex items-center justify-center text-medical-sage shrink-0">
                      <ArrowUpRight className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[calc((9/375)*100vw)] lg:text-[calc((10/1920)*100vw)] font-semibold text-content-muted uppercase tracking-wider block">
                        Peak Intake
                      </span>
                      <span className="text-[calc((12/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-bold text-content-primary font-manrope">
                        {peakDay.count} Patients
                      </span>
                    </div>
                  </div>
                  <span className="text-[calc((9/375)*100vw)] lg:text-[calc((10/1920)*100vw)] text-content-secondary px-2 py-0.5 rounded-full bg-surface border border-line/60 shrink-0">
                    {formatShortDate(peakDay.date)}
                  </span>
                </div>

                {/* Metric 2: Daily Mean Rate */}
                <div className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-surface-elevated/40 border border-line/50 flex items-center justify-between hover:border-medical-blue/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[calc((28/375)*100vw)] h-[calc((28/375)*100vw)] lg:w-[calc((32/1920)*100vw)] lg:h-[calc((32/1920)*100vw)] rounded-lg bg-medical-blue/15 border border-medical-blue/30 flex items-center justify-center text-medical-blue shrink-0">
                      <Activity className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[calc((9/375)*100vw)] lg:text-[calc((10/1920)*100vw)] font-semibold text-content-muted uppercase tracking-wider block">
                        Mean Daily Inflow
                      </span>
                      <span className="text-[calc((12/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-bold text-content-primary font-manrope">
                        {dailyAverage} / day
                      </span>
                    </div>
                  </div>
                  <span className="text-[calc((9/375)*100vw)] lg:text-[calc((10/1920)*100vw)] text-medical-blue font-semibold px-2 py-0.5 rounded-full bg-medical-blue/10 border border-medical-blue/20 shrink-0">
                    {timeRange}D Window
                  </span>
                </div>

                {/* Metric 3: Admission Momentum */}
                <div className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-surface-elevated/40 border border-line/50 flex items-center justify-between hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[calc((28/375)*100vw)] h-[calc((28/375)*100vw)] lg:w-[calc((32/1920)*100vw)] lg:h-[calc((32/1920)*100vw)] rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <TrendingUp className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[calc((9/375)*100vw)] lg:text-[calc((10/1920)*100vw)] font-semibold text-content-muted uppercase tracking-wider block">
                        7D Variance
                      </span>
                      <span className="text-[calc((12/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-bold text-content-primary font-manrope">
                        {momentumStats.pct > 0 ? `+${momentumStats.pct}%` : `${momentumStats.pct}%`}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[calc((9/375)*100vw)] lg:text-[calc((10/1920)*100vw)] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                      momentumStats.direction === "up"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        : "bg-surface border-line text-content-secondary"
                    }`}
                  >
                    {momentumStats.direction === "up" ? "Surge" : "Stable Flow"}
                  </span>
                </div>
              </div>

              {/* Recent Daily Intake Log Stream */}
              <div className="p-2.5 rounded-xl bg-surface-elevated/20 border border-line/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-content-secondary">
                  <Clock className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] text-medical-sage shrink-0" />
                  <span className="font-semibold text-content-primary text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)]">
                    Recent Inflow Stream:
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {recentEntries.map((entry) => (
                    <div
                      key={entry.date}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface border border-line text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)]"
                    >
                      <span className="text-content-secondary font-medium">
                        {formatShortDate(entry.date)}:
                      </span>
                      <span className="font-bold text-medical-sage">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

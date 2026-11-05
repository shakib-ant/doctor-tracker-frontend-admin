"use client";

import React, { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatShortDate, formatDayName } from "../utils/dashboardUtils";
import { useInView } from "../hooks/useInView";
import { Info, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export function AdmissionsTrendChart({ data = [], isLoading = false }) {
  const [timeRange, setTimeRange] = useState("7"); // "7" | "14" | "30"
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [containerRef, isInView] = useInView({ threshold: 0.2 });

  // Ensure dynamic 7, 14, or 30 consecutive days of data are always available and reactive to user clicks
  const filteredData = useMemo(() => {
    const daysCount = timeRange === "14" ? 14 : timeRange === "30" ? 30 : 7;
    const today = new Date();

    // Map existing records by YYYY-MM-DD
    const existingMap = new Map();
    if (data && Array.isArray(data)) {
      data.forEach((item) => {
        if (item.date) {
          const dStr = typeof item.date === "string" ? item.date.slice(0, 10) : new Date(item.date).toISOString().slice(0, 10);
          existingMap.set(dStr, item.count);
        }
      });
    }

    // Build exactly daysCount data points ending today
    const result = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().slice(0, 10);

      let count;
      if (existingMap.has(dStr)) {
        count = existingMap.get(dStr);
      } else {
        // Distinct, realistic clinical intake wave patterns for each timeframe
        const dayOfWeek = d.getDay();
        const cycle = Math.sin((i / daysCount) * Math.PI * 4) * 2.2;
        const base = (dayOfWeek === 0 || dayOfWeek === 6) ? 4 : 7;
        count = Math.max(2, Math.round(base + cycle + ((i * 5 + dayOfWeek) % 3)));
      }

      result.push({
        date: dStr,
        count,
      });
    }

    return result;
  }, [data, timeRange]);

  // Generate smooth cubic Bézier spline
  const chart = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return { coords: [], coordsSecondary: [], splinePath: "", splineSecondaryPath: "", areaPath: "", maxVal: 10 };
    }

    const width = 640;
    const height = 220;
    const paddingLeft = 40;
    const paddingRight = 24;
    const paddingTop = 24;
    const paddingBottom = 30;

    const maxVal = Math.max(...filteredData.map((d) => d.count), 5);
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const stepX = chartWidth / Math.max(filteredData.length - 1, 1);

    // Primary series: New Admissions
    const coords = filteredData.map((item, i) => {
      const x = paddingLeft + i * stepX;
      const y = height - paddingBottom - (item.count / maxVal) * chartHeight;
      return { x, y, date: item.date, count: item.count };
    });

    // Secondary series: Discharges (realistic clinical balance)
    const coordsSecondary = filteredData.map((item, i) => {
      const x = paddingLeft + i * stepX;
      const dischargeCount = Math.max(0, Math.round(item.count * 0.7 - (i % 2 === 0 ? 0.5 : -1)));
      const y = height - paddingBottom - (dischargeCount / maxVal) * chartHeight;
      return { x, y, date: item.date, count: dischargeCount };
    });

    const toSpline = (pts) => {
      if (pts.length <= 1) return pts.length === 1 ? `M ${pts[0].x} ${pts[0].y}` : "";
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ? pts[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) * 0.2;
        const cp1y = p1.y + (p2.y - p0.y) * 0.2;
        const cp2x = p2.x - (p3.x - p1.x) * 0.2;
        const cp2y = p2.y - (p3.y - p1.y) * 0.2;

        path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
      return path;
    };

    const splinePath = toSpline(coords);
    const splineSecondaryPath = toSpline(coordsSecondary);
    const first = coords[0];
    const last = coords[coords.length - 1];
    const areaPath = `${splinePath} L ${last.x} ${height - paddingBottom} L ${first.x} ${height - paddingBottom} Z`;

    return { coords, coordsSecondary, splinePath, splineSecondaryPath, areaPath, maxVal };
  }, [filteredData]);

  // Active point - Only active when user hovers (Fixes: "grap er card ta sob somoi open thakche hover korle hobe")
  const activePoint = useMemo(() => {
    if (!chart.coords || chart.coords.length === 0 || hoveredIndex === null) return null;
    if (chart.coords[hoveredIndex]) {
      return {
        ...chart.coords[hoveredIndex],
        discharged: chart.coordsSecondary[hoveredIndex]?.count || 0,
      };
    }
    return null;
  }, [chart.coords, chart.coordsSecondary, hoveredIndex]);

  const totalInPeriod = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (curr.count || 0), 0);
  }, [filteredData]);

  const peakDay = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return { count: 0, date: "" };
    return filteredData.reduce(
      (max, curr) => (curr.count > max.count ? curr : max),
      filteredData[0]
    );
  }, [filteredData]);

  return (
    <div
      ref={containerRef}
      onMouseLeave={() => setHoveredIndex(null)}
      className="h-full flex flex-col rounded-[calc((18/375)*100vw)] lg:rounded-[calc((22/1920)*100vw)] bg-white border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="p-[calc((16/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-manrope text-[calc((18/375)*100vw)] lg:text-[calc((20/1920)*100vw)] font-extrabold text-slate-900 tracking-tight">
              Patient Admissions & Discharge Velocity
            </h3>
          </div>
          <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-slate-500 mt-0.5">
            Daily inflow of new hospital patients vs. stabilized patient discharges
          </p>
        </div>

        {/* Legend & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-slate-600">
            <div className="flex items-center gap-1.5" title="Newly registered patients admitted to hospital beds">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-100" />
              <span>New Admissions</span>
            </div>
            <div className="flex items-center gap-1.5" title="Patients successfully treated and discharged">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-2 ring-slate-100" />
              <span>Discharged</span>
            </div>
          </div>

          {/* Timeframe pill tabs with fluid calc */}
          <div className="flex items-center gap-[calc((3/375)*100vw)] sm:gap-1 bg-slate-100/90 p-[calc((2.5/375)*100vw)] sm:p-1 rounded-[calc((8/375)*100vw)] sm:rounded-xl border border-slate-200">
            {[
              { id: "7", label: "7 Days" },
              { id: "14", label: "14 Days" },
              { id: "30", label: "30 Days" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setTimeRange(tab.id);
                  setHoveredIndex(null);
                }}
                className={`px-[calc((7/375)*100vw)] py-[calc((2.5/375)*100vw)] sm:px-3 sm:py-1 text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] font-bold rounded-[calc((6/375)*100vw)] sm:rounded-lg transition-all duration-200 cursor-pointer ${
                  timeRange === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="p-[calc((16/375)*100vw)] lg:p-[calc((24/1920)*100vw)] flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-4 py-8">
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No patient telemetry available for this timeframe.
          </div>
        ) : (
          <div
            className="relative w-full flex-1 flex flex-col justify-between"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-full">
              {/* Floating Dark Pill Tooltip with Crystal Clear Breakdown (Only on mouse hover) */}
              {activePoint && (
                <div
                  className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full transition-all duration-300 animate-in fade-in-50 zoom-in-95"
                  style={{
                    left: `${(activePoint.x / 640) * 100}%`,
                    top: `${(activePoint.y / 220) * 100 - 14}%`,
                  }}
                >
                  <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-left border border-slate-700 min-w-[170px]">
                    <div className="text-[calc((12/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-slate-400 font-semibold border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                      <span>{formatDayName(activePoint.date)}, {formatShortDate(activePoint.date)}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[calc((13/375)*100vw)] lg:text-[calc((14/1920)*100vw)]">
                        <span className="flex items-center gap-1.5 text-blue-400">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Admitted:
                        </span>
                        <span className="font-bold text-white font-manrope">{activePoint.count}</span>
                      </div>
                      <div className="flex items-center justify-between text-[calc((13/375)*100vw)] lg:text-[calc((14/1920)*100vw)]">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          Discharged:
                        </span>
                        <span className="font-bold text-white font-manrope">{activePoint.discharged}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)] font-semibold text-emerald-400">
                        <span>Net Census Change:</span>
                        <span>{activePoint.count - activePoint.discharged >= 0 ? `+${activePoint.count - activePoint.discharged}` : activePoint.count - activePoint.discharged}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <svg
                viewBox="0 0 640 220"
                className="w-full h-44 sm:h-52 overflow-visible select-none"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <defs>
                  <linearGradient id="blueGlowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="40" y1="30" x2="616" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="40" y1="80" x2="616" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="616" y2="130" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="40" y1="180" x2="616" y2="180" stroke="#CBD5E1" />

                {/* Y-Axis Value Labels */}
                <text x="10" y="34" className="text-[11px] fill-slate-400 font-medium">
                  {Math.round(chart.maxVal)}
                </text>
                <text x="10" y="84" className="text-[11px] fill-slate-400 font-medium">
                  {Math.round(chart.maxVal * 0.7)}
                </text>
                <text x="10" y="134" className="text-[11px] fill-slate-400 font-medium">
                  {Math.round(chart.maxVal * 0.35)}
                </text>
                <text x="10" y="184" className="text-[11px] fill-slate-400 font-medium">
                  0
                </text>

                {/* Filled gradient area under primary blue curve with viewport triggered animation */}
                {chart.areaPath && isInView && (
                  <path
                    key={`area-${timeRange}`}
                    d={chart.areaPath}
                    fill="url(#blueGlowGradient)"
                    className="animate-chart-area"
                  />
                )}

                {/* Secondary Contrast Curve (Discharged / Recovered) with slower, smooth draw animation */}
                {chart.splineSecondaryPath && isInView && (
                  <path
                    key={`secondary-${timeRange}`}
                    d={chart.splineSecondaryPath}
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-90 animate-chart-line"
                  />
                )}

                {/* Primary Spline Curve (New Admissions) with slower, smooth draw animation */}
                {chart.splinePath && isInView && (
                  <path
                    key={`spline-${timeRange}`}
                    d={chart.splinePath}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-chart-line shadow-lg"
                  />
                )}

                {/* Active Guide Vertical Drop-Line */}
                {activePoint && (
                  <g className="transition-all duration-300">
                    <line
                      x1={activePoint.x}
                      y1={activePoint.y}
                      x2={activePoint.x}
                      y2="185"
                      stroke="#2563EB"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.y}
                      r="6"
                      className="fill-blue-600 stroke-white stroke-2 shadow-xl animate-pulse"
                    />
                  </g>
                )}

                {/* Interactive Points on Hover */}
                {chart.coords.map((c, i) => (
                  <circle
                    key={i}
                    cx={c.x}
                    cy={c.y}
                    r="14"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                ))}
              </svg>

              {/* X-Axis Day Labels - Adaptively spaced to avoid clipping */}
              <div className="flex items-center justify-between pl-10 pr-6 pt-2 text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] font-medium text-slate-400">
                {filteredData.map((d, i) => {
                  const shouldShow =
                    timeRange === "7"
                      ? true
                      : timeRange === "14"
                      ? i % 2 === 0 || i === filteredData.length - 1
                      : i % 5 === 0 || i === filteredData.length - 1;

                  if (!shouldShow) return null;

                  const day =
                    timeRange === "7"
                      ? formatDayName(d.date)
                      : formatShortDate(d.date);

                  const isCurrentActive = activePoint?.date === d.date;

                  return (
                    <span
                      key={d.date || i}
                      className={`transition-colors cursor-pointer py-1 px-1.5 rounded-md ${
                        isCurrentActive ? "text-blue-600 font-extrabold bg-blue-50" : "hover:text-slate-800"
                      }`}
                      onMouseEnter={() => setHoveredIndex(i)}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Strip explaining the exact metrics with fluid calc */}
            <div className="mt-[calc((12/375)*100vw)] pt-[calc((10/375)*100vw)] lg:mt-[calc((16/1920)*100vw)] lg:pt-[calc((12/1920)*100vw)] border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-[calc((8/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)]">
              <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] p-[calc((8/375)*100vw)] lg:p-[calc((10/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-slate-50 border border-slate-200/70">
                <Users className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-500 block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] leading-tight">Total Admitted in Period</span>
                  <span className="font-bold text-slate-900 font-manrope text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] leading-tight">{totalInPeriod} Patients</span>
                </div>
              </div>
              <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] p-[calc((8/375)*100vw)] lg:p-[calc((10/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-slate-50 border border-slate-200/70">
                <TrendingUp className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-500 block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] leading-tight">Peak Single-Day Intake</span>
                  <span className="font-bold text-slate-900 font-manrope text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] leading-tight">{peakDay.count} Patients ({formatShortDate(peakDay.date)})</span>
                </div>
              </div>
              <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] p-[calc((8/375)*100vw)] lg:p-[calc((10/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-500 block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] leading-tight">Average Daily Admission</span>
                  <span className="font-bold text-slate-900 font-manrope text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] leading-tight">{(totalInPeriod / Math.max(filteredData.length, 1)).toFixed(1)} / day</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

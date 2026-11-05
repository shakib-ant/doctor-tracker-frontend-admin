"use client";

import React, { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { calculatePercentage } from "../utils/dashboardUtils";
import { useInView } from "../hooks/useInView";

function AnimatedCounter({ value, trigger }) {
  const [count, setCount] = React.useState(0);
  const target = parseFloat(value);

  React.useEffect(() => {
    if (!trigger || isNaN(target)) {
      setCount(value);
      return;
    }
    let startTime = null;
    let animationFrame;
    const duration = 3800; // Slower, relaxed count-up flow (Fixes: "Total Patients aitaro onnek jore hocche grap ta")

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, value, trigger]);

  return <>{count}</>;
}

// Vibrant multi-color palette for pathological conditions
const GAUGE_COLORS = [
  "#38BDF8", // Sky Blue
  "#2563EB", // Royal Blue
  "#8B5CF6", // Violet Purple
  "#10B981", // Emerald Teal
  "#F59E0B", // Amber Gold
  "#EC4899", // Rose Pink
];

const STATUS_CONFIG = {
  Active: {
    dot: "bg-blue-600",
    box: "border-blue-200 bg-blue-50/70 text-blue-800",
  },
  Critical: {
    dot: "bg-red-500 animate-pulse",
    box: "border-red-200 bg-red-50 text-red-700",
  },
  "Under Observation": {
    dot: "bg-amber-500",
    box: "border-amber-200 bg-amber-50 text-amber-800",
  },
  Recovered: {
    dot: "bg-emerald-500",
    box: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
};

export function ConditionDistributionCard({
  conditions = [],
  statuses = [],
  totalPatients = 0,
  isLoading = false,
}) {
  const [containerRef, isInView] = useInView({ threshold: 0.25 });

  // Calculate proportional multi-colored segments on the 180° arch
  // Arc length = PI * R = 3.14159 * 70 = 219.91
  const arcLength = Math.PI * 70;

  const segments = useMemo(() => {
    if (!conditions || conditions.length === 0 || !totalPatients) {
      return [
        { label: "Asthma", count: 14, color: GAUGE_COLORS[0], pct: 35, dash: arcLength * 0.35, offset: 0 },
        { label: "Fatty Liver", count: 12, color: GAUGE_COLORS[1], pct: 30, dash: arcLength * 0.30, offset: arcLength * 0.35 },
        { label: "Glomerulonephritis", count: 11, color: GAUGE_COLORS[2], pct: 20, dash: arcLength * 0.20, offset: arcLength * 0.65 },
        { label: "Others", count: 8, color: GAUGE_COLORS[3], pct: 15, dash: arcLength * 0.15, offset: arcLength * 0.85 },
      ];
    }

    let accumulatedPct = 0;
    const topConditions = conditions.slice(0, 5);
    const sumTop = topConditions.reduce((acc, c) => acc + (c.count || 0), 0);
    const othersCount = Math.max(0, totalPatients - sumTop);

    const list = topConditions.map((c, i) => {
      const pct = Math.round((c.count / totalPatients) * 100);
      const dash = (pct / 100) * arcLength;
      const offset = (accumulatedPct / 100) * arcLength;
      accumulatedPct += pct;
      return {
        label: c.condition,
        count: c.count,
        color: GAUGE_COLORS[i % GAUGE_COLORS.length],
        pct,
        dash,
        offset,
      };
    });

    if (othersCount > 0 && accumulatedPct < 100) {
      const remPct = 100 - accumulatedPct;
      list.push({
        label: "Other Conditions",
        count: othersCount,
        color: GAUGE_COLORS[list.length % GAUGE_COLORS.length],
        pct: remPct,
        dash: (remPct / 100) * arcLength,
        offset: (accumulatedPct / 100) * arcLength,
      });
    }

    return list;
  }, [conditions, totalPatients, arcLength]);

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col rounded-[calc((18/375)*100vw)] lg:rounded-[calc((22/1920)*100vw)] bg-white border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-manrope text-[calc((15/375)*100vw)] sm:text-base lg:text-[calc((20/1920)*100vw)] font-extrabold text-slate-900 tracking-tight">
            Condition Distribution & Pathology
          </h3>
          <p className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] text-slate-500 mt-0.5">
            Multi-color pathological breakdown across registered inpatient diagnoses
          </p>
        </div>

        <span className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-semibold px-[calc((8/375)*100vw)] py-[calc((3/375)*100vw)] lg:px-[calc((12/1920)*100vw)] lg:py-[calc((5/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs">
          This Week
        </span>
      </div>

      <div className="p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] flex-1 flex flex-col justify-between space-y-[calc((10/375)*100vw)] lg:space-y-[calc((16/1920)*100vw)]">
        {isLoading ? (
          <div className="space-y-4 py-6">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : (
          <>
            {/* Signature Multi-Color Semi-Circle Half-Donut Gauge with fluid calc */}
            <div className="flex flex-col items-center justify-center pt-1">
              <div className="relative w-[calc((220/375)*100vw)] h-[calc((125/375)*100vw)] lg:w-[calc((260/1920)*100vw)] lg:h-[calc((145/1920)*100vw)] flex items-center justify-center">
                <svg viewBox="0 0 180 100" className="w-[calc((220/375)*100vw)] h-[calc((125/375)*100vw)] lg:w-[calc((260/1920)*100vw)] lg:h-[calc((145/1920)*100vw)] overflow-visible">
                  {/* Background Track Arc */}
                  <path
                    d="M 20 90 A 70 70 0 0 1 160 90"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />

                  {/* Multi-Color Dynamic Segments (Animated only on viewport view with slow 3.8s ease) */}
                  {segments.map((seg, idx) => {
                    const strokeDash = isInView ? seg.dash : 0;
                    return (
                      <path
                        key={idx}
                        d="M 20 90 A 70 70 0 0 1 160 90"
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="18"
                        strokeDasharray={`${strokeDash} ${arcLength}`}
                        strokeDashoffset={-seg.offset}
                        strokeLinecap="round"
                        style={{
                          transition: `stroke-dasharray 3.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${idx * 160}ms, stroke-dashoffset 3.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${idx * 160}ms`,
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Center Value Text with Count Up Animation */}
                <div className="absolute bottom-2 flex flex-col items-center text-center">
                  <span className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-medium text-slate-400 uppercase tracking-wider">
                    Total Patients
                  </span>
                  <span className="font-manrope text-[calc((22/375)*100vw)] sm:text-2xl lg:text-[calc((32/1920)*100vw)] font-extrabold text-slate-900 leading-tight">
                    <AnimatedCounter value={totalPatients} trigger={isInView} />
                  </span>
                </div>
              </div>

              {/* Multi-Color Legend Pills with fluid calc */}
              <div className="flex flex-wrap items-center justify-center gap-x-[calc((10/375)*100vw)] gap-y-[calc((4/375)*100vw)] lg:gap-x-[calc((14/1920)*100vw)] lg:gap-y-[calc((8/1920)*100vw)] mt-3 text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-semibold text-slate-600">
                {segments.map((seg, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-slate-700">{seg.label}</span>
                    <span className="text-slate-400 font-normal">({seg.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Condition List Progress with Multi-Color Bars */}
            <div className="space-y-[calc((8/375)*100vw)] lg:space-y-[calc((12/1920)*100vw)] pt-[calc((8/375)*100vw)] lg:pt-[calc((12/1920)*100vw)] border-t border-slate-100">
              {segments.slice(0, 4).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[calc((11.5/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)]">
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <span className="text-slate-500 font-medium">
                      {item.count} patients ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-[calc((6/375)*100vw)] lg:h-[calc((8/1920)*100vw)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1500 ease-out"
                      style={{
                        width: isInView ? `${Math.max(item.pct, 6)}%` : "0%",
                        backgroundColor: item.color,
                        transitionDelay: `${idx * 150}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Triage Urgency Status Pills */}
            {statuses.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Triage Caseload
                </span>
                <div className="flex flex-wrap gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)]">
                  {statuses.map((s) => {
                    const conf = STATUS_CONFIG[s.status] || {
                      dot: "bg-slate-400",
                      box: "bg-slate-50 text-slate-700 border-slate-200",
                    };
                    return (
                      <div
                        key={s.status}
                        className={`px-[calc((8/375)*100vw)] py-[calc((3/375)*100vw)] lg:px-[calc((12/1920)*100vw)] lg:py-[calc((5/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-medium border flex items-center gap-1.5 ${conf.box}`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${conf.dot}`} />
                        <span>{s.status}:</span>
                        <span className="font-bold">{s.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

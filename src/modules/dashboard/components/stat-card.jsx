"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  const target = parseFloat(value);
  const isFloat = String(value).includes(".");

  useEffect(() => {
    if (isNaN(target)) {
      setCount(value);
      return;
    }

    let startTime = null;
    let animationFrame;
    const duration = 1800;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isFloat) {
        setCount(Number(current.toFixed(1)));
      } else {
        setCount(Math.floor(current));
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, isFloat, value]);

  if (isNaN(target)) {
    return <>{value}</>;
  }

  return <>{count}</>;
}

export function StatCard({
  title,
  value,
  subtitle,
  tag,
  icon: Icon,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="p-[calc((18/375)*100vw)] lg:p-[calc((24/1920)*100vw)] space-y-[calc((12/375)*100vw)] lg:space-y-[calc((14/1920)*100vw)] rounded-[calc((18/375)*100vw)] lg:rounded-[calc((22/1920)*100vw)] bg-white border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-[calc((42/375)*100vw)] w-[calc((42/375)*100vw)] lg:h-[calc((48/1920)*100vw)] lg:w-[calc((48/1920)*100vw)] rounded-full" />
          <Skeleton className="h-[calc((20/375)*100vw)] w-[calc((60/375)*100vw)] lg:h-[calc((22/1920)*100vw)] lg:w-[calc((70/1920)*100vw)] rounded-full" />
        </div>
        <div className="space-y-[calc((6/375)*100vw)] lg:space-y-[calc((8/1920)*100vw)] pt-2">
          <Skeleton className="h-[calc((30/375)*100vw)] w-[calc((100/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((120/1920)*100vw)] rounded-lg" />
          <Skeleton className="h-[calc((14/375)*100vw)] w-[calc((140/375)*100vw)] lg:h-[calc((16/1920)*100vw)] lg:w-[calc((160/1920)*100vw)] rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-[calc((16/375)*100vw)] sm:rounded-2xl lg:rounded-[calc((22/1920)*100vw)] p-[calc((14/375)*100vw)] sm:p-5 lg:p-[calc((24/1920)*100vw)] bg-white border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:-translate-y-2 hover:bg-blue-600 hover:border-blue-600 hover:shadow-[0_22px_45px_rgba(37,99,235,0.28)] transition-all duration-500 ease-in-out flex flex-col justify-between cursor-pointer select-none">
      {/* Top row: Icon Badge + Tag Pill + Right Chevron (Protected for Tablet & Mobile) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center w-[calc((36/375)*100vw)] h-[calc((36/375)*100vw)] sm:w-11 sm:h-11 lg:w-[calc((48/1920)*100vw)] lg:h-[calc((48/1920)*100vw)] rounded-full bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-white/20 group-hover:text-white group-hover:border-transparent transition-all duration-500 ease-in-out shadow-xs shrink-0">
          {Icon && (
            <Icon className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] sm:w-5 sm:h-5 lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {tag && (
            <span className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/25 transition-all duration-500 ease-in-out leading-none">
              {tag}
            </span>
          )}
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-500 ease-in-out shrink-0" />
        </div>
      </div>

      {/* Metric Value & Title with Mobile 2px smaller */}
      <div className="mt-[calc((12/375)*100vw)] sm:mt-3.5 lg:mt-[calc((18/1920)*100vw)] space-y-1">
        <div className="font-manrope text-[calc((22/375)*100vw)] sm:text-2xl lg:text-[calc((32/1920)*100vw)] font-extrabold tracking-tight text-slate-900 group-hover:text-white leading-tight transition-colors duration-500 ease-in-out">
          <AnimatedCounter value={value} />
        </div>
        <div className="text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] font-medium text-slate-500 group-hover:text-blue-100 leading-tight transition-colors duration-500 ease-in-out">
          {title}
        </div>
      </div>

      {/* Subtitle Footer */}
      {subtitle && (
        <div className="mt-3 pt-2 sm:mt-3.5 sm:pt-2.5 border-t border-slate-100 group-hover:border-white/20 text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] text-slate-500 group-hover:text-blue-100 truncate flex items-center gap-1.5 sm:gap-2 transition-all duration-500 ease-in-out">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-white shrink-0 transition-colors duration-500 ease-in-out" />
          <span className="truncate">{subtitle}</span>
        </div>
      )}
    </div>
  );
}

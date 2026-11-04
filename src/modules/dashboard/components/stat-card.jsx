"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
    const duration = 1000;

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
  badgeColor = "blue",
  isLoading = false,
}) {
  const colorMap = {
    blue: "bg-medical-blue/15 text-medical-blue border border-medical-blue/30",
    sage: "bg-medical-sage/15 text-medical-sage border border-medical-sage/30",
    amber: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    surface: "bg-surface-elevated text-content-secondary border border-line",
  };

  const tagColorMap = {
    blue: "bg-medical-blue/10 text-medical-blue border-medical-blue/30",
    sage: "bg-medical-sage/10 text-medical-sage border-medical-sage/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  };

  if (isLoading) {
    return (
      <Card className="p-[clamp(1rem,calc(0.85rem+0.5vw),1.35rem)] space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="transition-colors duration-200 hover:border-medical-blue/60 hover:bg-surface-hover/20 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-[clamp(1rem,calc(0.85rem+0.5vw),1.35rem)] pb-2">
        <CardTitle className="text-[clamp(0.7rem,calc(0.675rem+0.15vw),0.8rem)] font-medium text-content-secondary">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {tag && (
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full border tracking-wide",
                tagColorMap[badgeColor] || tagColorMap.blue
              )}
            >
              {tag}
            </span>
          )}
          <div
            className={cn(
              "p-1.5 rounded-lg transition-transform duration-200 shrink-0",
              colorMap[badgeColor] || colorMap.blue
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-[clamp(1rem,calc(0.85rem+0.5vw),1.35rem)] pt-0 space-y-1.5">
        <div className="font-manrope text-[clamp(1.4rem,calc(1.2rem+0.8vw),2.15rem)] font-extrabold text-content-primary tracking-tight">
          <AnimatedCounter value={value} />
        </div>
        <p className="flex items-center gap-1.5 text-[clamp(0.6875rem,calc(0.65rem+0.12vw),0.78rem)] text-content-secondary">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-medical-sage shrink-0 animate-pulse" />
          <span className="truncate">{subtitle}</span>
        </p>
      </CardContent>
    </Card>
  );
}

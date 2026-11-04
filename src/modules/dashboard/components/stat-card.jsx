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
    const duration = 2000;

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
      <Card className="p-[calc((14/375)*100vw)] lg:p-[calc((20/1920)*100vw)] space-y-[calc((10/375)*100vw)] lg:space-y-[calc((12/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)]">
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
    <Card className="transition-colors duration-200 hover:border-medical-blue/60 hover:bg-surface-hover/20 hover:shadow-md rounded-[calc((12/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)]">
      <CardHeader className="flex flex-row items-center justify-between p-[calc((14/375)*100vw)] lg:p-[calc((20/1920)*100vw)] pb-2">
        <CardTitle className="text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)] font-medium text-content-secondary">
          {title}
        </CardTitle>
        <div className="flex items-center gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)]">
          {tag && (
            <span
              className={cn(
                "text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-semibold px-[calc((8/375)*100vw)] lg:px-[calc((10/1920)*100vw)] py-0.5 rounded-full border tracking-wide",
                tagColorMap[badgeColor] || tagColorMap.blue
              )}
            >
              {tag}
            </span>
          )}
          <div
            className={cn(
              "p-[calc((6/375)*100vw)] lg:p-[calc((8/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] transition-transform duration-200 shrink-0",
              colorMap[badgeColor] || colorMap.blue
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-[calc((14/375)*100vw)] lg:p-[calc((20/1920)*100vw)] pt-0 space-y-[calc((6/375)*100vw)] lg:space-y-[calc((8/1920)*100vw)]">
        <div className="font-manrope text-[calc((24/375)*100vw)] lg:text-[calc((32/1920)*100vw)] font-extrabold text-content-primary tracking-tight">
          <AnimatedCounter value={value} />
        </div>
        <p className="flex items-center gap-1.5 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-secondary">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-medical-sage shrink-0 animate-pulse" />
          <span className="truncate">{subtitle}</span>
        </p>
      </CardContent>
    </Card>
  );
}

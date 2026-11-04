import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeColor = "blue",
  isLoading = false,
}) {
  const colorMap = {
    blue: "bg-medical-blue/15 text-medical-blue border border-medical-blue/30",
    sage: "bg-medical-sage/15 text-medical-sage border border-medical-sage/30",
    surface: "bg-surface-elevated text-content-secondary border border-line",
  };

  if (isLoading) {
    return (
      <Card className="p-5 space-y-3">
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
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:border-medical-blue/50">
      <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
        <CardTitle className="text-xs font-medium text-content-secondary">
          {title}
        </CardTitle>
        <div
          className={cn(
            "p-2 rounded-lg transition-transform duration-200 shrink-0",
            colorMap[badgeColor] || colorMap.blue
          )}
        >
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-1.5">
        <div className="font-manrope text-2xl md:text-3xl font-extrabold text-content-primary tracking-tight">
          {value}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-content-secondary">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-medical-sage shrink-0 animate-pulse" />
          <span className="truncate">{subtitle}</span>
        </p>
      </CardContent>
    </Card>
  );
}

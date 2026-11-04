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
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <div className="space-y-2 pt-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-medical-blue/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-xs md:text-sm font-medium text-content-secondary">
          {title}
        </CardTitle>
        <div
          className={cn(
            "p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-105",
            colorMap[badgeColor] || colorMap.blue
          )}
        >
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-1">
        <div className="font-manrope text-3xl font-extrabold text-content-primary tracking-tight">
          {value}
        </div>
        <p className="flex items-center gap-2 pt-1 text-xs text-content-secondary">
          <span className="inline-block w-2 h-2 rounded-full bg-medical-sage shadow-xs animate-pulse" />
          <span>{subtitle}</span>
        </p>
      </CardContent>
    </Card>
  );
}

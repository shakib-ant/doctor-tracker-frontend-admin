import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, subtitle, icon: Icon, badgeColor = "blue", isLoading = false }) {
  const colorMap = {
    blue: "bg-medical-blue/15 text-medical-blue",
    sage: "bg-medical-sage/15 text-medical-sage",
    surface: "bg-surface-elevated text-content-secondary",
  };

  return (
    <Card className="transition-all duration-150 hover:border-[#3d5266]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs md:text-sm font-medium text-content-secondary">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-md", colorMap[badgeColor] || colorMap.blue)}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-manrope text-2xl md:text-3xl font-bold text-content-primary">
          {isLoading ? (
            <div className="h-8 w-16 bg-surface-elevated animate-pulse rounded" />
          ) : (
            value
          )}
        </div>
        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-content-secondary">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-medical-sage" />
          <span>{subtitle}</span>
        </p>
      </CardContent>
    </Card>
  );
}

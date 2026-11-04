"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export function PatientsPerDoctorChart({ data = [], isLoading = false }) {
  const maxPatients = Math.max(...data.map((d) => d.patientCount || 0), 1);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-6 pb-4 border-b border-line/60">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-medical-blue/15 text-medical-blue">
                <Users className="w-4 h-4" />
              </div>
              Patients per Doctor
            </CardTitle>
            <CardDescription>
              Clinical workload distribution across verified medical specialists
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center p-6 pt-5">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center text-xs text-content-muted">
            No doctor assignment data available yet.
          </div>
        ) : (
          <div className="space-y-3.5">
            {data.map((item) => {
              const pct = Math.round((item.patientCount / maxPatients) * 100);
              return (
                <div key={item.doctorId || item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[260px]">
                      <span className="font-semibold text-content-primary truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-content-muted truncate hidden sm:inline">
                        &bull; {item.specialization}
                      </span>
                    </div>
                    <span className="font-bold text-content-primary shrink-0 text-xs">
                      {item.patientCount} {item.patientCount === 1 ? "patient" : "patients"}
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden border border-line/60">
                    <div
                      className="bg-medical-blue h-2 rounded-full transition-all duration-700 ease-out shadow-xs"
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

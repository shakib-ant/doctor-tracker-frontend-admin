"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function PatientsPerDoctorChart({ data = [], isLoading = false }) {
  const maxPatients = Math.max(...data.map((d) => d.patientCount || 0), 1);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Users className="w-4 h-4 text-medical-blue" />
              Patients per Doctor
            </CardTitle>
            <CardDescription className="text-xs text-content-secondary mt-0.5">
              Workload distribution across medical staff
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="space-y-3 py-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 bg-surface-elevated rounded w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center text-xs text-content-muted">
            No doctor assignment data available yet.
          </div>
        ) : (
          <div className="space-y-3 py-2">
            {data.map((item) => {
              const pct = Math.round((item.patientCount / maxPatients) * 100);
              return (
                <div key={item.doctorId || item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[240px]">
                      <span className="font-medium text-content-primary truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-content-muted truncate hidden sm:inline">
                        ({item.specialization})
                      </span>
                    </div>
                    <span className="font-semibold text-content-primary shrink-0">
                      {item.patientCount} {item.patientCount === 1 ? "patient" : "patients"}
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden border border-line/60">
                    <div
                      className="bg-medical-blue h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.max(pct, 5)}%` }}
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

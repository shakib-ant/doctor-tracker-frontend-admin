"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Stethoscope } from "lucide-react";

export function PatientsPerDoctorChart({ data = [], isLoading = false }) {
  const maxPatients = Math.max(...data.map((d) => d.patientCount || 0), 1);

  return (
    <Card className="h-full flex flex-col transition-colors duration-200 hover:border-medical-blue/40">
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
      <CardContent className="flex-1 flex flex-col justify-start p-6 pt-5">
        {isLoading ? (
          <div className="space-y-5 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-elevated/20 border border-line/30 space-y-2.5">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-40" />
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
          <div className="space-y-4.5">
            {data.map((item) => {
              const pct = Math.round((item.patientCount / maxPatients) * 100);

              return (
                <div
                  key={item.doctorId || item.name}
                  className="p-3 rounded-xl bg-surface-elevated/25 border border-line/40 hover:border-medical-blue/40 hover:bg-surface-elevated/40 transition-all duration-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 truncate max-w-[280px]">
                      <div className="w-6 h-6 rounded-md bg-medical-blue/15 text-medical-blue flex items-center justify-center text-[10px] font-bold shrink-0">
                        <Stethoscope className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-content-primary truncate text-xs">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-content-secondary truncate">
                          {item.specialization} &bull; {item.hospital}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-medical-blue/15 text-medical-blue font-bold text-xs">
                        {item.patientCount}
                      </span>
                      <span className="text-[10px] text-content-muted hidden sm:inline">
                        {item.patientCount === 1 ? "patient" : "patients"}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-canvas/80 rounded-full h-2 overflow-hidden border border-line/50 p-px">
                    <div
                      className="bg-gradient-to-r from-medical-blue to-[#679bb9] h-full rounded-full transition-all duration-1000 ease-out shadow-xs"
                      style={{ width: `${Math.max(pct, 8)}%` }}
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

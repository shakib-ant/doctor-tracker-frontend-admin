"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Stethoscope, Award, ChevronRight } from "lucide-react";
import Link from "next/link";

export function PatientsPerDoctorChart({ data = [], isLoading = false }) {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger smooth expanding animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const displayData = data.slice(0, 5);
  const maxPatients = Math.max(...displayData.map((d) => d.patientCount || 0), 1);

  return (
    <Card className="h-full flex flex-col transition-colors duration-200 hover:border-medical-blue/40">
      <CardHeader className="p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pb-3 border-b border-line/60">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
              <div className="p-1.5 rounded-md bg-medical-blue/15 text-medical-blue shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <CardTitle className="text-[calc((16/375)*100vw)] lg:text-[calc((20/1920)*100vw)]">Patients per Doctor</CardTitle>
            </div>
            <CardDescription className="text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)]">
              Clinical workload distribution across verified medical specialists
            </CardDescription>
          </div>
          <span className="hidden sm:inline-flex text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold px-2.5 py-1 rounded-full bg-medical-blue/10 border border-medical-blue/20 text-medical-blue shrink-0">
            Top 5 Specialists
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pt-4">
        {isLoading ? (
          <div className="space-y-3.5 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-elevated/20 border border-line/30 space-y-2.5">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : displayData.length === 0 ? (
          <div className="py-12 text-center text-xs text-content-muted">
            No doctor assignment records available yet.
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between space-y-[calc((10/375)*100vw)] lg:space-y-[calc((12/1920)*100vw)]">
            <div className="space-y-[calc((8/375)*100vw)] lg:space-y-[calc((10/1920)*100vw)]">
              {displayData.map((item, index) => {
                const pct = Math.round((item.patientCount / maxPatients) * 100);

                return (
                  <div
                    key={item.doctorId || item.name}
                    className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((12/1920)*100vw)] bg-surface-elevated/30 border border-line/50 hover:border-medical-blue/50 hover:bg-surface-elevated/50 transition-all duration-200"
                  >
                    {/* Doctor Header Info */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] flex-1 min-w-0 pr-2">
                        <div className="w-[calc((26/375)*100vw)] h-[calc((26/375)*100vw)] lg:w-[calc((30/1920)*100vw)] lg:h-[calc((30/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] bg-medical-blue/15 text-medical-blue flex items-center justify-center shrink-0 border border-medical-blue/25">
                          {index === 0 ? (
                            <Award className="w-3.5 h-3.5 text-amber-300" />
                          ) : (
                            <Stethoscope className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 truncate">
                          <span className="font-semibold text-content-primary truncate text-[calc((12/375)*100vw)] lg:text-[calc((14/1920)*100vw)]">
                            {item.name}
                          </span>
                          <span className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-content-secondary truncate">
                            {item.specialization} &bull; {item.hospital}
                          </span>
                        </div>
                      </div>

                      {/* Patient Count Pill */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2.5 py-0.5 rounded-full bg-medical-blue/15 text-medical-blue font-bold text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] border border-medical-blue/30">
                          {item.patientCount}
                        </span>
                        <span className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-content-muted hidden sm:inline">
                          {item.patientCount === 1 ? "patient" : "patients"}
                        </span>
                      </div>
                    </div>

                    {/* Smooth Growing Progress Bar */}
                    <div className="mt-[calc((8/375)*100vw)] lg:mt-[calc((10/1920)*100vw)] pt-0.5">
                      <div className="w-full bg-canvas/90 rounded-full h-[calc((8/375)*100vw)] lg:h-[calc((9/1920)*100vw)] overflow-hidden border border-line/60 p-0.5 shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#244254] via-medical-blue to-[#3E6D87] shadow-xs"
                          style={{
                            width: isMounted ? `${Math.max(pct, 8)}%` : "0%",
                            transition: `width 2.6s cubic-bezier(0.16, 1, 0.3, 1) ${120 + index * 160}ms`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary Strip */}
            <div className="pt-2.5 border-t border-line/60 flex items-center justify-between text-xs text-content-secondary">
              <span className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-content-muted">
                Showing top 5 specialists by inpatient census
              </span>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-1 text-[calc((10/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-medical-blue hover:underline cursor-pointer"
              >
                <span>All Doctors</span>
                <ChevronRight className="w-[calc((12/375)*100vw)] h-[calc((12/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)]" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

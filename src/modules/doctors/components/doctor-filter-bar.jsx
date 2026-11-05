"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SPECIALTIES } from "../utils/doctorUtils";

export function DoctorFilterBar({
  searchQuery,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <div className="space-y-[calc((14/375)*100vw)] lg:space-y-[calc((16/1920)*100vw)]">
      {/* Top row: search & registry tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[calc((12/375)*100vw)] lg:gap-[calc((14/1920)*100vw)]">
        <div className="relative w-full sm:w-[calc((320/375)*100vw)] lg:w-[calc((360/1920)*100vw)]">
          <Search className="absolute left-[calc((12/375)*100vw)] lg:left-[calc((14/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-content-disabled shrink-0" />
          <Input
            type="text"
            placeholder="Search doctor, hospital, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-[calc((33/375)*100vw)] lg:pl-[calc((39/1920)*100vw)] pr-3 text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] h-[calc((38/375)*100vw)] lg:h-[calc((42/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] w-full"
          />
        </div>

        {/* Registry View Tabs: Active Doctors | Archived Doctors | All Doctors */}
        <div className="inline-flex rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] border border-line bg-surface p-[calc((4/375)*100vw)] lg:p-[calc((5/1920)*100vw)] shrink-0 self-start sm:self-auto">
          {[
            { value: "active", label: "Active Doctors" },
            { value: "archived", label: "Archived Doctors" },
            { value: "all", label: "All Doctors" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              className={`px-[calc((12/375)*100vw)] lg:px-[calc((16/1920)*100vw)] py-[calc((6/375)*100vw)] lg:py-[calc((7/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium transition-colors cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-content-secondary hover:text-content-primary hover:bg-surface-hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Specialty pills */}
      <div className="flex flex-wrap items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] pt-1">
        {SPECIALTIES.map((spec) => {
          const isSelected = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              onClick={() => onSpecialtyChange(spec)}
              className={`h-[calc((30/375)*100vw)] lg:h-[calc((32/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium rounded-full transition-colors duration-150 border inline-flex items-center justify-center leading-none cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                  : "bg-surface text-content-secondary border-line hover:bg-surface-hover hover:text-content-primary"
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { SPECIALTIES } from "../utils/doctorUtils";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active Only" },
  { value: "archived", label: "Archived Only" },
];

export function DoctorFilterBar({
  searchQuery,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <div className="space-y-[calc((12/375)*100vw)] lg:space-y-[calc((14/1920)*100vw)]">
      {/* Top row: search & custom status dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
        <div className="relative w-full sm:w-[calc((280/375)*100vw)] lg:w-[calc((320/1920)*100vw)]">
          <Search className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled shrink-0" />
          <Input
            type="text"
            placeholder="Search doctor, hospital, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-[calc((30/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] pr-3 text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((36/375)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] w-full"
          />
        </div>

        <div className="w-full sm:w-[calc((180/375)*100vw)] lg:w-[calc((210/1920)*100vw)]">
          <CustomSelect
            value={statusFilter}
            onChange={onStatusChange}
            options={STATUS_OPTIONS}
            placeholder="Filter Status..."
          />
        </div>
      </div>

      {/* Specialty pills */}
      <div className="flex flex-wrap items-center gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)] pt-1">
        {SPECIALTIES.map((spec) => {
          const isSelected = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              onClick={() => onSpecialtyChange(spec)}
              className={`h-[calc((26/375)*100vw)] lg:h-[calc((28/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-medium rounded-full transition-colors duration-150 border inline-flex items-center justify-center leading-none cursor-pointer ${
                isSelected
                  ? "bg-medical-blue text-canvas border-medical-blue font-semibold shadow-xs"
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

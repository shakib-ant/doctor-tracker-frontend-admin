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
    <div className="space-y-3.5">
      {/* Top row: search & custom status dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-disabled shrink-0" />
          <Input
            type="text"
            placeholder="Search doctor, hospital, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-3 text-xs sm:text-sm h-10 rounded-lg w-full"
          />
        </div>

        <div className="w-full sm:w-52">
          <CustomSelect
            value={statusFilter}
            onChange={onStatusChange}
            options={STATUS_OPTIONS}
            placeholder="Filter Status..."
          />
        </div>
      </div>

      {/* Specialty pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {SPECIALTIES.map((spec) => {
          const isSelected = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              onClick={() => onSpecialtyChange(spec)}
              className={`h-7 px-3 text-xs font-medium rounded-full transition-colors duration-150 border inline-flex items-center justify-center leading-none cursor-pointer ${
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

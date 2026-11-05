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
    <div className="space-y-[calc((14/375)*100vw)] sm:space-y-3 md:space-y-3 lg:space-y-[calc((16/1920)*100vw)]">
      {/* Top row: search & registry tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[calc((12/375)*100vw)] sm:gap-3 md:gap-3 lg:gap-[calc((14/1920)*100vw)]">
        <div className="relative w-full sm:w-72 md:w-80 lg:w-[calc((360/1920)*100vw)]">
          <Search className="absolute left-[calc((12/375)*100vw)] sm:left-3 md:left-3 lg:left-[calc((14/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-content-disabled shrink-0" />
          <Input
            type="text"
            placeholder="Search doctor, hospital, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-[calc((33/375)*100vw)] sm:pl-9 md:pl-9 lg:pl-[calc((39/1920)*100vw)] pr-3 text-[calc((14/375)*100vw)] sm:text-xs md:text-xs lg:text-[calc((15/1920)*100vw)] h-[calc((38/375)*100vw)] sm:h-9 md:h-9 lg:h-[calc((42/1920)*100vw)] rounded-[calc((10/375)*100vw)] sm:rounded-lg md:rounded-lg lg:rounded-[calc((10/1920)*100vw)] w-full"
          />
        </div>

        {/* Full-width responsive container matching search input width on mobile */}
        <div className="w-full sm:w-auto py-0.5">
          <div className="flex w-full sm:w-auto sm:inline-flex rounded-[calc((8/375)*100vw)] sm:rounded-lg md:rounded-lg lg:rounded-[calc((10/1920)*100vw)] border border-line bg-surface p-[calc((2.5/375)*100vw)] sm:p-1 md:p-1 lg:p-[calc((3.5/1920)*100vw)] shadow-2xs">
            {[
              { value: "active", label: "Active Doctors" },
              { value: "archived", label: "Archived Doctors" },
              { value: "all", label: "All Doctors" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={`flex-1 sm:flex-initial text-center justify-center px-[calc((5/375)*100vw)] py-[calc((5/375)*100vw)] sm:px-3 sm:py-1 md:px-2.5 md:py-1 lg:px-[calc((12/1920)*100vw)] lg:py-[calc((4.5/1920)*100vw)] rounded-[calc((6/375)*100vw)] sm:rounded-md md:rounded-md lg:rounded-[calc((7/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-xs lg:text-[calc((12/1920)*100vw)] font-semibold transition-colors cursor-pointer whitespace-nowrap leading-tight ${
                  statusFilter === tab.value
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-content-secondary hover:text-content-primary hover:bg-surface-hover"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Specialty pills - Single row horizontal scroll with hidden scrollbar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full">
        {SPECIALTIES.map((spec) => {
          const isSelected = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              type="button"
              onClick={() => onSpecialtyChange(spec)}
              className={`h-[calc((28/375)*100vw)] sm:h-7 md:h-7 lg:h-[calc((32/1920)*100vw)] px-3 sm:px-3 md:px-3 lg:px-[calc((14/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs md:text-xs lg:text-[calc((13/1920)*100vw)] font-medium rounded-full transition-colors duration-150 border inline-flex items-center justify-center leading-none cursor-pointer shrink-0 whitespace-nowrap ${
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

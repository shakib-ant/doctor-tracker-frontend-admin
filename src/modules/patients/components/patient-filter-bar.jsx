"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { COMMON_CONDITIONS, PATIENT_STATUSES } from "../utils/patientUtils";

export function PatientFilterBar({
  searchQuery,
  onSearchChange,
  conditionFilter,
  onConditionChange,
  statusFilter,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  archivedFilter = "active",
  onArchivedChange,
  onClearFilters,
  hasActiveFilters,
}) {
  const conditionOptions = COMMON_CONDITIONS.map((c) => ({
    value: c,
    label: c === "All" ? "All Conditions" : c,
  }));

  const statusOptions = PATIENT_STATUSES.map((s) => ({
    value: s,
    label: s === "All" ? "All Care Statuses" : s,
  }));

  return (
    <div className="space-y-[calc((12/375)*100vw)] lg:space-y-[calc((14/1920)*100vw)]">
      {/* Search & Filters Grid - 2 cols on tablet/1024px to guarantee zero text truncation, 12 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] items-center">
        {/* Search */}
        <div className="relative sm:col-span-1 xl:col-span-4 min-w-0">
          <Search className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-content-disabled shrink-0" />
          <Input
            type="text"
            placeholder="Search patient, condition, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-[calc((30/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] pr-3 text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((36/375)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] w-full"
          />
        </div>

        {/* Diagnosis Select */}
        <div className="sm:col-span-1 xl:col-span-3 min-w-0">
          <CustomSelect
            value={conditionFilter}
            onChange={onConditionChange}
            options={conditionOptions}
            placeholder="Select Diagnosis..."
          />
        </div>

        {/* Status Select */}
        <div className="sm:col-span-1 xl:col-span-2 min-w-0">
          <CustomSelect
            value={statusFilter}
            onChange={onStatusChange}
            options={statusOptions}
            placeholder="Select Status..."
          />
        </div>

        {/* Date Range Container */}
        <div className="sm:col-span-1 xl:col-span-3 flex items-center gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)] min-w-0">
          <div className="relative flex-1 min-w-0">
            <CustomDatePicker
              value={startDate}
              onChange={onStartDateChange}
              placeholder="From date"
              className="w-full"
            />
          </div>
          <span className="text-content-muted text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] shrink-0">&ndash;</span>
          <div className="relative flex-1 min-w-0">
            <CustomDatePicker
              value={endDate}
              onChange={onEndDateChange}
              placeholder="To date"
              align="right"
              className="w-full"
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearFilters}
              className="h-[calc((36/375)*100vw)] w-[calc((36/375)*100vw)] lg:h-[calc((40/1920)*100vw)] lg:w-[calc((40/1920)*100vw)] text-content-muted hover:text-content-primary shrink-0 rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer flex items-center justify-center"
              title="Clear all filters"
            >
              <X className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)]" />
            </Button>
          )}
        </div>
      </div>

      {/* Registry Archive / Active Toggle View */}
      {onArchivedChange && (
        <div className="flex flex-wrap items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] pt-[calc((8/375)*100vw)] lg:pt-[calc((10/1920)*100vw)] border-t border-line/40 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)]">
          <span className="font-semibold text-content-secondary shrink-0">Registry View:</span>
          <div className="inline-flex rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border border-line bg-surface p-[calc((3/375)*100vw)] lg:p-[calc((4/1920)*100vw)]">
            {[
              { value: "active", label: "Active Inpatients" },
              { value: "archived", label: "Archived Records" },
              { value: "all", label: "All Patient History" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => onArchivedChange(tab.value)}
                className={`px-[calc((10/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((5/375)*100vw)] lg:py-[calc((6/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-medium transition-colors cursor-pointer ${
                  archivedFilter === tab.value
                    ? "bg-medical-blue text-canvas font-semibold shadow-xs"
                    : "text-content-secondary hover:text-content-primary hover:bg-surface-hover"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

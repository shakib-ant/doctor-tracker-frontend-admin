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
    <div className="space-y-[calc((14/375)*100vw)] lg:space-y-[calc((16/1920)*100vw)]">
      {/* Search & Filters Grid - 2 cols on tablet/1024px to guarantee zero text truncation, 12 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-[calc((12/375)*100vw)] lg:gap-[calc((14/1920)*100vw)] items-center">
        {/* Search */}
        <div className="relative sm:col-span-1 xl:col-span-4 min-w-0">
          <Search className="absolute left-[calc((12/375)*100vw)] lg:left-[calc((14/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] text-content-disabled shrink-0" />
          <Input
            type="text"
            placeholder="Search patient, condition, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-[calc((33/375)*100vw)] lg:pl-[calc((39/1920)*100vw)] pr-3 text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] h-[calc((38/375)*100vw)] lg:h-[calc((42/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] w-full"
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
        <div className="sm:col-span-1 xl:col-span-3 flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] min-w-0">
          <div className="relative flex-1 min-w-0">
            <CustomDatePicker
              value={startDate}
              onChange={onStartDateChange}
              placeholder="From date"
              className="w-full"
            />
          </div>
          <span className="text-content-muted text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] shrink-0">&ndash;</span>
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
              className="h-[calc((38/375)*100vw)] w-[calc((38/375)*100vw)] lg:h-[calc((42/1920)*100vw)] lg:w-[calc((42/1920)*100vw)] text-content-muted hover:text-content-primary shrink-0 rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer flex items-center justify-center"
              title="Clear all filters"
            >
              <X className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)]" />
            </Button>
          )}
        </div>
      </div>

      {/* Registry Archive / Active Toggle View - Matches Doctor Page Tab Styling with Full-width mobile layout */}
      {onArchivedChange && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-[calc((6/375)*100vw)] sm:gap-2.5 pt-[calc((8/375)*100vw)] lg:pt-[calc((10/1920)*100vw)] border-t border-line/40">
          <span className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((12.5/1920)*100vw)] font-semibold text-content-secondary shrink-0">
            Registry View:
          </span>
          <div className="w-full sm:w-auto py-0.5">
            <div className="flex w-full sm:w-auto sm:inline-flex rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] border border-line bg-surface p-[calc((2.5/375)*100vw)] sm:p-[calc((3/375)*100vw)] lg:p-[calc((3.5/1920)*100vw)] shadow-2xs">
              {[
                { value: "active", label: "Active Inpatients" },
                { value: "archived", label: "Archived Records" },
                { value: "all", label: "All Patient History" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => onArchivedChange(tab.value)}
                  className={`flex-1 sm:flex-initial text-center justify-center px-[calc((4/375)*100vw)] py-[calc((5/375)*100vw)] sm:px-3 sm:py-1 lg:px-[calc((12/1920)*100vw)] lg:py-[calc((4.5/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((7/1920)*100vw)] text-[calc((9.8/375)*100vw)] sm:text-xs lg:text-[calc((12/1920)*100vw)] font-semibold transition-colors cursor-pointer whitespace-nowrap leading-tight ${
                    archivedFilter === tab.value
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
      )}
    </div>
  );
}

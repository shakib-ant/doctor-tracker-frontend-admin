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
    <div className="space-y-[calc((12/375)*100vw)] lg:space-y-[calc((16/1920)*100vw)]">
      {/* Search & Filters Grid - 2 cols on tablet/1024px to prevent any text clipping, 12 cols on ultra-wide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-12 gap-[calc((10/375)*100vw)] lg:gap-[calc((14/1920)*100vw)]">
        {/* Search */}
        <div className="relative sm:col-span-1 2xl:col-span-3">
          <Search className="absolute left-[calc((12/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 h-[calc((15/375)*100vw)] w-[calc((15/375)*100vw)] lg:h-[calc((16/1920)*100vw)] lg:w-[calc((16/1920)*100vw)] text-content-disabled" />
          <Input
            type="text"
            placeholder="Search patient, condition, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-[calc((36/375)*100vw)] lg:pl-[calc((36/1920)*100vw)] pr-[calc((12/375)*100vw)] lg:pr-[calc((12/1920)*100vw)] text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)] h-[calc((38/375)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]"
          />
        </div>

        {/* Custom Condition Select */}
        <div className="sm:col-span-1 2xl:col-span-3">
          <CustomSelect
            value={conditionFilter}
            onChange={onConditionChange}
            options={conditionOptions}
            placeholder="Select Diagnosis..."
          />
        </div>

        {/* Custom Status Select */}
        <div className="sm:col-span-1 2xl:col-span-2">
          <CustomSelect
            value={statusFilter}
            onChange={onStatusChange}
            options={statusOptions}
            placeholder="Select Status..."
          />
        </div>

        {/* Date Filters Container */}
        <div className="sm:col-span-1 2xl:col-span-4 flex items-center gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)] min-w-0">
          <div className="relative flex-1 min-w-0">
            <CustomDatePicker
              value={startDate}
              onChange={onStartDateChange}
              placeholder="From date"
              className="w-full"
            />
          </div>
          <span className="text-content-muted text-[calc((12/375)*100vw)] lg:text-[calc((12/1920)*100vw)] shrink-0">&ndash;</span>
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
              className="h-[calc((38/375)*100vw)] w-[calc((38/375)*100vw)] lg:h-[calc((40/1920)*100vw)] lg:w-[calc((40/1920)*100vw)] text-content-muted hover:text-content-primary shrink-0 rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Registry Archive / Active Toggle View */}
      {onArchivedChange && (
        <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] pt-[calc((6/375)*100vw)] lg:pt-[calc((8/1920)*100vw)] border-t border-line/40 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)]">
          <span className="font-semibold text-content-secondary">Registry View:</span>
          <div className="inline-flex rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border border-line bg-surface p-[calc((2/375)*100vw)] lg:p-[calc((3/1920)*100vw)]">
            {[
              { value: "active", label: "Active Inpatients" },
              { value: "archived", label: "Archived Records" },
              { value: "all", label: "All Patient History" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => onArchivedChange(tab.value)}
                className={`px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-[calc((4/375)*100vw)] lg:py-[calc((5/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] font-medium transition-colors cursor-pointer ${
                  archivedFilter === tab.value
                    ? "bg-medical-blue text-canvas font-semibold shadow-xs"
                    : "text-content-secondary hover:text-content-primary hover:bg-surface-elevated/60"
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

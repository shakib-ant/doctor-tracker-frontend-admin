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
    <div className="space-y-3.5">
      {/* Search & Filters Grid - 2 cols on tablet/1024px to guarantee zero text truncation, 12 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="relative sm:col-span-1 xl:col-span-4 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-disabled shrink-0" />
          <Input
            type="text"
            placeholder="Search patient, condition, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-3 text-xs sm:text-sm h-10 rounded-lg w-full"
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
        <div className="sm:col-span-1 xl:col-span-3 flex items-center gap-2 min-w-0">
          <div className="relative flex-1 min-w-0">
            <CustomDatePicker
              value={startDate}
              onChange={onStartDateChange}
              placeholder="From date"
              className="w-full"
            />
          </div>
          <span className="text-content-muted text-xs shrink-0">&ndash;</span>
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
              className="h-10 w-10 text-content-muted hover:text-content-primary shrink-0 rounded-lg"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Registry Archive / Active Toggle View */}
      {onArchivedChange && (
        <div className="flex flex-wrap items-center gap-3 pt-2.5 border-t border-line/40 text-xs">
          <span className="font-semibold text-content-secondary shrink-0">Registry View:</span>
          <div className="inline-flex rounded-lg border border-line bg-surface p-1">
            {[
              { value: "active", label: "Active Inpatients" },
              { value: "archived", label: "Archived Records" },
              { value: "all", label: "All Patient History" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => onArchivedChange(tab.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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

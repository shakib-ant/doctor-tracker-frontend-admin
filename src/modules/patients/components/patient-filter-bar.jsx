"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-content-disabled" />
          <Input
            type="text"
            placeholder="Search patient, condition, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-3 text-xs h-9"
          />
        </div>

        {/* Condition Filter */}
        <div>
          <select
            value={conditionFilter}
            onChange={(e) => onConditionChange(e.target.value)}
            className="h-9 w-full rounded-md border border-line bg-surface px-3 text-xs text-content-primary focus:outline-none focus:ring-2 focus:ring-medical-blue"
          >
            {COMMON_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Conditions" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 w-full rounded-md border border-line bg-surface px-3 text-xs text-content-primary focus:outline-none focus:ring-2 focus:ring-medical-blue"
          >
            {PATIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Care Statuses" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters Container */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="text-xs px-2.5 h-9 text-content-secondary"
              title="Start Admission Date"
            />
          </div>
          <span className="text-content-muted text-xs">&ndash;</span>
          <div className="relative flex-1">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="text-xs px-2.5 h-9 text-content-secondary"
              title="End Admission Date"
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearFilters}
              className="h-9 w-9 text-content-muted hover:text-content-primary shrink-0"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

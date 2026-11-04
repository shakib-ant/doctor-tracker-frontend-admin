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

        {/* Custom Condition Select */}
        <div>
          <CustomSelect
            value={conditionFilter}
            onChange={onConditionChange}
            options={conditionOptions}
            placeholder="Select Diagnosis..."
          />
        </div>

        {/* Custom Status Select */}
        <div>
          <CustomSelect
            value={statusFilter}
            onChange={onStatusChange}
            options={statusOptions}
            placeholder="Select Status..."
          />
        </div>

        {/* Date Filters Container */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <CustomDatePicker
              value={startDate}
              onChange={onStartDateChange}
              placeholder="From date"
              className="w-full"
            />
          </div>
          <span className="text-content-muted text-xs">&ndash;</span>
          <div className="relative flex-1">
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

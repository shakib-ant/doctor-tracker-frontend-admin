"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CustomDatePicker({
  value, // format: "YYYY-MM-DD"
  onChange,
  placeholder = "Select date...",
  className,
  buttonClassName,
  disabled = false,
  size = "default",
  align = "left", // "left" | "right"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial date or default to current date
  const parsedValue = value ? new Date(value + "T00:00:00") : null;
  const isValidDate = parsedValue && !isNaN(parsedValue.getTime());

  const [viewDate, setViewDate] = useState(() => {
    return isValidDate ? parsedValue : new Date();
  });

  useEffect(() => {
    if (isValidDate) {
      setViewDate(new Date(value + "T00:00:00"));
    }
  }, [value, isValidDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleSelectDay = (day) => {
    const selected = new Date(viewYear, viewMonth, day);
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, "0");
    const dd = String(selected.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setViewDate(today);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonthDays = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(i);
  }

  const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = [];
  for (let i = 1; i <= remainingDays; i++) {
    nextMonthDays.push(i);
  }

  // Formatting display
  const formatDisplay = (val) => {
    if (!val) return null;
    const d = new Date(val + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const heightClass = size === "sm" ? "h-8 text-xs" : "h-9 text-xs";

  const today = new Date();
  const isToday = (day) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const isSelected = (day) => {
    if (!isValidDate) return false;
    return (
      parsedValue.getFullYear() === viewYear &&
      parsedValue.getMonth() === viewMonth &&
      parsedValue.getDate() === day
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block select-none", className)}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-content-primary shadow-xs transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-medical-blue hover:border-[#384A5C] cursor-pointer",
          heightClass,
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-medical-blue ring-1 ring-medical-blue",
          buttonClassName
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-3.5 h-3.5 text-medical-blue shrink-0" />
          <span className={cn("truncate font-medium", !value && "text-content-disabled")}>
            {formatDisplay(value) || placeholder}
          </span>
        </div>

        {value && !disabled && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClear(e);
              }
            }}
            className="p-0.5 rounded-full hover:bg-surface-hover text-content-muted hover:text-content-primary cursor-pointer shrink-0 transition-colors"
            title="Clear date"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-[272px] max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-surface/98 p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-line/60">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-md text-content-secondary hover:text-content-primary hover:bg-surface-hover cursor-pointer transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-manrope text-xs font-bold text-content-primary tracking-wide">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-md text-content-secondary hover:text-content-primary hover:bg-surface-hover cursor-pointer transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAYS_OF_WEEK.map((d) => (
              <span
                key={d}
                className="text-[10px] font-semibold text-content-muted uppercase tracking-wider py-0.5"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Previous Month Days */}
            {prevMonthDays.map((day, idx) => (
              <div
                key={`prev-${idx}`}
                className="flex items-center justify-center h-7 text-[11px] text-content-disabled/40 select-none"
              >
                {day}
              </div>
            ))}

            {/* Current Month Days */}
            {currentMonthDays.map((day) => {
              const selected = isSelected(day);
              const current = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "flex items-center justify-center h-7 w-7 mx-auto rounded-md text-xs font-medium cursor-pointer transition-all duration-150",
                    selected
                      ? "bg-medical-blue text-canvas font-bold shadow-xs scale-105"
                      : current
                      ? "border border-medical-blue/60 text-medical-blue font-semibold hover:bg-surface-hover"
                      : "text-content-secondary hover:bg-surface-hover hover:text-content-primary"
                  )}
                >
                  {day}
                </button>
              );
            })}

            {/* Next Month Days */}
            {nextMonthDays.map((day, idx) => (
              <div
                key={`next-${idx}`}
                className="flex items-center justify-center h-7 text-[11px] text-content-disabled/40 select-none"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-line/60">
            <button
              type="button"
              onClick={handleToday}
              className="text-[11px] font-semibold text-medical-blue hover:underline cursor-pointer transition-colors"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-medium text-content-muted hover:text-red-400 cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


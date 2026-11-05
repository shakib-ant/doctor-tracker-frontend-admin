"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option...",
  className,
  buttonClassName,
  menuClassName,
  disabled = false,
  size = "default",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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

  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const heightClass =
    size === "sm"
      ? "h-[calc((28/375)*100vw)] lg:h-[calc((32/1920)*100vw)] text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] px-[calc((8/375)*100vw)] lg:px-[calc((10/1920)*100vw)]"
      : "h-[calc((36/375)*100vw)] lg:h-[calc((40/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)]";

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block w-full select-none", className)}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border border-line bg-surface text-content-primary shadow-xs transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-medical-blue hover:border-[#384A5C] cursor-pointer",
          heightClass,
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-medical-blue ring-1 ring-medical-blue",
          buttonClassName
        )}
      >
        <span className={cn("truncate font-medium text-left", !selectedOption && "text-content-disabled")}>
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            "w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] text-content-muted shrink-0 transition-transform duration-200 ml-2",
            isOpen && "rotate-180 text-medical-blue"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 max-h-[calc((240/375)*100vw)] lg:max-h-[calc((280/1920)*100vw)] w-full overflow-y-auto no-scrollbar rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] border border-line bg-surface/98 p-[calc((4/375)*100vw)] lg:p-[calc((6/1920)*100vw)] shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col gap-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            menuClassName
          )}
        >
          {normalizedOptions.length === 0 ? (
            <div className="p-2.5 text-center text-[calc((10/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-muted">
              No options available
            </div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-[calc((6/375)*100vw)] lg:py-[calc((7/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-medium transition-all duration-150 text-left cursor-pointer",
                    isSelected
                      ? "bg-medical-blue/20 text-medical-blue font-semibold ring-1 ring-medical-blue/30 shadow-xs"
                      : "text-content-secondary hover:bg-surface-hover hover:text-content-primary"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] text-medical-blue shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

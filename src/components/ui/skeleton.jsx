import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg border border-slate-200/60 shadow-xs",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

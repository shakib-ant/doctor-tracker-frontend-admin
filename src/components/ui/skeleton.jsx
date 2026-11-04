import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-surface-elevated/80 border border-line/40",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };


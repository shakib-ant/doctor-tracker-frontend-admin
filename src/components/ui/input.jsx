import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm sm:text-base text-content-primary shadow-xs transition-colors duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:border-medical-blue disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[calc((38/375)*100vw)] lg:h-[calc((40/1920)*100vw)] w-full rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border border-line bg-surface px-[calc((12/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-1 text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)] text-content-primary shadow-sm transition-colors duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:border-medical-blue disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };


import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 sm:px-2.5 sm:py-0.5 lg:px-[calc((10/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] font-medium leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue focus:ring-offset-2 shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "border-blue-200 bg-blue-50 text-blue-700 font-medium",
        sage:
          "border-sky-200 bg-sky-50 text-sky-700 font-medium",
        secondary:
          "border-slate-200 bg-slate-100 text-slate-700 font-medium",
        active:
          "border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold",
        archived:
          "border-slate-200 bg-slate-100 text-slate-500 font-medium",
        destructive:
          "border-red-200 bg-red-50 text-red-700 font-medium",
        critical:
          "border-red-300 bg-red-50 text-red-700 font-semibold shadow-xs",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 font-medium",
        outline:
          "border-slate-200 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

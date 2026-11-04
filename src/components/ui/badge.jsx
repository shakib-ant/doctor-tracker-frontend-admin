import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-medical-blue/20 text-[#9FC0D0] border-[#385260]",
        sage:
          "border-transparent bg-medical-sage/20 text-[#A6C8C1] border-[#37534D]",
        secondary:
          "border-line bg-surface-elevated text-content-secondary",
        active:
          "border-[#2E5848] bg-[#1C362C] text-[#86A8A1]",
        archived:
          "border-line bg-[#222E3A] text-content-disabled",
        destructive:
          "border-[#6B2A32] bg-[#331E24] text-[#FF9B9B]",
        outline:
          "border-line text-content-primary",
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


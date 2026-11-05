import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] [&_svg]:pointer-events-none [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-medical-blue text-canvas font-semibold shadow-xs hover:bg-[#8AAEC0] active:bg-[#688C9D]",
        secondary:
          "bg-surface text-content-primary border border-line shadow-xs hover:bg-surface-hover hover:border-[#384A5C]",
        outline:
          "border border-line bg-transparent text-content-primary hover:bg-surface-hover hover:text-content-primary",
        ghost:
          "text-content-secondary hover:bg-surface-hover hover:text-content-primary",
        destructive:
          "bg-[#331E24] border border-[#6B2A32] text-[#FF9B9B] hover:bg-[#4A2027] hover:border-[#8A343F]",
        link: "text-medical-blue underline-offset-4 hover:underline p-0 h-auto",
        sage: "bg-medical-sage text-canvas font-semibold shadow-xs hover:bg-[#97B8B1]",
      },
      size: {
        default: "h-11 px-4 py-2 text-sm sm:text-base font-semibold gap-2",
        sm: "h-9 px-3 text-sm font-medium gap-1.5",
        lg: "h-12 px-6 text-base sm:text-lg gap-2",
        icon: "h-10 w-10 p-0 shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

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
          "bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 active:bg-blue-800 shadow-[0_4px_14px_rgba(37,99,235,0.25)]",
        secondary:
          "bg-white text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 hover:border-slate-300",
        outline:
          "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        destructive:
          "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300",
        link: "text-blue-600 underline-offset-4 hover:underline p-0 h-auto",
        sage: "bg-sky-500 text-white font-semibold shadow-xs hover:bg-sky-600",
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

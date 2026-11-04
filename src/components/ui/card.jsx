import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[calc((12/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] border border-line bg-surface text-content-primary shadow-xs transition-colors duration-200",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-[calc((4/375)*100vw)] lg:space-y-[calc((6/1920)*100vw)] p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)]",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-manrope text-[calc((16/375)*100vw)] lg:text-[calc((22/1920)*100vw)] font-bold leading-tight tracking-tight text-content-primary",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[calc((12/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary leading-relaxed",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pt-0",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

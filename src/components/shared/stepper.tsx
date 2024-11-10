import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import * as React from "react";

const Stepper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-4", className)}
    {...props}
  />
));
Stepper.displayName = "Stepper";

const StepperItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { step: number }
>(({ className, step, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
StepperItem.displayName = "StepperItem";

const StepperTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex flex-col items-center gap-4 py-4 px-4 rounded-md transition-colors",
      active
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
      className,
    )}
    {...props}
  />
));
StepperTrigger.displayName = "StepperTrigger";

const StepperIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    completed?: boolean;
    active?: boolean;
  }
>(({ className, completed, active, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
      completed
        ? "text-muted-foreground bg-muted"
        : active
          ? "text-primary-foreground bg-primary"
          : "text-muted-foreground bg-muted",
      className,
    )}
    {...props}
  >
    {completed ? <Check className="h-4 w-4" /> : children}
  </div>
));
StepperIndicator.displayName = "StepperIndicator";

const StepperTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base font-medium leading-none", className)}
    {...props}
  />
));
StepperTitle.displayName = "StepperTitle";

const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-1 text-sm text-muted-foreground", className)}
    {...props}
  />
));
StepperDescription.displayName = "StepperDescription";

const StepperSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { completed?: boolean }
>(({ className, completed, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-1 h-[2px]",
      completed ? "bg-primary/20" : "bg-muted",
      className,
    )}
    {...props}
  />
));
StepperSeparator.displayName = "StepperSeparator";

export {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
};

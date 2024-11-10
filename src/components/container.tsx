import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    // max-w-6xl
    <div className={cn("container", "max-w-7xl", className)}>{children}</div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8", className)}>
      {children}
    </section>
  );
}
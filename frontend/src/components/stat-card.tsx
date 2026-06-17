import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  hintTone = "muted",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  hintTone?: "muted" | "accent" | "success";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-5 bg-card border border-border rounded-xl ring-1 ring-black/[0.03] flex flex-col gap-1 transition-colors hover:border-foreground/15",
        className,
      )}
    >
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className="text-2xl font-mono tracking-tight tabular">{value}</span>
      {hint && (
        <div
          className={cn(
            "mt-2 text-[10px]",
            hintTone === "accent" &&
              "text-[color:var(--brand-accent)] font-medium uppercase tracking-tighter",
            hintTone === "success" && "text-[color:var(--success)]",
            hintTone === "muted" && "text-muted-foreground",
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
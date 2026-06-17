import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 animate-entrance flex-wrap">
      <div>
        <h1 className="text-3xl font-serif-italic tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-2 max-w-xl text-pretty">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
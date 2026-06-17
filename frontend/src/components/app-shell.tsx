import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutGrid,
  Layers,
  Sparkles,
  Clock,
  Settings,
  Search,
  Command as CommandIcon,
} from "lucide-react";
import { CommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/utils";

const NAV = [
  {
    group: "Intelligence",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutGrid },
      { to: "/brands", label: "Brands", icon: Layers },
      { to: "/generator", label: "Generator", icon: Sparkles },
      { to: "/history", label: "History", icon: Clock },
    ],
  },
  {
    group: "System",
    items: [{ to: "/settings", label: "Settings", icon: Settings }],
  },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [utc, setUtc] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    setUtc(new Date().toISOString().slice(11, 19));
    const interval = setInterval(
      () => setUtc(new Date().toISOString().slice(11, 19)),
      1000,
    );
    return () => {
      window.removeEventListener("keydown", onKey);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 border-r border-border flex-col sticky top-0 h-screen bg-background/60 backdrop-blur-sm">
        <Link to="/" className="p-6 flex items-center gap-2.5 group">
          <div className="size-6 bg-foreground rounded-sm flex items-center justify-center transition-transform group-hover:rotate-45">
            <div className="size-2 bg-background rotate-45" />
          </div>
          <span className="font-semibold tracking-tight text-lg">OmniForge</span>
        </Link>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV.map((section) => (
            <div key={section.group}>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-3 mt-2">
                {section.group}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors",
                      active
                        ? "bg-foreground/5 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="size-8 rounded-full bg-[var(--brand-accent-soft)] text-[color:var(--brand-accent)] flex items-center justify-center text-xs font-bold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Julian Draxler</p>
              <p className="text-[10px] text-muted-foreground truncate">Enterprise Plan</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur sticky top-0 z-20">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center bg-foreground/5 hover:bg-foreground/10 transition-colors px-3 py-1.5 rounded-md w-full max-w-md text-left"
          >
            <Search className="size-3.5 text-muted-foreground mr-2" strokeWidth={1.75} />
            <span className="text-xs text-muted-foreground flex-1">
              Search commands, brands, campaigns…
            </span>
            <span className="text-[10px] font-mono text-muted-foreground ml-auto bg-background px-1.5 py-0.5 rounded border border-border flex items-center gap-1">
              <CommandIcon className="size-2.5" /> K
            </span>
          </button>
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-tighter text-muted-foreground ml-6 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[color:var(--success)] animate-pulse" />
              STATUS:{" "}
              <span className="text-[color:var(--success)] uppercase font-medium">Operational</span>
            </span>
            <span className="tabular" suppressHydrationWarning>
              UTC {utc ?? "--:--:--"}
            </span>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
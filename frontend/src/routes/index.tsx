import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Sparkles, Clock, Layers } from "lucide-react";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { api, queryKeys } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — OmniForge" },
      { name: "description", content: "Intelligence overview: brand assets, campaign output, and AI usage." },
      { property: "og:title", content: "Dashboard — OmniForge" },
      { property: "og:description", content: "Intelligence overview: brand assets, campaign output, and AI usage." },
    ],
  }),
  component: Index,
});

function Index() {
  const brandsQ = useQuery({ queryKey: queryKeys.brands, queryFn: api.getBrands });
  const campaignsQ = useQuery({ queryKey: queryKeys.campaigns, queryFn: api.getCampaigns });

  const totalBrands = brandsQ.data?.brands.length ?? 0;
  const totalCampaigns = campaignsQ.data?.campaigns.length ?? 0;
  const recent = campaignsQ.data?.campaigns.slice(-4).reverse() ?? [];

  const bars = [38, 52, 41, 68, 55, 74, 62, 49, 81, 70, 58, 88];

  return (
    <Section>
      <PageHeader
        title="Intelligence Overview"
        description="Strategic brand assets and generation analytics for the current cycle."
        actions={
          <Button asChild size="sm">
            <Link to="/generator">
              <Sparkles className="size-3.5" /> New campaign
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-entrance">
        <StatCard
          label="Total Brands"
          value={totalBrands.toString().padStart(2, "0")}
          hint={totalBrands === 0 ? "Register your first" : "Active in workspace"}
          hintTone="success"
        />
        <StatCard label="Campaigns" value={totalCampaigns.toLocaleString()} hint="Lifetime generated" />
        <StatCard label="AI Tokens" value="42.1k" hint="84% of monthly quota" hintTone="accent" />
        <StatCard label="Avg Latency" value="1.2s" hint="Streaming throughput" />
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 animate-entrance"
        style={{ animationDelay: "120ms" }}
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-card border border-border rounded-xl ring-1 ring-black/[0.03] h-[340px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-sm font-semibold">Generation Trends</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Weekly campaign volume</p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">LAST 12 WEEKS</span>
            </div>
            <div className="flex-1 flex items-end gap-2 pb-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm transition-all hover:opacity-80 ${
                    i === bars.length - 1
                      ? "bg-[color:var(--brand-accent)]"
                      : "bg-foreground/10"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="p-6 bg-foreground text-background rounded-2xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-background/50">
                  Rapid Forge
                </h4>
                <p className="text-lg font-serif-italic mt-1">
                  Generate a campaign in one keystroke.
                </p>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link to="/generator">
                  Open Generator <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-[11px]">
              {["Product Launch", "Brand Story", "Performance Ad"].map((t) => (
                <Link
                  to="/generator"
                  key={t}
                  className="p-3 bg-background/5 border border-background/10 rounded-lg hover:bg-background/10 transition-colors block"
                >
                  <span className="font-mono uppercase tracking-wider text-background/50 text-[9px]">
                    Template
                  </span>
                  <p className="mt-1">{t}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-xl ring-1 ring-black/[0.03]">
            <h3 className="text-sm font-semibold mb-6">Recent Activity</h3>
            <div className="space-y-5">
              {recent.length === 0 ? (
                <div className="flex gap-4">
                  <Clock className="size-3.5 text-muted-foreground mt-1" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium">No activity yet</p>
                    <p className="text-[11px] text-muted-foreground">
                      Generate a campaign to populate the log.
                    </p>
                  </div>
                </div>
              ) : (
                recent.map((c, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="pt-1">
                      <div
                        className={`size-2 rounded-full ${
                          i === 0
                            ? "bg-[color:var(--brand-accent)] ring-4 ring-[var(--brand-accent-soft)]"
                            : "bg-foreground/15"
                        }`}
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-medium truncate">Campaign for {c.brand_id}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{c.prompt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full mt-6 text-[10px] uppercase tracking-widest font-semibold"
            >
              <Link to="/history">View Full Log</Link>
            </Button>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl ring-1 ring-black/[0.03] space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Layers className="size-3.5" /> Workspace
            </h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Brands online</dt>
                <dd className="font-mono tabular">{totalBrands}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Campaigns indexed</dt>
                <dd className="font-mono tabular">{totalCampaigns}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Vector store</dt>
                <dd className="text-[color:var(--success)] font-medium">Healthy</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Region</dt>
                <dd className="font-mono">us-east-1</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}

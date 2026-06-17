import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { api, queryKeys, type CampaignRecord } from "@/lib/api";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — OmniForge" },
      { name: "description", content: "Search and revisit every generated campaign." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.campaigns,
    queryFn: api.getCampaigns,
  });
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<string>("all");
  const [open, setOpen] = useState<CampaignRecord | null>(null);

  const brands = useMemo(() => {
    const set = new Set<string>();
    data?.campaigns.forEach((c) => set.add(c.brand_id));
    return Array.from(set);
  }, [data]);

  const filtered = useMemo(() => {
    const list = data?.campaigns ?? [];
    return list
      .filter((c) => brand === "all" || c.brand_id === brand)
      .filter(
        (c) =>
          !q ||
          c.prompt.toLowerCase().includes(q.toLowerCase()) ||
          c.campaign.toLowerCase().includes(q.toLowerCase()) ||
          c.brand_id.toLowerCase().includes(q.toLowerCase()),
      )
      .slice()
      .reverse();
  }, [data, q, brand]);

  return (
    <Section>
      <PageHeader
        title="Campaign History"
        description="Search, filter, and revisit every campaign generated across your workspace."
      />

      <div className="flex flex-col sm:flex-row gap-3 animate-entrance">
        <div className="relative flex-1">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search campaigns, brands, prompts…"
            className="pl-9"
          />
        </div>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 animate-entrance" style={{ animationDelay: "100ms" }}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="p-12 border border-dashed border-border rounded-xl text-center">
            <p className="font-serif-italic text-xl">
              No campaigns {q || brand !== "all" ? "match" : "yet"}.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {q || brand !== "all"
                ? "Try clearing the filters."
                : "Head to the generator to create your first."}
            </p>
            <Button asChild size="sm" variant="outline" className="mt-5">
              <Link to="/generator">Open Generator</Link>
            </Button>
          </div>
        ) : (
          filtered.map((c, i) => (
            <button
              key={i}
              onClick={() => setOpen(c)}
              className="w-full text-left p-5 bg-card border border-border rounded-xl ring-1 ring-black/[0.03] hover:border-foreground/20 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-foreground/5 rounded">
                      {c.brand_id}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      #{filtered.length - i}
                    </span>
                  </div>
                  <p className="font-medium text-sm truncate">{c.prompt}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {c.campaign}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-muted-foreground">
                  View →
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent side="right" className="sm:max-w-2xl w-full overflow-y-auto">
          {open && <CampaignDetail record={open} />}
        </SheetContent>
      </Sheet>
    </Section>
  );
}

function CampaignDetail({ record }: { record: CampaignRecord }) {
  const copy = async () => {
    await navigator.clipboard.writeText(record.campaign);
    toast.success("Copied to clipboard");
  };
  const download = () => {
    const blob = new Blob([record.campaign], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.brand_id}-campaign.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-foreground/5 rounded">
            {record.brand_id}
          </span>
        </div>
        <SheetTitle className="font-serif-italic text-2xl font-normal">
          {record.prompt}
        </SheetTitle>
      </SheetHeader>
      <div className="flex items-center gap-2 my-6">
        <Button size="sm" variant="outline" onClick={copy}>
          <Copy className="size-3" /> Copy
        </Button>
        <Button size="sm" variant="outline" onClick={download}>
          <Download className="size-3" /> Export
        </Button>
        <Button asChild size="sm">
          <Link to="/generator" search={{ brand: record.brand_id }}>
            <RefreshCw className="size-3" /> Regenerate
          </Link>
        </Button>
      </div>
      <article className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/85 bg-foreground/[0.03] border border-border rounded-lg p-5">
        {record.campaign}
      </article>
    </>
  );
}
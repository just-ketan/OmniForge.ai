import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api, queryKeys } from "@/lib/api";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands — OmniForge" },
      {
        name: "description",
        content: "Manage brand assets, tone profiles, and competitive intelligence.",
      },
    ],
  }),
  component: BrandsPage,
});

const TONES = ["Professional", "Playful", "Sophisticated", "Bold", "Minimal", "Authoritative"];

function BrandsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.brands, queryFn: api.getBrands });
  const [open, setOpen] = useState(false);
  const [brandId, setBrandId] = useState("");
  const [tone, setTone] = useState("Professional");
  const [competitors, setCompetitors] = useState("");
  const [banned, setBanned] = useState("");

  const create = useMutation({
    mutationFn: () =>
      api.registerBrand(brandId, {
        tone,
        competitors: competitors.split(",").map((s) => s.trim()).filter(Boolean),
        banned_words: banned.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    onSuccess: () => {
      toast.success(`Brand "${brandId}" registered`);
      qc.invalidateQueries({ queryKey: queryKeys.brands });
      setOpen(false);
      setBrandId("");
      setCompetitors("");
      setBanned("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Section>
      <PageHeader
        title="Brand Workspace"
        description="Every brand maintained by OmniForge holds tone, competitor intelligence, and a knowledge base."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-3.5" /> Register brand
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-entrance">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))
          : data?.brands.map((name) => <BrandCard key={name} name={name} />)}

        <button
          onClick={() => setOpen(true)}
          className="h-44 p-5 border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-foreground/[0.02] hover:border-foreground/20 transition-colors"
        >
          <div className="size-10 rounded-full border border-dashed border-border flex items-center justify-center text-muted-foreground">
            <Plus className="size-4" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Register new brand</p>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register a brand</DialogTitle>
            <DialogDescription>
              Configure the tone profile and competitive context. You can refine later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-id">Brand name</Label>
              <Input
                id="brand-id"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                placeholder="e.g. Nike"
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="competitors">Competitors</Label>
              <Input
                id="competitors"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                placeholder="Adidas, Puma"
              />
              <p className="text-[11px] text-muted-foreground">Comma separated</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="banned">Banned words</Label>
              <Textarea
                id="banned"
                value={banned}
                onChange={(e) => setBanned(e.target.value)}
                placeholder="cheap, knock-off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!brandId.trim() || create.isPending}
              onClick={() => create.mutate()}
            >
              {create.isPending ? "Registering…" : "Register brand"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  );
}

function BrandCard({ name }: { name: string }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <Link
      to="/generator"
      search={{ brand: name }}
      className="p-5 bg-card border border-border rounded-xl ring-1 ring-black/[0.03] hover:border-foreground/20 transition-all group block"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="size-12 rounded-md bg-foreground text-background flex items-center justify-center font-mono text-sm">
          {initials}
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[color:var(--success)]/10 text-[color:var(--success)] text-[10px] font-medium uppercase tracking-wider">
          Active
        </span>
      </div>
      <h3 className="font-semibold tracking-tight">{name}</h3>
      <p className="text-xs text-muted-foreground mt-1">Professional · Knowledge base synced</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-tighter font-mono">
        <div className="p-2 bg-foreground/[0.04] rounded">Open generator</div>
        <div className="p-2 bg-foreground/[0.04] rounded text-right group-hover:text-[color:var(--brand-accent)] transition-colors">
          →
        </div>
      </div>
    </Link>
  );
}
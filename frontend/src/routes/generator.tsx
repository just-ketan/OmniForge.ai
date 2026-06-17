import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Copy, Download, Sparkles, Square, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, queryKeys } from "@/lib/api";

const searchSchema = z.object({ brand: z.string().optional() });

export const Route = createFileRoute("/generator")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Generator — OmniForge" },
      { name: "description", content: "Stream AI-generated brand campaigns in real time." },
    ],
  }),
  component: GeneratorPage,
});

const TEMPLATES = [
  {
    id: "launch",
    label: "Product launch",
    prompt:
      "Launch a new product with a bold headline, hero copy, and three supporting pillars.",
  },
  {
    id: "story",
    label: "Brand story",
    prompt:
      "Tell a brand origin story that emphasizes craftsmanship and timeless values.",
  },
  {
    id: "perf",
    label: "Performance ad",
    prompt:
      "Write a high-conversion performance ad with a clear CTA, social proof, and urgency.",
  },
  {
    id: "social",
    label: "Social campaign",
    prompt:
      "Design a multi-post social campaign with consistent voice and a closing CTA.",
  },
];

function GeneratorPage() {
  const { brand: brandParam } = Route.useSearch();
  const brandsQ = useQuery({ queryKey: queryKeys.brands, queryFn: api.getBrands });
  const [brand, setBrand] = useState<string>(brandParam ?? "");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!brand && brandsQ.data?.brands.length) setBrand(brandsQ.data.brands[0]);
  }, [brandsQ.data, brand]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [output]);

  const generate = async () => {
    if (!brand || !prompt.trim()) {
      toast.error("Pick a brand and write a prompt first.");
      return;
    }
    setOutput("");
    setStreaming(true);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      await api.generateStream(
        brand,
        prompt,
        (chunk) => setOutput((prev) => prev + chunk),
        ac.signal,
      );
      toast.success("Generation complete");
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast.error((e as Error).message || "Generation failed");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brand || "campaign"}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendFeedback = async (rating: number) => {
    try {
      await api.feedback({ brand_id: brand, prompt, response: output, rating });
      toast.success("Feedback recorded");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Section>
      <PageHeader
        title="Campaign Generator"
        description="Stream brand-aligned narratives with real-time intelligence."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-entrance">
        <div className="lg:col-span-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Brand
            </Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brandsQ.data?.brands.length ? (
                  brandsQ.data.brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    No brands yet — register one.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Templates
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setPrompt(t.prompt)}
                  className="text-left p-3 text-[11px] rounded-md border border-border hover:bg-foreground/[0.04] hover:border-foreground/20 transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Prompt
            </Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the campaign goal, audience, and key messaging pillars…"
              className="min-h-48 resize-y"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate();
              }}
            />
            <p className="text-[10px] font-mono text-muted-foreground">
              ⌘/Ctrl + Enter to generate
            </p>
          </div>

          <Button onClick={generate} disabled={streaming} className="w-full" size="lg">
            <Sparkles className="size-4" />
            {streaming ? "Streaming…" : "Generate streaming"}
          </Button>
        </div>

        <div className="lg:col-span-8 bg-foreground text-background rounded-2xl overflow-hidden flex flex-col min-h-[520px]">
          <div className="h-12 border-b border-background/10 flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={`size-1.5 rounded-full ${
                  streaming
                    ? "bg-[color:var(--success)] animate-pulse"
                    : "bg-background/30"
                }`}
              />
              <span className="text-[10px] font-mono uppercase tracking-widest text-background/50">
                {streaming ? "Live token stream" : "Output"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {streaming && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stop}
                  className="text-background/70 hover:text-background hover:bg-background/10"
                >
                  <Square className="size-3" /> Stop
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={copy}
                disabled={!output}
                className="text-background/70 hover:text-background hover:bg-background/10"
              >
                <Copy className="size-3" /> Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={download}
                disabled={!output}
                className="text-background/70 hover:text-background hover:bg-background/10"
              >
                <Download className="size-3" /> Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => sendFeedback(5)}
                disabled={!output}
                className="text-background/70 hover:text-background hover:bg-background/10"
              >
                <ThumbsUp className="size-3" />
              </Button>
            </div>
          </div>

          <div
            ref={outputRef}
            className="flex-1 p-6 md:p-8 font-mono text-sm leading-relaxed text-background/85 overflow-y-auto whitespace-pre-wrap"
          >
            {output ? (
              <>
                {output}
                {streaming && (
                  <span className="inline-block w-2 h-4 bg-background/70 cursor-pulse align-middle ml-1" />
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-background/40">
                <Sparkles className="size-6" strokeWidth={1.5} />
                <p className="font-serif-italic text-xl text-background/70">Awaiting prompt.</p>
                <p className="text-xs font-sans max-w-sm">
                  Pick a brand, write or select a template, and the model will stream the campaign
                  in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}